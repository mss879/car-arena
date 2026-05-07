import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Reveal } from "@/components/Reveal";
import { SEO } from "@/lib/seo";

type TestimonialRow = {
  id: string;
  created_at: string;
  author_name: string | null;
  content: string | null;
  image_path: string | null;
  image_alt: string | null;
  featured: boolean | null;
};

const BUCKET = "testimonials";

const Testimonials = () => {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<
    (TestimonialRow & { publicUrl: string | null; fullUrl: string | null }) | null
  >(null);
  const [open, setOpen] = useState(false);
  // pagination
  const PAGE_SIZE = 9;
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState<number | null>(null);

  // Form state (shown only when authenticated)
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Check auth session to conditionally show the add form
      const { data: sess } = await supabase.auth.getSession();
      if (isMounted) setSessionUserId(sess.session?.user?.id ?? null);

      setLoading(true);
      setError(null);
      // Fetch first page with exact count and only needed fields
      const from = 0;
      const to = PAGE_SIZE - 1;
      const { data, error, count } = await supabase
        .from("testimonials")
        .select("id, created_at, author_name, content, image_path, image_alt", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (!isMounted) return;

      if (error) {
        setError(error.message);
        setItems([]);
      } else {
        setItems((data as unknown as TestimonialRow[]) ?? []);
        setTotal(typeof count === "number" ? count : null);
        setPage(0);
      }
      setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const from = nextPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, created_at, author_name, content, image_path, image_alt")
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      setItems((prev) => [...prev, ...((data as unknown as TestimonialRow[]) ?? [])]);
      setPage(nextPage);
    } catch (e: any) {
      setError(e?.message || "Failed to load more testimonials");
    } finally {
      setLoadingMore(false);
    }
  };

  const itemsWithImageUrl = useMemo(
    () =>
      items.map((t) => {
        // Use plain public URL (image transformations require Supabase Pro)
        const publicUrl = t.image_path
          ? supabase.storage
              .from(BUCKET)
              .getPublicUrl(t.image_path).data.publicUrl
          : null;
        return { ...t, publicUrl, fullUrl: publicUrl } as TestimonialRow & {
          publicUrl: string | null;
          fullUrl: string | null;
        };
      }),
    [items]
  );

  // Create a compact preview for long testimonials
  const getPreview = (txt: string | null, max = 260) => {
    if (!txt) return null;
    if (txt.length <= max) return txt;
    // cut on word boundary when possible
    const slice = txt.slice(0, max);
    const lastSpace = slice.lastIndexOf(" ");
    return `${lastSpace > 180 ? slice.slice(0, lastSpace) : slice}…`;
  };

  return (
    <main className="container mx-auto max-w-6xl py-12">
      <SEO
        title="Customer Testimonials | Car Dealer Colombo & Japanese Imports"
        description="Customer testimonials about cars for sale Sri Lanka, Japanese car import Sri Lanka experience, brand new and used cars from Car Arena Ceylon."
        canonical="https://cararenaceylon.com/testimonials"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="car dealer Colombo reviews, Japanese car import Sri Lanka testimonials, used cars Sri Lanka feedback"
      />
      <div className="sr-only">
        <h2>Reviews on Used Cars and Brand New Cars Sri Lanka</h2>
        <p>Drivers share experiences on securing used cars Sri Lanka inventory, brand new cars Sri Lanka orders and Japanese car import Sri Lanka services.</p>
      </div>
      <Reveal as="header" className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Testimonials
          </h1>
          <div className="mt-3 h-[2px] w-20 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500/70 rounded-full" />
          <p className="mt-3 text-muted-foreground text-justify">
            Real stories from our customers.
          </p>
        </div>
      </Reveal>

      {/* Authenticated submit form */}
      {sessionUserId && (
        <section className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={async (e: FormEvent) => {
                  e.preventDefault();
                  setSubmitting(true);
                  setError(null);
                  try {
                    let uploadedPath: string | null = null;
                    if (imageFile) {
                      const filePath = `${sessionUserId}/${Date.now()}-${imageFile.name}`;
                      const { error: upErr } = await supabase
                        .storage
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

                    // Refresh first page with pagination
                    const { data: refreshed, count } = await supabase
                      .from("testimonials")
                      .select("id, created_at, author_name, content, image_path, image_alt", { count: "exact" })
                      .order("created_at", { ascending: false })
                      .range(0, PAGE_SIZE - 1);
                    setItems((refreshed as unknown as TestimonialRow[]) ?? []);
                    if (typeof count === "number") setTotal(count);
                    setPage(0);

                    // Reset form
                    setAuthor("");
                    setContent("");
                    setImageFile(null);
                  } catch (e: any) {
                    setError(e?.message || "Failed to submit testimonial");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Your name (optional)</label>
                  <input
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    placeholder="Jane Doe"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
                <div className="grid gap-2 md:col-span-2">
                  <label className="text-sm font-medium">Testimonial (optional)</label>
                  <textarea
                    className="min-h-[6rem] rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Share your experience..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Add testimonial"}
                  </button>
                </div>
              </form>
              {error && <p className="mt-3 text-sm text-destructive text-justify">{error}</p>}
            </CardContent>
          </Card>
        </section>
      )}

  {/* Content states */}
      {loading && (
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-t-lg" />
              <CardContent>
                <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                <div className="mt-2 h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {!loading && error && (
        <section className="mt-10">
          <p className="text-destructive text-justify">Failed to load testimonials: {error}</p>
        </section>
      )}

      {!loading && !error && itemsWithImageUrl.length === 0 && (
        <section className="mt-10">
          <p className="text-muted-foreground text-justify">No testimonials yet. Add some in Supabase Studio.</p>
        </section>
      )}

      {!loading && !error && itemsWithImageUrl.length > 0 && (
        <section className="mt-10 relative">
          {/* Subtle luxury background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
            <div className="mx-auto h-64 w-64 rounded-full blur-3xl bg-amber-500/10" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
            {itemsWithImageUrl.map((t, idx) => {
              const preview = getPreview(t.content, 260);
              const isTruncated = !!t.content && preview !== t.content;
              return (
                <Reveal key={t.id} delay={idx * 80}>
                  <Card
                    className="group relative overflow-hidden h-full flex flex-col cursor-pointer rounded-xl bg-black transition-all duration-500
                    border-2 border-[#C2A661]/60 hover:border-[#E6D090]/80
                    ring-2 ring-inset ring-[#C2A661]/30 hover:ring-[#E6D090]/40
                    shadow-[0_20px_40px_-18px_rgba(0,0,0,0.70),0_10px_30px_-20px_rgba(194,166,97,0.28)] hover:shadow-[0_24px_48px_-20px_rgba(0,0,0,0.75),0_14px_36px_-18px_rgba(230,208,144,0.36)]
                    hover:-translate-y-1
                    before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:shadow-[inset_0_1px_0_rgba(230,208,144,0.20),inset_0_-1px_0_rgba(0,0,0,0.40)]
                    after:content-[''] after:absolute after:inset-px after:rounded-[inherit] after:pointer-events-none after:bg-gradient-to-b after:from-[#E6D090]/12 after:via-transparent after:to-transparent"
                    onClick={() => {
                    if (!t.content && !t.publicUrl) return;
                    setSelected(t);
                    setOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!t.content && !t.publicUrl) return;
                      setSelected(t);
                      setOpen(true);
                    }
                    }}
                  >
                    {/* Fixed-height image area for equal card heights */}
                    {t.publicUrl ? (
                      <div className="w-full h-56 sm:h-64 bg-black/5 overflow-hidden">
                        <img
                          src={t.publicUrl}
                          alt={t.image_alt || "Testimonial image"}
                          className="w-full h-full object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-2 bg-muted" />
                    )}
                    <CardContent className="pt-4 flex-1 flex flex-col">
                      {preview ? (
                        <p className="text-sm leading-relaxed text-justify">
                          {preview}
                          {isTruncated && (
                            <span className="ml-2 text-xs text-[#E6D090] underline underline-offset-4">Read more</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-sm italic text-muted-foreground text-justify">(Image only)</p>
                      )}
                      <div className="mt-3 flex items-baseline justify-between gap-3">
                        {t.author_name && (
                          <p className="text-xs text-muted-foreground text-justify">— {t.author_name}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              );
            })}
          </div>
          {/* Load more for pagination */}
          {typeof total === "number" && itemsWithImageUrl.length < total && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more"}
              </button>
            </div>
          )}

          {/* Full testimonial modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-y-auto overscroll-contain">
              {selected?.fullUrl && (
                <div className="w-full h-64 sm:h-80 bg-black/5">
                  <img
                    src={selected.fullUrl}
                    alt={selected?.image_alt || "Testimonial image"}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-left">
                    {selected?.author_name || "Testimonial"}
                  </DialogTitle>
                </DialogHeader>
                {selected?.content && (
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-justify">
                    {selected.content}
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </section>
      )}
    </main>
  );
};

export default Testimonials;
