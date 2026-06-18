import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Gauge, SlidersHorizontal, Fuel, ShieldAlert, Phone, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

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

const BUCKET = "vehicles";

const STATUS_ORDER: Record<string, number> = {
  "Available": 1,
  "Reserved": 2,
  "Sold": 3,
};

export default function VehicleListings() {
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<string>("All");

  // Details Modal State
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (vehicles.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const vehicleId = params.get("id");
      if (vehicleId) {
        const found = vehicles.find((v) => v.id === vehicleId);
        if (found) {
          setSelectedVehicle(found);
          setActiveImageIndex(0);
        }
      }
    }
  }, [vehicles]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVehicles((data as unknown as VehicleRow[]) || []);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPublicUrl = (path: string) => {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  };

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    const filtered = vehicles.filter((car) => {
      const matchesSearch =
        car.make.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase());

      const matchesCondition =
        selectedCondition === "All" ||
        car.condition === selectedCondition;

      return matchesSearch && matchesCondition;
    });

    // Sort: Available first, then Reserved, then Sold / others
    return [...filtered].sort((a, b) => {
      const orderA = STATUS_ORDER[a.status] || 4;
      const orderB = STATUS_ORDER[b.status] || 4;
      return orderA - orderB;
    });
  }, [vehicles, search, selectedCondition]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace("LKR", "Rs.");
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case "Brand New":
        return "bg-[#C2A661] text-black border-[#C2A661] font-bold shadow-md";
      case "Reconditioned":
        return "bg-amber-500 text-black border-amber-500 font-bold shadow-md";
      default:
        return "bg-zinc-800 text-white border-zinc-700 font-bold shadow-md";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-500 text-black border-emerald-500 font-bold shadow-md";
      case "Reserved":
        return "bg-orange-500 text-black border-orange-500 font-bold shadow-md";
      default:
        return "bg-rose-500 text-white border-rose-500 font-bold shadow-md";
    }
  };

  return (
    <main className="bg-black text-white min-h-screen py-20 md:py-24">
      <SEO
        title="Vehicle Listings | Premium Cars for Sale | Car Arena Ceylon"
        description="Explore our curated inventory of brand new and inspected used vehicles. High-definition images, detailed specs, and premium service."
        canonical="https://cararenaceylon.com/vehicle-listings"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="cars for sale Sri Lanka, premium cars Colombo, Toyota Sri Lanka, Honda Sri Lanka, hybrid cars Colombo"
      />

      <header className="mx-auto max-w-6xl px-6 md:px-8">
        <Breadcrumbs />
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-gradient bg-gradient-to-r from-[#E6D090] via-[#C2A661] to-[#E6D090] bg-clip-text text-transparent">
          Vehicle Listings
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70 text-justify">
          Browse our select inventory of exceptional vehicles. Each listing is verified, fully inspected, and ready to meet the highest standards of performance and comfort.
        </p>
      </header>

      {/* Search and Filters Section */}
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl ring-1 ring-white/10 shadow-lg">
          {/* Condition Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["All", "Brand New", "Used"].map((cond) => (
              <Button
                key={cond}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCondition(cond)}
                className={`rounded-lg text-xs uppercase tracking-wider font-semibold transition-all px-4 py-2 border ${selectedCondition === cond
                    ? "bg-[#C2A661] text-black border-[#C2A661]"
                    : "bg-black/30 border-white/10 text-white/70 hover:bg-zinc-800 hover:text-white"
                  }`}
              >
                {cond}
              </Button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search make or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-black/40 border-white/10 text-white placeholder-zinc-500 focus-visible:ring-[#C2A661]/40 focus-visible:border-[#C2A661]"
            />
          </div>
        </div>
      </section>

      {/* Grid List */}
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C2A661]" />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/40 rounded-2xl ring-1 ring-white/5 p-8">
            <ShieldAlert className="mx-auto h-12 w-12 text-[#C2A661]/60 mb-4" />
            <h3 className="text-xl font-semibold text-white/95">No vehicles found</h3>
            <p className="mt-2 text-zinc-400">Try adjusting your search query or condition filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((car) => {
              const mainImage = car.images && car.images.length > 0 ? getPublicUrl(car.images[0]) : "/placeholder.svg";
              return (
                <Card key={car.id} className="overflow-hidden bg-zinc-950/40 backdrop-blur-md border border-white/10 hover:border-[#C2A661]/50 transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-15px_rgba(194,166,97,0.25)] flex flex-col h-full rounded-2xl">
                  {/* Image container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                    <img
                      src={mainImage}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  {/* Info details */}
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Badges & Year Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex gap-1.5">
                          {car.condition !== "Reconditioned" && (
                            <Badge variant="outline" className={`uppercase tracking-wider text-[9px] px-2 py-0.5 font-bold border ${getConditionColor(car.condition)}`}>
                              {car.condition}
                            </Badge>
                          )}
                          <Badge variant="outline" className={`uppercase tracking-wider text-[9px] px-2 py-0.5 font-bold border ${getStatusColor(car.status)}`}>
                            {car.status}
                          </Badge>
                        </div>
                        <span className="text-zinc-400 text-xs font-semibold">{car.year}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-[#E6D090] transition-colors line-clamp-1">
                        {car.make} {car.model}
                      </h3>

                      <div className="text-xl font-bold text-[#E6D090] mt-1.5">
                        {formatPrice(car.price)}
                      </div>

                      {/* Mini specs list */}
                      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-white/5 text-xs text-zinc-400">
                        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                          <Gauge className="h-3.5 w-3.5 text-[#C2A661] shrink-0" />
                          <span className="truncate font-medium">{car.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                          <SlidersHorizontal className="h-3.5 w-3.5 text-[#C2A661] shrink-0" />
                          <span className="truncate font-medium">{car.transmission}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                          <Fuel className="h-3.5 w-3.5 text-[#C2A661] shrink-0" />
                          <span className="truncate font-medium">{car.fuel_type} {car.engine_capacity ? `(${car.engine_capacity})` : ""}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-xl p-2.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#C2A661] shrink-0" />
                          <span className="truncate font-medium">{car.condition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        onClick={() => {
                          setSelectedVehicle(car);
                          setActiveImageIndex(0);
                        }}
                        className="w-full bg-[#C2A661] text-black font-bold hover:bg-white hover:text-black transition-all duration-300 rounded-xl h-11 flex items-center justify-center gap-1 group/btn shadow-[0_4px_12px_rgba(194,166,97,0.2)]"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Details Dialog */}
      <Dialog
        open={selectedVehicle !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedVehicle(null);
        }}
      >
        {selectedVehicle && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 text-white border-white/10 ring-1 ring-[#C2A661]/15 shadow-2xl p-6 md:p-8">
            <DialogHeader className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#C2A661] uppercase tracking-wider">
                <span>{selectedVehicle.year}</span>
                <span className="h-2 w-px bg-white/20" />
                {selectedVehicle.condition !== "Reconditioned" && (
                  <>
                    <span>{selectedVehicle.condition}</span>
                    <span className="h-2 w-px bg-white/20" />
                  </>
                )}
                <Badge variant="outline" className={`text-[10px] py-0.5 border ${getStatusColor(selectedVehicle.status)}`}>
                  {selectedVehicle.status}
                </Badge>
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-bold font-serif text-white tracking-tight">
                {selectedVehicle.make} {selectedVehicle.model}
              </DialogTitle>
              <DialogDescription className="text-xl font-bold text-[#E6D090] pt-1">
                {formatPrice(selectedVehicle.price)}
              </DialogDescription>
            </DialogHeader>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">

              {/* Left Column: Image Slider */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                  {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                    <>
                      <img
                        src={getPublicUrl(selectedVehicle.images[activeImageIndex])}
                        alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                        className="object-contain w-full h-full max-h-[450px]"
                      />
                      {selectedVehicle.images.length > 1 && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveImageIndex((prev) => (prev === 0 ? selectedVehicle.images.length - 1 : prev - 1))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/80 rounded-full h-9 w-9 p-0"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setActiveImageIndex((prev) => (prev === selectedVehicle.images.length - 1 ? 0 : prev + 1))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/80 rounded-full h-9 w-9 p-0"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-zinc-500">No images available</div>
                  )}
                </div>

                {/* Thumbnails list */}
                {selectedVehicle.images && selectedVehicle.images.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedVehicle.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative aspect-[16/10] w-16 overflow-hidden rounded border transition-all ${idx === activeImageIndex
                            ? "border-[#C2A661] ring-1 ring-[#C2A661]/40"
                            : "border-white/10 opacity-60 hover:opacity-100"
                          }`}
                      >
                        <img src={getPublicUrl(img)} alt="" className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Vehicle specs & action */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3 border-b border-white/5 pb-2">
                    Key Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-sm">
                    <div>
                      <div className="text-zinc-500 text-xs">Mileage</div>
                      <div className="font-semibold text-white/90">{selectedVehicle.mileage.toLocaleString()} km</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Transmission</div>
                      <div className="font-semibold text-white/90">{selectedVehicle.transmission}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Fuel Type</div>
                      <div className="font-semibold text-white/90">{selectedVehicle.fuel_type}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Engine Capacity</div>
                      <div className="font-semibold text-white/90">{selectedVehicle.engine_capacity || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-zinc-500 text-xs">Body Type</div>
                      <div className="font-semibold text-white/90">{selectedVehicle.body_type || "N/A"}</div>
                    </div>
                    {selectedVehicle.condition !== "Reconditioned" && (
                      <div>
                        <div className="text-zinc-500 text-xs">Condition</div>
                        <div className="font-semibold text-[#E6D090]">{selectedVehicle.condition}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="pt-2 space-y-3">
                  <a
                    href={`https://wa.me/94777893221?text=Hi%20Car%20Arena%2C%20I%27m%20interested%20in%20the%20${selectedVehicle.year}%20${selectedVehicle.make}%20${selectedVehicle.model}%20listed%20for%20${formatPrice(selectedVehicle.price)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#C2A661] text-black font-bold px-4 py-3 ring-1 ring-[#E6D090]/50 hover:bg-[#E6D090] transition-colors w-full text-center"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                    Inquire on WhatsApp
                  </a>
                  <a
                    href="tel:+94777893221"
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.04] text-white font-semibold px-4 py-3 ring-1 ring-white/10 hover:bg-white/10 transition-colors w-full text-center"
                  >
                    <Phone className="h-4 w-4" />
                    Call Us (+94 77 789 3221)
                  </a>
                </div>
              </div>
            </div>

            {/* Description (Rich Text HTML) */}
            <div className="mt-8 border-t border-white/5 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-4">
                Vehicle Description
              </h3>
              <div
                className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed text-justify"
                dangerouslySetInnerHTML={{ __html: selectedVehicle.description }}
              />
            </div>
          </DialogContent>
        )}
      </Dialog>
    </main>
  );
}
