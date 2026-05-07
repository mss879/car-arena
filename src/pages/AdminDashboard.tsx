import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type TestimonialRow = {
  id: string;
  created_at: string;
  author_name: string | null;
  content: string | null;
  image_path: string | null;
  image_alt: string | null;
  featured: boolean | null;
  created_by: string | null;
};

const BUCKET = "testimonials";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  // Add form state
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editAuthor, setEditAuthor] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editCurrentImageUrl, setEditCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setSessionUserId(data.session.user.id);
      await refreshList();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshList = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    setItems((data as unknown as TestimonialRow[]) ?? []);
    setLoading(false);
  };

  const itemsWithImageUrl = useMemo(
    () =>
      items.map((t) => {
        const publicUrl = t.image_path
          ? supabase.storage.from(BUCKET).getPublicUrl(t.image_path).data.publicUrl
          : null;
        return { ...t, publicUrl } as TestimonialRow & { publicUrl: string | null };
      }),
    [items]
  );

  const resetForm = () => {
    setAuthor("");
    setContent("");
    setImageFile(null);
  };

  const resetEditForm = () => {
    setEditId(null);
    setEditAuthor("");
    setEditContent("");
    setEditImageFile(null);
    setEditCurrentImageUrl(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUserId) return;
    setSubmitting(true);
    setError(null);
    try {
      let uploadedPath: string | null = null;
      if (imageFile) {
        const filePath = `${sessionUserId}/${Date.now()}-${imageFile.name}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type || undefined,
          });
        if (upErr) throw upErr;
        uploadedPath = filePath;
      }

      const { error: insErr } = await supabase
        .from("testimonials")
        .insert({
          author_name: author || null,
          content: content || null,
          image_path: uploadedPath,
          image_alt: author ? `Testimonial by ${author}` : null,
          created_by: sessionUserId,
        });
      if (insErr) throw insErr;

      await refreshList();
      resetForm();
      // Show confirmation toast
      toast({
        title: "Testimonial added",
        description: "The testimonial has been successfully added.",
      });
    } catch (e: any) {
      setError(e?.message || "Failed to save testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (t: TestimonialRow & { publicUrl?: string | null }) => {
    setEditId(t.id);
    setEditAuthor(t.author_name || "");
    setEditContent(t.content || "");
    setEditImageFile(null);
    setEditCurrentImageUrl(t.publicUrl ?? null);
    setEditDialogOpen(true);
  };

  const onEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUserId || !editId) return;
    setEditSubmitting(true);
    setError(null);
    try {
      let uploadedPath: string | null = null;
      if (editImageFile) {
        const filePath = `${sessionUserId}/${Date.now()}-${editImageFile.name}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, editImageFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: editImageFile.type || undefined,
          });
        if (upErr) throw upErr;
        uploadedPath = filePath;
      }

      const { error: updErr } = await supabase
        .from("testimonials")
        .update({
          author_name: editAuthor || null,
          content: editContent || null,
          image_path: uploadedPath ?? undefined,
          image_alt: editAuthor ? `Testimonial by ${editAuthor}` : null,
        })
        .eq("id", editId);
      if (updErr) throw updErr;

      await refreshList();
      setEditDialogOpen(false);
      resetEditForm();
      toast({
        title: "Testimonial updated",
        description: "Your changes have been saved.",
      });
    } catch (e: any) {
      setError(e?.message || "Failed to update testimonial");
    } finally {
      setEditSubmitting(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      await refreshList();
    }
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <main className="container mx-auto max-w-6xl py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage testimonials: create, edit, remove.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/analytics")}>View Analytics</Button>
          <Button variant="secondary" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      {/* Form */}
      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Add a new testimonial</CardTitle>
            <CardDescription>Fields are optional. Include an image for richer testimonials.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="author">Author (optional)</Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Jane Doe"
                  disabled={submitting}
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="content">Content (optional)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share the testimonial..."
                  disabled={submitting}
                  className="min-h-[6rem]"
                />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="image">Image (optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  disabled={submitting}
                />
                {imageFile && (
                  <p className="text-xs text-muted-foreground">Selected: {imageFile.name}</p>
                )}
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save"}
                </Button>
              </div>
              {error && <p className="md:col-span-2 text-sm text-destructive">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </section>

      {/* List */}
      <section className="mt-10">
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : itemsWithImageUrl.length === 0 ? (
          <div className="text-muted-foreground">No testimonials yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {itemsWithImageUrl.map((t) => (
              <Card key={t.id} className="overflow-hidden">
                {t.publicUrl ? (
                  <img src={t.publicUrl} alt={t.image_alt || ""} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-2 w-full" />
                )}
                <CardContent className="pt-4">
                  {t.content ? <p className="text-sm leading-relaxed">{t.content}</p> : <p className="text-sm italic text-muted-foreground">(Image only)</p>}
                  {t.author_name && <p className="mt-3 text-xs text-muted-foreground">— {t.author_name}</p>}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(t)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(t.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) {
          resetEditForm();
        }
      }}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit testimonial</DialogTitle>
            <DialogDescription>Update the content or image. Leave image empty to keep the current one.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onEditSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-author">Author (optional)</Label>
              <Input
                id="edit-author"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                placeholder="Jane Doe"
                disabled={editSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content (optional)</Label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Share the testimonial..."
                disabled={editSubmitting}
                className="min-h-[6rem]"
              />
            </div>
            {editCurrentImageUrl && (
              <div className="grid gap-2">
                <Label>Current image</Label>
                <div className="w-full rounded-md border bg-muted/30 p-2">
                  <img
                    src={editCurrentImageUrl}
                    alt={editAuthor ? `Testimonial by ${editAuthor}` : "Current testimonial image"}
                    className="max-h-80 w-full rounded object-contain"
                  />
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="edit-image">Replace image (optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)}
                disabled={editSubmitting}
              />
              {editImageFile && (
                <p className="text-xs text-muted-foreground">Selected: {editImageFile.name}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={editSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={editSubmitting}>
                {editSubmitting ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminDashboard;
