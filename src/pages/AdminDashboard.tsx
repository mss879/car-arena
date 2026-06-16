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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RichTextEditor } from "@/components/RichTextEditor";
import { compressAndConvertToWebP } from "@/lib/imageCompression";
import { Trash, Edit, Plus, X, Loader2 } from "lucide-react";

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

type VehicleRow = {
  id: string;
  created_at: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuel_type: string;
  engine_capacity: string | null;
  body_type: string | null;
  condition: string;
  description: string;
  images: string[];
  featured: boolean | null;
  status: string;
  created_by: string | null;
};

const TESTIMONIALS_BUCKET = "testimonials";
const VEHICLES_BUCKET = "vehicles";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("vehicles");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Testimonial State ---
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false);

  // Edit Testimonial State
  const [editTestimonialOpen, setEditTestimonialOpen] = useState(false);
  const [editTestimonialId, setEditTestimonialId] = useState<string | null>(null);
  const [editAuthor, setEditAuthor] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editSubmittingTestimonial, setEditSubmittingTestimonial] = useState(false);
  const [editCurrentImageUrl, setEditCurrentImageUrl] = useState<string | null>(null);

  // --- Vehicle State ---
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [transmission, setTransmission] = useState("Automatic");
  const [fuelType, setFuelType] = useState("Petrol");
  const [engineCapacity, setEngineCapacity] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [condition, setCondition] = useState("Brand New");
  const [description, setDescription] = useState("");
  const [vehicleImages, setVehicleImages] = useState<File[]>([]);
  const [compressingImages, setCompressingImages] = useState(false);
  const [status, setStatus] = useState("Available");
  const [featured, setFeatured] = useState(false);
  const [submittingVehicle, setSubmittingVehicle] = useState(false);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);

  // Edit Vehicle State
  const [editVehicleOpen, setEditVehicleOpen] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState<string | null>(null);
  const [editMake, setEditMake] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editYear, setEditYear] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editMileage, setEditMileage] = useState("");
  const [editTransmission, setEditTransmission] = useState("");
  const [editFuelType, setEditFuelType] = useState("");
  const [editEngineCapacity, setEditEngineCapacity] = useState("");
  const [editBodyType, setEditBodyType] = useState("");
  const [editCondition, setEditCondition] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVehicleStatus, setEditVehicleStatus] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [existingImagesPaths, setExistingImagesPaths] = useState<string[]>([]);
  const [newVehicleImages, setNewVehicleImages] = useState<File[]>([]);
  const [editSubmittingVehicle, setEditSubmittingVehicle] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setSessionUserId(data.session.user.id);
      await refreshData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch testimonials
      const { data: testData, error: testErr } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (testErr) throw testErr;
      setTestimonials((testData as unknown as TestimonialRow[]) ?? []);

      // Fetch vehicles
      const { data: vehData, error: vehErr } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });
      if (vehErr) throw vehErr;
      setVehicles((vehData as unknown as VehicleRow[]) ?? []);

    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const onSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  // --- Testimonial Actions ---
  const testimonialsWithUrls = useMemo(() => {
    return testimonials.map((t) => {
      const publicUrl = t.image_path
        ? supabase.storage.from(TESTIMONIALS_BUCKET).getPublicUrl(t.image_path).data.publicUrl
        : null;
      return { ...t, publicUrl } as TestimonialRow & { publicUrl: string | null };
    });
  }, [testimonials]);

  const resetTestimonialForm = () => {
    setAuthor("");
    setContent("");
    setImageFile(null);
  };

  const onSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUserId) return;
    setSubmittingTestimonial(true);
    setError(null);
    try {
      let uploadedPath: string | null = null;
      if (imageFile) {
        const filePath = `${sessionUserId}/${Date.now()}-${imageFile.name}`;
        const { error: upErr } = await supabase.storage
          .from(TESTIMONIALS_BUCKET)
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

      await refreshData();
      resetTestimonialForm();
      toast({
        title: "Testimonial added",
        description: "The testimonial has been successfully added.",
      });
    } catch (e: any) {
      setError(e?.message || "Failed to save testimonial");
    } finally {
      setSubmittingTestimonial(false);
    }
  };

  const onEditTestimonialClick = (t: TestimonialRow & { publicUrl?: string | null }) => {
    setEditTestimonialId(t.id);
    setEditAuthor(t.author_name || "");
    setEditContent(t.content || "");
    setEditImageFile(null);
    setEditCurrentImageUrl(t.publicUrl ?? null);
    setEditTestimonialOpen(true);
  };

  const onEditTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUserId || !editTestimonialId) return;
    setEditSubmittingTestimonial(true);
    setError(null);
    try {
      let uploadedPath: string | null = null;
      if (editImageFile) {
        const filePath = `${sessionUserId}/${Date.now()}-${editImageFile.name}`;
        const { error: upErr } = await supabase.storage
          .from(TESTIMONIALS_BUCKET)
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
        .eq("id", editTestimonialId);
      if (updErr) throw updErr;

      await refreshData();
      setEditTestimonialOpen(false);
      toast({
        title: "Testimonial updated",
        description: "Your changes have been saved.",
      });
    } catch (e: any) {
      setError(e?.message || "Failed to update testimonial");
    } finally {
      setEditSubmittingTestimonial(false);
    }
  };

  const onDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      setError(error.message);
    } else {
      await refreshData();
    }
  };

  // --- Vehicle Actions ---
  const vehiclesWithUrls = useMemo(() => {
    return vehicles.map((v) => {
      const imageUrls = (v.images || []).map((img) =>
        supabase.storage.from(VEHICLES_BUCKET).getPublicUrl(img).data.publicUrl
      );
      return { ...v, imageUrls } as VehicleRow & { imageUrls: string[] };
    });
  }, [vehicles]);

  const resetVehicleForm = () => {
    setMake("");
    setModel("");
    setYear("");
    setPrice("");
    setMileage("");
    setTransmission("Automatic");
    setFuelType("Petrol");
    setEngineCapacity("");
    setBodyType("");
    setCondition("Brand New");
    setDescription("");
    setVehicleImages([]);
    setStatus("Available");
    setFeatured(false);
  };

  // Handle selected vehicle images with in-browser compression to webp
  const handleVehicleImagesChange = async (files: FileList | null) => {
    if (!files) return;
    
    // Check if adding these would exceed 10
    const totalFilesCount = vehicleImages.length + files.length;
    if (totalFilesCount > 10) {
      toast({
        title: "Image limit exceeded",
        description: "You can only upload up to 10 images. Accepting the first 10.",
        variant: "destructive",
      });
    }

    setCompressingImages(true);
    try {
      const compressedList: File[] = [...vehicleImages];
      // Limit to 10 overall
      const remainingSlots = 10 - compressedList.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        const compressedBlob = await compressAndConvertToWebP(file, 0.8, 1920);
        const webpName = `${file.name.substring(0, file.name.lastIndexOf(".")) || file.name}.webp`;
        const webpFile = new File([compressedBlob], webpName, { type: "image/webp" });
        compressedList.push(webpFile);
      }
      setVehicleImages(compressedList);
    } catch (err: any) {
      toast({
        title: "Compression failed",
        description: err.message || "Could not compress images.",
        variant: "destructive",
      });
    } finally {
      setCompressingImages(false);
    }
  };

  // Remove a selected image before upload
  const removeSelectedImage = (index: number) => {
    setVehicleImages(vehicleImages.filter((_, i) => i !== index));
  };

  // Add vehicle
  const onSubmitVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUserId) return;
    if (!make || !model || !year || !price || !mileage) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields (Make, Model, Year, Price, Mileage).",
        variant: "destructive",
      });
      return;
    }
    setSubmittingVehicle(true);
    setError(null);
    try {
      const uploadedPaths: string[] = [];

      for (let i = 0; i < vehicleImages.length; i++) {
        const file = vehicleImages[i];
        const filePath = `${sessionUserId}/${Date.now()}-${i}.webp`;
        const { error: upErr } = await supabase.storage
          .from(VEHICLES_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/webp",
          });
        if (upErr) throw upErr;
        uploadedPaths.push(filePath);
      }

      const { error: insErr } = await supabase
        .from("vehicles")
        .insert({
          make,
          model,
          year: parseInt(year),
          price: parseFloat(price),
          mileage: parseInt(mileage),
          transmission,
          fuel_type: fuelType,
          engine_capacity: engineCapacity || null,
          body_type: bodyType || null,
          condition,
          description,
          images: uploadedPaths,
          featured,
          status,
          created_by: sessionUserId,
        });
      if (insErr) throw insErr;

      await refreshData();
      resetVehicleForm();
      setAddVehicleOpen(false);
      toast({
        title: "Vehicle Listing Added",
        description: "Successfully published vehicle listing.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create vehicle listing");
    } finally {
      setSubmittingVehicle(false);
    }
  };

  // Edit Vehicle Triggers
  const onEditVehicleClick = (v: VehicleRow) => {
    setEditVehicleId(v.id);
    setEditMake(v.make);
    setEditModel(v.model);
    setEditYear(v.year.toString());
    setEditPrice(v.price.toString());
    setEditMileage(v.mileage.toString());
    setEditTransmission(v.transmission);
    setEditFuelType(v.fuel_type);
    setEditEngineCapacity(v.engine_capacity || "");
    setEditBodyType(v.body_type || "");
    setEditCondition(v.condition);
    setEditDescription(v.description);
    setEditVehicleStatus(v.status);
    setEditFeatured(!!v.featured);
    setExistingImagesPaths(v.images || []);
    setNewVehicleImages([]);
    setEditVehicleOpen(true);
  };

  // Handle addition of new images in Edit modal
  const handleEditVehicleImagesChange = async (files: FileList | null) => {
    if (!files) return;

    const totalCount = existingImagesPaths.length + newVehicleImages.length + files.length;
    if (totalCount > 10) {
      toast({
        title: "Image limit exceeded",
        description: "A listing can only have up to 10 images.",
        variant: "destructive",
      });
    }

    setCompressingImages(true);
    try {
      const compressedList: File[] = [...newVehicleImages];
      const remainingSlots = 10 - existingImagesPaths.length - compressedList.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        const compressedBlob = await compressAndConvertToWebP(file, 0.8, 1920);
        const webpName = `${file.name.substring(0, file.name.lastIndexOf(".")) || file.name}.webp`;
        const webpFile = new File([compressedBlob], webpName, { type: "image/webp" });
        compressedList.push(webpFile);
      }
      setNewVehicleImages(compressedList);
    } catch (err: any) {
      toast({
        title: "Compression failed",
        description: err.message || "Could not compress images.",
        variant: "destructive",
      });
    } finally {
      setCompressingImages(false);
    }
  };

  const removeExistingImage = (pathToRemove: string) => {
    setExistingImagesPaths(existingImagesPaths.filter((path) => path !== pathToRemove));
  };

  const removeNewSelectedImage = (index: number) => {
    setNewVehicleImages(newVehicleImages.filter((_, i) => i !== index));
  };

  // Submit edit vehicle
  const onEditVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionUserId || !editVehicleId) return;
    if (!editMake || !editModel || !editYear || !editPrice || !editMileage) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields (Make, Model, Year, Price, Mileage).",
        variant: "destructive",
      });
      return;
    }
    setEditSubmittingVehicle(true);
    setError(null);

    try {
      const uploadedPaths: string[] = [...existingImagesPaths];

      // Upload new images
      for (let i = 0; i < newVehicleImages.length; i++) {
        const file = newVehicleImages[i];
        const filePath = `${sessionUserId}/${Date.now()}-edit-${i}.webp`;
        const { error: upErr } = await supabase.storage
          .from(VEHICLES_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: "image/webp",
          });
        if (upErr) throw upErr;
        uploadedPaths.push(filePath);
      }

      const { error: updErr } = await supabase
        .from("vehicles")
        .update({
          make: editMake,
          model: editModel,
          year: parseInt(editYear),
          price: parseFloat(editPrice),
          mileage: parseInt(editMileage),
          transmission: editTransmission,
          fuel_type: editFuelType,
          engine_capacity: editEngineCapacity || null,
          body_type: editBodyType || null,
          condition: editCondition,
          description: editDescription,
          images: uploadedPaths,
          status: editVehicleStatus,
          featured: editFeatured,
        })
        .eq("id", editVehicleId);
      if (updErr) throw updErr;

      await refreshData();
      setEditVehicleOpen(false);
      toast({
        title: "Listing Updated",
        description: "Successfully updated vehicle listing details.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to update vehicle listing");
    } finally {
      setEditSubmittingVehicle(false);
    }
  };

  const onDeleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle listing?")) return;
    const { error: delErr } = await supabase.from("vehicles").delete().eq("id", id);
    if (delErr) {
      setError(delErr.message);
    } else {
      await refreshData();
      toast({
        title: "Listing Deleted",
        description: "The vehicle listing has been deleted.",
      });
    }
  };

  const formatLKR = (val: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val).replace("LKR", "Rs.");
  };

  return (
    <main className="container mx-auto max-w-6xl py-12 px-6">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-bold font-serif text-white tracking-tight">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">Manage client content and vehicle listings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 hover:bg-zinc-800 text-white" onClick={() => navigate("/admin/analytics")}>
            View Analytics
          </Button>
          <Button variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 text-white border-0" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <Tabs defaultValue="vehicles" className="mt-8" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="bg-zinc-950 border border-white/10 p-1">
          <TabsTrigger value="vehicles" className="data-[state=active]:bg-[#C2A661] data-[state=active]:text-black text-white/80">
            Vehicle Listings
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="data-[state=active]:bg-[#C2A661] data-[state=active]:text-black text-white/80">
            Testimonials
          </TabsTrigger>
        </TabsList>

        {/* --- Vehicle Listings Tab --- */}
        <TabsContent value="vehicles" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          
          {/* Header & Add Button */}
          <div className="flex justify-between items-center mt-6 border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold font-serif text-white">Available Vehicle Listings</h2>
            <Button 
              onClick={() => {
                resetVehicleForm();
                setAddVehicleOpen(true);
              }} 
              className="bg-[#C2A661] text-black font-semibold hover:bg-[#E6D090] rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Listing
            </Button>
          </div>

          {/* List of Vehicles */}
          <section className="mt-4">
            {loading ? (
              <div className="text-zinc-400">Loading listings...</div>
            ) : vehiclesWithUrls.length === 0 ? (
              <div className="text-zinc-500 py-12 bg-zinc-950/20 border border-dashed border-white/10 text-center rounded-xl">
                No vehicles listed yet. Click "Add Listing" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehiclesWithUrls.map((car) => {
                  const mainImage = car.imageUrls && car.imageUrls.length > 0 ? car.imageUrls[0] : "/placeholder.svg";
                  return (
                    <Card key={car.id} className="overflow-hidden bg-zinc-950 border-white/10 text-white flex flex-col justify-between">
                      <div>
                        <div className="aspect-[16/10] bg-zinc-900 overflow-hidden relative">
                          <img src={mainImage} alt="" className="object-cover w-full h-full" />
                          <span className="absolute top-2 left-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-950/80 rounded border border-white/15">
                            {car.condition}
                          </span>
                          <span className="absolute top-2 right-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-zinc-950/80 rounded border border-white/15 text-[#E6D090]">
                            {car.status}
                          </span>
                        </div>
                        <CardContent className="pt-4">
                          <h3 className="text-lg font-bold truncate">{car.year} {car.make} {car.model}</h3>
                          <p className="text-[#E6D090] font-bold mt-1 text-base">{formatLKR(car.price)}</p>
                          <div className="text-xs text-zinc-400 mt-2 grid grid-cols-2 gap-1 pb-2 border-b border-white/5">
                            <span>{car.mileage.toLocaleString()} km</span>
                            <span>{car.transmission}</span>
                            <span>{car.fuel_type}</span>
                            <span>{car.body_type || "N/A"}</span>
                          </div>
                        </CardContent>
                      </div>
                      <div className="p-5 pt-0 flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => onEditVehicleClick(car)} className="flex-1 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white">
                          <Edit className="h-3.5 w-3.5 mr-1.5" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDeleteVehicle(car.id)} className="bg-rose-950/60 border border-rose-500/25 hover:bg-rose-900 text-rose-300">
                          <Trash className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* Add Vehicle Dialog */}
          <Dialog open={addVehicleOpen} onOpenChange={(open) => {
            setAddVehicleOpen(open);
            if (!open) {
              resetVehicleForm();
            }
          }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 text-white border-white/10 ring-1 ring-[#C2A661]/20 p-6 md:p-8">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl font-bold">Add New Vehicle Listing</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Fill in the specifications below. Upload up to 10 images.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmitVehicle} className="space-y-6 mt-4">
                {/* Grid Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      placeholder="Toyota, Honda, BMW..."
                      disabled={submittingVehicle}
                      className="bg-black/50 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Aqua, Civic, X5..."
                      disabled={submittingVehicle}
                      className="bg-black/50 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max="2030"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2021"
                      disabled={submittingVehicle}
                      className="bg-black/50 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (LKR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="6800000"
                      disabled={submittingVehicle}
                      className="bg-black/50 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage (km) *</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="45000"
                      disabled={submittingVehicle}
                      className="bg-black/50 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transmission">Transmission *</Label>
                    <Select value={transmission} onValueChange={setTransmission} disabled={submittingVehicle}>
                      <SelectTrigger className="bg-black/50 border-white/10 text-white">
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Tiptronic">Tiptronic</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type *</Label>
                    <Select value={fuelType} onValueChange={setFuelType} disabled={submittingVehicle}>
                      <SelectTrigger className="bg-black/50 border-white/10 text-white">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="PHEV">Plug-in Hybrid (PHEV)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="engineCapacity">Engine Capacity (e.g. 1500 cc)</Label>
                    <Input
                      id="engineCapacity"
                      value={engineCapacity}
                      onChange={(e) => setEngineCapacity(e.target.value)}
                      placeholder="1500 cc"
                      disabled={submittingVehicle}
                      className="bg-black/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyType">Body Type (e.g. SUV, Sedan)</Label>
                    <Input
                      id="bodyType"
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value)}
                      placeholder="Sedan"
                      disabled={submittingVehicle}
                      className="bg-black/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={condition} onValueChange={setCondition} disabled={submittingVehicle}>
                      <SelectTrigger className="bg-black/50 border-white/10 text-white">
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Brand New">Brand New</SelectItem>
                        <SelectItem value="Reconditioned">Reconditioned</SelectItem>
                        <SelectItem value="Used">Used</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Listing Status *</Label>
                    <Select value={status} onValueChange={setStatus} disabled={submittingVehicle}>
                      <SelectTrigger className="bg-black/50 border-white/10 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Reserved">Reserved</SelectItem>
                        <SelectItem value="Sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-3 pt-8">
                    <Checkbox
                      id="featured"
                      checked={featured}
                      onCheckedChange={(checked) => setFeatured(!!checked)}
                      disabled={submittingVehicle}
                      className="border-white/20 data-[state=checked]:bg-[#C2A661] data-[state=checked]:text-black"
                    />
                    <Label htmlFor="featured" className="text-sm cursor-pointer">Featured Listing</Label>
                  </div>
                </div>

                {/* Description Rich Text Editor */}
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    disabled={submittingVehicle}
                    placeholder="Enter vehicle specs, features, highlights, and history..."
                  />
                </div>

                {/* Image Upload Area with Compression to WebP */}
                <div className="space-y-3">
                  <Label htmlFor="images">Images (Optional, WebP Compression Auto-Applied, Max 10)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleVehicleImagesChange(e.target.files)}
                      disabled={submittingVehicle || compressingImages || vehicleImages.length >= 10}
                      className="bg-black/50 border-white/10 text-white file:text-[#C2A661] file:bg-zinc-900 file:border-0 hover:file:bg-zinc-800"
                    />
                    {compressingImages && <Loader2 className="animate-spin text-[#C2A661]" />}
                  </div>
                  
                  {/* Selected Image Thumbnails */}
                  {vehicleImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 p-3 bg-zinc-900/50 border border-white/5 rounded-xl">
                      {vehicleImages.map((file, idx) => {
                        const previewUrl = URL.createObjectURL(file);
                        return (
                          <div key={idx} className="relative aspect-[16/10] w-24 rounded overflow-hidden border border-white/10">
                            <img src={previewUrl} alt="" className="object-cover w-full h-full" />
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <span className="absolute bottom-0 inset-x-0 text-[8px] bg-black/75 py-0.5 text-center text-zinc-300 truncate px-1">
                              {file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)}MB` : `${(file.size / 1024).toFixed(0)}KB`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-zinc-800" onClick={() => setAddVehicleOpen(false)} disabled={submittingVehicle}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submittingVehicle || compressingImages} className="bg-[#C2A661] hover:bg-[#E6D090] text-black font-semibold">
                    {submittingVehicle ? "Saving..." : "Save Listing"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* --- Testimonials Tab --- */}
        <TabsContent value="testimonials" className="space-y-8 focus-visible:outline-none focus-visible:ring-0">
          <section className="mt-6">
            <Card className="bg-zinc-950 border-white/10 text-white">
              <CardHeader>
                <CardTitle className="font-serif">Add a new testimonial</CardTitle>
                <CardDescription className="text-zinc-400">Fields are optional. Include an image for richer testimonials.</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={onSubmitTestimonial} className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="author">Author (optional)</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Jane Doe"
                      disabled={submittingTestimonial}
                      className="bg-black/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="content">Content (optional)</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share the testimonial..."
                      disabled={submittingTestimonial}
                      className="min-h-[6rem] bg-black/50 border-white/10 text-white"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="image">Image (optional)</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                      disabled={submittingTestimonial}
                      className="bg-black/50 border-white/10 text-white"
                    />
                    {imageFile && (
                      <p className="text-xs text-zinc-400">Selected: {imageFile.name}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 md:col-span-2">
                    <Button type="submit" disabled={submittingTestimonial} className="bg-[#C2A661] text-black font-semibold hover:bg-[#E6D090]">
                      {submittingTestimonial ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>

          <section className="mt-8">
            {loading ? (
              <div className="text-zinc-400">Loading testimonials...</div>
            ) : testimonialsWithUrls.length === 0 ? (
              <div className="text-zinc-500 py-8 text-center bg-zinc-950/20 border border-dashed border-white/10 rounded-xl">
                No testimonials yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {testimonialsWithUrls.map((t) => (
                  <Card key={t.id} className="overflow-hidden bg-zinc-950 border-white/10 text-white flex flex-col justify-between">
                    <div>
                      {t.publicUrl ? (
                        <img src={t.publicUrl} alt={t.image_alt || ""} className="h-48 w-full object-cover" />
                      ) : (
                        <div className="h-2 w-full bg-[#C2A661]/10" />
                      )}
                      <CardContent className="pt-4">
                        {t.content ? <p className="text-sm leading-relaxed text-zinc-300">{t.content}</p> : <p className="text-sm italic text-zinc-500">(Image only)</p>}
                        {t.author_name && <p className="mt-3 text-xs text-[#E6D090] font-semibold">— {t.author_name}</p>}
                      </CardContent>
                    </div>
                    <div className="p-5 pt-0 flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onEditTestimonialClick(t)} className="flex-1 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteTestimonial(t.id)} className="bg-rose-950/60 border border-rose-500/25 hover:bg-rose-900 text-rose-300">
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </TabsContent>
      </Tabs>

      {/* --- Edit Testimonial Dialog --- */}
      <Dialog open={editTestimonialOpen} onOpenChange={setEditTestimonialOpen}>
        <DialogContent className="bg-zinc-950 text-white border-white/10 max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Edit testimonial</DialogTitle>
            <DialogDescription className="text-zinc-400">Update content or replace the image.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onEditTestimonialSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-author">Author (optional)</Label>
              <Input
                id="edit-author"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                placeholder="Jane Doe"
                disabled={editSubmittingTestimonial}
                className="bg-black/50 border-white/10 text-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Content (optional)</Label>
              <Textarea
                id="edit-content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Share the testimonial..."
                disabled={editSubmittingTestimonial}
                className="min-h-[6rem] bg-black/50 border-white/10 text-white"
              />
            </div>
            {editCurrentImageUrl && (
              <div className="grid gap-2">
                <Label>Current image</Label>
                <div className="w-full rounded-md border border-white/5 bg-zinc-900 p-2">
                  <img
                    src={editCurrentImageUrl}
                    alt={editAuthor ? `Testimonial by ${editAuthor}` : "Current image"}
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
                disabled={editSubmittingTestimonial}
                className="bg-black/50 border-white/10 text-white"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-zinc-800" onClick={() => setEditTestimonialOpen(false)} disabled={editSubmittingTestimonial}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#C2A661] text-black font-semibold hover:bg-[#E6D090]" disabled={editSubmittingTestimonial}>
                {editSubmittingTestimonial ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Edit Vehicle Dialog --- */}
      <Dialog open={editVehicleOpen} onOpenChange={setEditVehicleOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 text-white border-white/10 ring-1 ring-[#C2A661]/20 p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-bold">Edit Vehicle Listing</DialogTitle>
            <DialogDescription className="text-zinc-400">Modify details and images. Total images limit remains 10.</DialogDescription>
          </DialogHeader>

          <form onSubmit={onEditVehicleSubmit} className="space-y-6 mt-4">
            {/* Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="edit-make">Make *</Label>
                <Input
                  id="edit-make"
                  value={editMake}
                  onChange={(e) => setEditMake(e.target.value)}
                  disabled={editSubmittingVehicle}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-model">Model *</Label>
                <Input
                  id="edit-model"
                  value={editModel}
                  onChange={(e) => setEditModel(e.target.value)}
                  disabled={editSubmittingVehicle}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-year">Year *</Label>
                <Input
                  id="edit-year"
                  type="number"
                  min="1900"
                  max="2030"
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  disabled={editSubmittingVehicle}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (LKR) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  disabled={editSubmittingVehicle}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mileage">Mileage (km) *</Label>
                <Input
                  id="edit-mileage"
                  type="number"
                  value={editMileage}
                  onChange={(e) => setEditMileage(e.target.value)}
                  disabled={editSubmittingVehicle}
                  className="bg-black/50 border-white/10 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-transmission">Transmission *</Label>
                <Select value={editTransmission} onValueChange={setEditTransmission} disabled={editSubmittingVehicle}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Tiptronic">Tiptronic</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fuelType">Fuel Type *</Label>
                <Select value={editFuelType} onValueChange={setEditFuelType} disabled={editSubmittingVehicle}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="PHEV">Plug-in Hybrid (PHEV)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-engineCapacity">Engine Capacity</Label>
                <Input
                  id="edit-engineCapacity"
                  value={editEngineCapacity}
                  onChange={(e) => setEditEngineCapacity(e.target.value)}
                  disabled={editSubmittingVehicle}
                  className="bg-black/50 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bodyType">Body Type</Label>
                <Input
                  id="edit-bodyType"
                  value={editBodyType}
                  onChange={(e) => setEditBodyType(e.target.value)}
                  disabled={editSubmittingVehicle}
                  className="bg-black/50 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-condition">Condition *</Label>
                <Select value={editCondition} onValueChange={setEditCondition} disabled={editSubmittingVehicle}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="Brand New">Brand New</SelectItem>
                    <SelectItem value="Reconditioned">Reconditioned</SelectItem>
                    <SelectItem value="Used">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Listing Status *</Label>
                <Select value={editVehicleStatus} onValueChange={setEditVehicleStatus} disabled={editSubmittingVehicle}>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white">
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3 pt-8">
                <Checkbox
                  id="edit-featured"
                  checked={editFeatured}
                  onCheckedChange={(checked) => setEditFeatured(!!checked)}
                  disabled={editSubmittingVehicle}
                  className="border-white/20 data-[state=checked]:bg-[#C2A661] data-[state=checked]:text-black"
                />
                <Label htmlFor="edit-featured" className="text-sm cursor-pointer">Featured Listing</Label>
              </div>
            </div>

            {/* Description Rich Text Editor */}
            <div className="space-y-2">
              <Label>Description *</Label>
              <RichTextEditor
                value={editDescription}
                onChange={setEditDescription}
                disabled={editSubmittingVehicle}
              />
            </div>

            {/* Current Images Management */}
            {existingImagesPaths.length > 0 && (
              <div className="space-y-2">
                <Label>Current Images</Label>
                <div className="flex flex-wrap gap-3 p-3 bg-zinc-900/50 border border-white/5 rounded-xl">
                  {existingImagesPaths.map((path, idx) => {
                    const publicUrl = supabase.storage.from(VEHICLES_BUCKET).getPublicUrl(path).data.publicUrl;
                    return (
                      <div key={idx} className="relative aspect-[16/10] w-24 rounded overflow-hidden border border-white/10">
                        <img src={publicUrl} alt="" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(path)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add More Images in Edit Mode */}
            <div className="space-y-3">
              <Label htmlFor="edit-new-images">Add More Images (Remaining slot: {10 - existingImagesPaths.length})</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="edit-new-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleEditVehicleImagesChange(e.target.files)}
                  disabled={editSubmittingVehicle || compressingImages || (existingImagesPaths.length + newVehicleImages.length >= 10)}
                  className="bg-black/50 border-white/10 text-white file:text-[#C2A661] file:bg-zinc-900 file:border-0 hover:file:bg-zinc-800"
                />
                {compressingImages && <Loader2 className="animate-spin text-[#C2A661]" />}
              </div>

              {/* New Selected Images in Edit Mode */}
              {newVehicleImages.length > 0 && (
                <div className="flex flex-wrap gap-3 p-3 bg-zinc-900/50 border border-white/5 rounded-xl">
                  {newVehicleImages.map((file, idx) => {
                    const previewUrl = URL.createObjectURL(file);
                    return (
                      <div key={idx} className="relative aspect-[16/10] w-24 rounded overflow-hidden border border-white/10">
                        <img src={previewUrl} alt="" className="object-cover w-full h-full" />
                        <button
                          type="button"
                          onClick={() => removeNewSelectedImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" className="border-white/10 text-white hover:bg-zinc-800" onClick={() => setEditVehicleOpen(false)} disabled={editSubmittingVehicle}>
                Cancel
              </Button>
              <Button type="submit" disabled={editSubmittingVehicle || compressingImages} className="bg-[#C2A661] hover:bg-[#E6D090] text-black font-semibold">
                {editSubmittingVehicle ? "Updating..." : "Update Listing"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AdminDashboard;
