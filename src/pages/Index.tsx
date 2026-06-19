import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";
const TextGenerateEffect = lazy(() => import("@/components/ui/text-generate-effect").then(m => ({ default: m.TextGenerateEffect })));
import { SEO } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, SlidersHorizontal, Fuel, ChevronRight, ShieldCheck, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  useEffect(() => {
    document.title = "Car Arena Ceylon | Trusted Car Dealer in Colombo";
  }, []);

  const heroRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const techContentRef = useRef<HTMLDivElement | null>(null);
  const motorContentRef = useRef<HTMLDivElement | null>(null);
  const batteryHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const batteryGridRef = useRef<HTMLDivElement | null>(null);
  const featuresHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const featuresBtnRef = useRef<HTMLAnchorElement | null>(null);
  const featuresVideoRef = useRef<HTMLDivElement | null>(null);
  const consultationVideoRef = useRef<HTMLVideoElement | null>(null);
  const featuresGridRef = useRef<HTMLDivElement | null>(null);
  const maintenanceHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const maintenanceDescRef = useRef<HTMLParagraphElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [showHeroVideo, setShowHeroVideo] = useState(true);
  const [heroHeadingDone, setHeroHeadingDone] = useState(false);

  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    if (featuredVehicles.length === 0) return;
    setSlideDirection(1);
    setCurrentSlide((prev) => (prev + 1) % featuredVehicles.length);
  };

  const handlePrev = () => {
    if (featuredVehicles.length === 0) return;
    setSlideDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + featuredVehicles.length) % featuredVehicles.length);
  };

  useEffect(() => {
    if (loadingVehicles || featuredVehicles.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setSlideDirection(1);
      setCurrentSlide((prev) => (prev + 1) % featuredVehicles.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [loadingVehicles, featuredVehicles, isHovered]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    })
  };

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Sort: Available first, then Reserved, then Sold / others
        const STATUS_ORDER: Record<string, number> = {
          "Available": 1,
          "Reserved": 2,
          "Sold": 3,
        };

        const sorted = [...(data || [])].sort((a: any, b: any) => {
          const orderA = STATUS_ORDER[a.status] || 4;
          const orderB = STATUS_ORDER[b.status] || 4;
          return orderA - orderB;
        });

        setFeaturedVehicles(sorted.slice(0, 10));
      } catch (err) {
        console.error("Error fetching homepage vehicles:", err);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchFeaturedVehicles();
  }, []);

  const getVehicleImageUrl = (images: string[]) => {
    if (images && images.length > 0) {
      return supabase.storage.from("vehicles").getPublicUrl(images[0]).data.publicUrl;
    }
    return "/placeholder.svg";
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price).replace("LKR", "Rs.");
  };

  // Note: Removed headline parallax; hero section layout remains sticky for visual depth

  // Ensure iOS inline autoplay compatibility for videos (muted + playsinline attributes present)
  useEffect(() => {
    const candidates: Array<HTMLVideoElement | null> = [
      heroVideoRef.current,
      consultationVideoRef.current,
    ];
    for (const v of candidates) {
      if (!v) continue;
      // Ensure both attribute and property are set before any play attempt
      v.muted = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "true");
      v.setAttribute("webkit-playsinline", "true");
    }
  }, []);

  // Scroll-in animations for the Features section pieces
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items: Array<{ el: HTMLElement | null; from: string; delay: number }> = [
      { el: featuresHeadingRef.current, from: "translateX(-56px)", delay: 0 },
      { el: featuresBtnRef.current, from: "translateX(56px)", delay: 150 },
      { el: featuresVideoRef.current, from: "translateY(56px)", delay: 300 },
      { el: featuresGridRef.current, from: "translateY(56px)", delay: 450 },
    ];

    const observers: IntersectionObserver[] = [];
    for (const { el, from, delay } of items) {
      if (!el) continue;
      if (prefersReduced) {
        el.style.opacity = "1";
        el.style.transform = "none";
        continue;
      }
      el.style.opacity = "0";
      el.style.transform = from;
      el.style.transition =
        "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out";
      el.style.transitionDelay = `${delay}ms`;
      el.style.willChange = "transform, opacity";

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "none";
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Consultation video: play when in view, pause when out; keep muted, looped
  useEffect(() => {
    const container = featuresVideoRef.current;
    const video = consultationVideoRef.current;
    if (!container || !video) return;

    // Ensure desired attributes
    video.muted = true;
    video.loop = true;

    const playSafely = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => { });
    };

    const pause = () => video.pause();

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          playSafely();
        } else {
          pause();
        }
      },
      { threshold: [0, 0.25, 0.4, 0.6, 1] }
    );
    io.observe(container);

    const onVisibility = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Maintenance section animations: heading from left, description from bottom
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const heading = maintenanceHeadingRef.current;
    const desc = maintenanceDescRef.current;
    const observers: IntersectionObserver[] = [];

    const setup = (el: HTMLElement | null, from: string, delayMs = 0) => {
      if (!el) return;
      if (prefersReduced) {
        el.style.opacity = "1";
        el.style.transform = "none";
        return;
      }
      el.style.opacity = "0";
      el.style.transform = from;
      el.style.transition =
        "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out";
      el.style.transitionDelay = `${delayMs}ms`;
      el.style.willChange = "transform, opacity";

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "none";
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    };

    setup(heading, "translateX(-56px)", 0);
    setup(desc, "translateY(56px)", 150);

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Slide-in animation for the Technology section text when it enters viewport
  useEffect(() => {
    const el = techContentRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    // Initial state (ensure starting off-screen to the left)
    el.style.opacity = "0";
    el.style.transform = "translateX(-56px)";
    el.style.transition = "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out";

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Slide in and reveal, with an even longer delay for polish
          el.style.transitionDelay = "200ms";
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Slide-in animation for the Motor section text (from the left)
  useEffect(() => {
    const el = motorContentRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    el.style.opacity = "0";
    el.style.transform = "translateX(-56px)";
    el.style.transition = "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out";

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = "200ms";
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Battery section: animations disabled (static content)

  // Hero video: autoplay for ~5s, then pause and show image (iOS-safe attempts)
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setShowHeroVideo(false); return; }

    let attempts = 0;
    const maxAttempts = 6;
    const attemptDelay = 400;
    let timeoutId: number | undefined;

    const tryPlay = () => {
      try {
        video.muted = true;
        video.removeAttribute('controls');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
      } catch { }

      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          attempts += 1;
          if (attempts < maxAttempts) setTimeout(tryPlay, attemptDelay);
          else setShowHeroVideo(false);
        });
      }
    };

    const startPlaybackWindow = () => {
      if (timeoutId == null) {
        timeoutId = window.setTimeout(() => {
          try { video.pause(); } catch { }
          setShowHeroVideo(false);
        }, 5000);
      }
      tryPlay();
    };

    const handleReady = () => {
      // @ts-ignore
      if (window.isPreloaderComplete) {
        startPlaybackWindow();
      } else {
        window.addEventListener('preloaderComplete', startPlaybackWindow, { once: true });
      }
    };

    if (video.readyState >= 2) handleReady();
    else video.addEventListener('canplay', handleReady, { once: true });

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && showHeroVideo) startPlaybackWindow();
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onEnded = () => setShowHeroVideo(false);
    video.addEventListener('ended', onEnded);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', onVisibility);
      video.removeEventListener('ended', onEnded);
    };
  }, [showHeroVideo]);

  return (
    <main className="bg-black">
      <SEO
        title="Car Dealer Colombo Sri Lanka | Cars for Sale & Japanese Imports | Car Arena Ceylon"
        description="Car Arena Ceylon – Colombo car dealer for brand new cars, Japanese car import services and certified used cars for sale in Sri Lanka. OEM upgrades, detailing, transparent pricing, nationwide support."
        canonical="https://cararenaceylon.com/"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="cars for sale Sri Lanka, used cars Sri Lanka, car dealers Colombo, Japanese car import Sri Lanka, brand new cars Sri Lanka, car dealership Sri Lanka, OEM upgrades, detailing"
      />
      <h1 className="sr-only">Car Arena Ceylon - Your Trusted Automobile Partner - Car Dealer Colombo Sri Lanka</h1>
      {/* Assistive / semantic keyword reinforcement without affecting visible layout */}
      <div className="sr-only">
        <h2>Cars for Sale in Sri Lanka – Certified Brand New & Used</h2>
        <p>
          Explore quality cars for sale Sri Lanka including brand new cars Sri Lanka selections, inspected used cars Sri Lanka inventory, and specialized Japanese car import Sri Lanka solutions through a trusted car dealer Colombo team.
        </p>
        <h2>Japanese Car Import & Brand New Vehicles</h2>
        <p>
          Our Japanese car import service manages sourcing, auction inspection, shipping, clearance and delivery. We also handle warranties on select brand new cars Sri Lanka buyers request.
        </p>
      </div>
      <section ref={heroRef} aria-label="Hero" className="relative isolate min-h-[100svh] md:h-screen mb-16 md:mb-24">
        {/* Sticky viewport frame so it naturally stops being sticky when the hero ends */}
        <div className="sticky top-0 min-h-[100svh] md:h-screen">
          {/* Background: static image base + transient video overlay for first ~3s */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            {/* Base hero image (shown after video window or if autoplay blocked) */}
            {!showHeroVideo && (
              <img
                src="/hero fkkor car.webp"
                alt="Premium cars dealership hero image — Car Arena Ceylon"
                className="hero-img absolute inset-0 h-full w-full object-cover select-none animate-fade-in"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            )}
            {/* Hero video overlay (plays ~5s on load, then hides) */}
            {showHeroVideo && (
              <video
                ref={heroVideoRef}
                className="hero-video-fade absolute inset-0 h-full w-full object-cover animate-fade-in"
                src="/hero-video.mp4"
                muted
                playsInline
                autoPlay
                preload="metadata"
                poster="/hero fkkor car.webp"
              />
            )}

            <div
              className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-700 hidden md:block"
              style={{
                boxShadow: "inset 0 0 450px 180px rgba(0,0,0,0.98), inset 0 0 150px 60px rgba(0,0,0,0.9)",
              }}
            />
            {/* Mobile-only top fade overlay for hero video (keeps desktop unchanged) */}
            {showHeroVideo && (
              <div
                className="md:hidden pointer-events-none absolute top-0 inset-x-0 h-28 sm:h-32 z-[1]"
                style={{
                  // Stronger vertical fade to soften the top edge + subtle horizontal easing at sides
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.0) 95%), linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.0) 18%, rgba(0,0,0,0.0) 82%, rgba(0,0,0,0.6) 100%)',
                }}
              />
            )}
          </div>

          {/* Cinematic black fade frame — lighter on mobile, heavy on desktop */}
          {/* Mobile: subtle overall tint + soft edge frame */}
          <div
            className="pointer-events-none absolute inset-0 z-[5] md:hidden"
            style={{
              background: "rgba(0,0,0,0.38)",
              boxShadow: "inset 0 0 140px 60px rgba(0,0,0,0.9), inset 0 0 50px 20px rgba(0,0,0,0.7)",
            }}
          />

          {/* Content overlay with bottom-up reveal (pin to bottom on mobile) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-40 sm:bottom-20 md:bottom-24 lg:bottom-28 z-10 pb-safe">
            <div className="w-full px-8 md:px-10 lg:px-14">
              <div ref={contentRef} className="max-w-xl md:max-w-2xl lg:max-w-3xl">


                {/* Heading with word-by-word animation */}
                <div className="mt-5">
                  <Suspense fallback={<span className="block h-10" aria-hidden></span>}>
                    <TextGenerateEffect
                      lines={[
                        {
                          text: "Your Trusted Automobile Partner",
                          className: "text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight drop-shadow-2xl"
                        }
                      ]}
                      className="mb-6"
                      duration={0.5}
                      delay={3.5}
                      onComplete={() => setHeroHeadingDone(true)}
                    />
                  </Suspense>
                </div>

                {/* Sub-heading: reveal from bottom after heading completes */}
                <p
                  className="mt-8 text-base sm:text-lg text-white/80 drop-shadow transform-gpu transition-all duration-700 text-justify"
                  style={{
                    opacity: heroHeadingDone ? 1 : 0,
                    transform: heroHeadingDone ? "translateY(0)" : "translateY(24px)",
                  }}
                >
                  Car Sales & Product Arena Ceylon,Your Premier Destination for Imported and High-Condition Used Vehicles, Expert Modifications, and Comprehensive Car Care in Sri Lanka.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom fade to black for a smoother transition into next section */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 md:h-28 -z-[5] bg-gradient-to-b from-transparent to-black" />
        </div>
      </section>





      {/* Technology / Collection section: mobile shows image then text; desktop keeps background overlay with right-aligned text */}
      <section aria-label="Technology" className="relative bg-black overflow-hidden pt-12 sm:pt-16 md:pt-64" style={{ contentVisibility: "auto" }}>
        {/* Background image container adjusted to reduce zoom (use object-contain) */}
        <div className="hidden md:flex absolute inset-0 z-0 items-center justify-center overflow-hidden">
          <img
            decoding="async"
            loading="lazy"
            width={2880}
            height={1614}
            sizes="100vw"
            src="/collection%20image.webp"
            alt="Car Arena Ceylon collection background"
            className="section-img-collection max-h-[75vh] pl-36 md:max-h-[85vh] lg:max-h-[90vh] w-auto object-contain transform-gpu"
          />
          {/* Vignette gradients to match the reference */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
          {/* Additional top fade to fully blend top edge */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 4%, rgba(0,0,0,0.75) 10%, rgba(0,0,0,0.45) 18%, rgba(0,0,0,0) 32%)",
            }}
          />
          {/* Stronger right-side fade for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/60 to-black/95" />
          {/* Extra right-edge vignette to reinforce the fade on large screens */}
          <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-black/95 via-black/80 to-transparent" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 80% at 15% 50%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.85) 100%)",
            }}
          />
          {/* Circular fade to softly blend entire image perimeter into black */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                // Stronger edge fade (higher opacities) without extending further into center
                "radial-gradient(circle at 55% 50%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 85%, rgba(0,0,0,0.97) 94%, #000 100%)",
            }}
          />
        </div>

        {/* Content container: stack on mobile, vertical-center on desktop */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 md:min-h-[70vh] md:flex md:items-center">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 lg:gap-x-12 mt-6 md:mt-0 items-center">
            {/* Left side: text */}
            <div
              ref={techContentRef}
              className="md:col-span-5 md:col-start-1 lg:col-span-5 lg:col-start-1 will-change-transform transform-gpu"
              style={{ opacity: 0, transform: "translateX(-56px)" }}
            >
              <div className="flex items-center gap-2 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-wide">Collection</span>
              </div>

              <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                Explore our collection of
                <br className="hidden sm:block" /> premium vehicles
              </h2>

              <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-white/80 text-justify drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                Whether you desire the precision of
                Japanese engineering, the luxury of European design, or the robust performance of Australian
                models, our curated inventory offers something for every discerning driver. Each vehicle is
                rigorously inspected to guarantee quality and reliability.
              </p>

              <div className="mt-7">
                <Link
                  to="/vehicle-listings"
                  className="group inline-flex items-center rounded-full bg-white pl-4 pr-2 py-3 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 ring-1 ring-white/70 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <span>View listings</span>
                  <span className="ml-3 grid size-8 place-items-center rounded-full bg-gray-900/10 transition-transform group-hover:translate-x-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path d="M12.97 4.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4.75a.75.75 0 0 1 0-1.5h12.94l-4.72-4.72a.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>

            {/* Right side: carousel container (layered on top of background image, sized larger as requested) */}
            <div className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7 w-full flex items-center justify-center relative z-20 lg:mt-0">
              <div className="relative w-full">
                {/* Heading */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C2A661]" aria-hidden="true" />
                  <span className="text-xs font-semibold tracking-wider text-[#C2A661] uppercase font-sans">Available Listings</span>
                </div>

                {loadingVehicles ? (
                  <div className="flex justify-center items-center py-20 bg-zinc-950/40 border border-white/10 rounded-3xl w-full h-[460px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C2A661]" />
                  </div>
                ) : featuredVehicles.length === 0 ? (
                  <div className="text-center py-20 bg-zinc-950/40 rounded-3xl border border-white/10 p-8 w-full h-[460px] flex items-center justify-center">
                    <p className="text-zinc-400">No vehicles available at the moment. Please check back later.</p>
                  </div>
                ) : (
                  <div className="relative w-full">
                    {/* Carousel container */}
                    <div
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className="relative overflow-hidden rounded-3xl bg-zinc-950/50 backdrop-blur-md border border-white/10 hover:border-[#C2A661]/40 shadow-[0_20px_50px_-15px_rgba(194,166,97,0.25)] transition-all duration-500 w-full min-h-[460px] flex flex-col"
                    >
                      <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                        {(() => {
                          const car = featuredVehicles[currentSlide];
                          if (!car) return null;
                          const mainImage = getVehicleImageUrl(car.images);
                          return (
                            <motion.div
                              key={currentSlide}
                              custom={slideDirection}
                              variants={slideVariants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              className="w-full flex flex-col flex-1"
                            >
                              <Link to={`/vehicle-listings?id=${car.id}`} className="w-full flex flex-col flex-1 group/card focus:outline-none">
                                {/* Image Part */}
                                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900 group/img">
                                  {/* Blurred background image to fill the container */}
                                  <img
                                    src={mainImage}
                                    alt=""
                                    className="absolute inset-0 object-cover w-full h-full blur-md opacity-30 scale-110"
                                    aria-hidden="true"
                                  />
                                  {/* Main image centered and fully visible */}
                                  <img
                                    src={mainImage}
                                    alt={`${car.year} ${car.make} ${car.model}`}
                                    className="relative z-10 object-contain w-full h-full scale-100 group-hover/img:scale-105 transition-transform duration-700 ease-out mx-auto"
                                  />
                                  {/* Gradient overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none z-10" />
                                  
                                  {/* Badges on image */}
                                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-20">
                                    {car.condition !== "Reconditioned" && (
                                      <Badge variant="outline" className={`uppercase tracking-wider text-[9px] px-2 py-0.5 font-bold border ${getConditionColor(car.condition)}`}>
                                        {car.condition}
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className={`uppercase tracking-wider text-[9px] px-2 py-0.5 font-bold border ${getStatusColor(car.status)}`}>
                                      {car.status}
                                    </Badge>
                                  </div>
                                </div>

                                {/* Details Part */}
                                <div className="p-6 flex-1 flex flex-col justify-center">
                                  <span className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">{car.year} Model</span>
                                  <h3 className="text-xl font-bold text-white mt-1 group-hover/card:text-[#E6D090] transition-colors line-clamp-1">
                                    {car.make} {car.model}
                                  </h3>
                                  <div className="text-xl font-bold text-[#E6D090] mt-1">
                                    {formatPrice(car.price)}
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })()}
                      </AnimatePresence>
                    </div>

                    {/* Side Navigation Arrows */}
                    <button
                      onClick={handlePrev}
                      aria-label="Previous listing"
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#C2A661] text-white hover:text-[#C2A661] transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20 cursor-pointer hover:scale-110 active:scale-[0.9] group focus:outline-none"
                    >
                      <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </button>

                    <button
                      onClick={handleNext}
                      aria-label="Next listing"
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#C2A661] text-white hover:text-[#C2A661] transition-all duration-300 rounded-full w-10 h-10 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20 cursor-pointer hover:scale-110 active:scale-[0.9] group focus:outline-none"
                    >
                      <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center items-center gap-1.5 mt-4 z-20 relative">
                      {featuredVehicles.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSlideDirection(index > currentSlide ? 1 : -1);
                            setCurrentSlide(index);
                          }}
                          aria-label={`Go to slide ${index + 1}`}
                          className={`h-2 rounded-full transition-all duration-500 focus:outline-none ${
                            index === currentSlide
                              ? "w-6 bg-[#C2A661] shadow-[0_0_8px_rgba(194,166,97,0.6)]"
                              : "w-2 bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section – dark theme, placed after Collection */}
      <section aria-label="Features" className="relative bg-black overflow-hidden pt-32 pb-20 md:pt-44 md:pb-28" style={{ contentVisibility: "auto" }}>
        {/* Background image with heavy vignette for legibility */}
        <div className="absolute inset-0 -z-10">
          <img
            decoding="async"
            loading="lazy"
            width={5760}
            height={3344}
            sizes="100vw"
            srcSet="https://framerusercontent.com/images/3NyF4dUE9wLeWq0Q7nY3z9EKKU.jpg?scale-down-to=512 512w, https://framerusercontent.com/images/3NyF4dUE9wLeWq0Q7nY3z9EKKU.jpg?scale-down-to=1024 1024w, https://framerusercontent.com/images/3NyF4dUE9wLeWq0Q7nY3z9EKKU.jpg?scale-down-to=2048 2048w, https://framerusercontent.com/images/3NyF4dUE9wLeWq0Q7nY3z9EKKU.jpg?scale-down-to=4096 4096w, https://framerusercontent.com/images/3NyF4dUE9wLeWq0Q7nY3z9EKKU.jpg 5760w"
            src="https://framerusercontent.com/images/3NyF4dUE9wLeWq0Q7nY3z9EKKU.jpg"
            alt=""
            className="features-bg-img h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        </div>

        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          {/* Header row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-wide">Consultation</span>
              </div>
              <h2
                ref={featuresHeadingRef}
                className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white"
                style={{ opacity: 0, transform: "translateX(-56px)" }}
              >
                Expert Advice for the <br />Perfect Drive
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                ref={featuresBtnRef}
                to="/contact"
                className="inline-flex items-center rounded-full bg-white px-4 py-2.5 text-sm font-medium text-gray-900 ring-1 ring-white hover:bg-white/95"
                style={{ opacity: 0, transform: "translateX(56px)" }}
              >
                Contact Us
                <span className="ml-2 grid size-7 place-items-center rounded-full bg-gray-900/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M12.97 4.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4.75a.75.75 0 0 1 0-1.5h12.94l-4.72-4.72a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          {/* Video/preview surface */}
          <div className="mt-10 md:mt-14">
            <div
              ref={featuresVideoRef}
              className="relative aspect-[16/9] w-full md:max-w-3xl lg:max-w-4xl mx-auto overflow-hidden rounded-[28px] md:rounded-[40px] ring-1 ring-white/10 shadow-2xl shadow-black/40"
              style={{
                opacity: 0,
                transform: "translateY(56px)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, rgba(0,0,0,1) 42%, rgba(0,0,0,0.25) 68%, rgba(0,0,0,0) 100%)",
                maskImage:
                  "radial-gradient(ellipse at center, rgba(0,0,0,1) 42%, rgba(0,0,0,0.25) 68%, rgba(0,0,0,0) 100%)",
                maskSize: "100% 100%",
                maskRepeat: "no-repeat",
              }}
            >
              {/* Autoplaying background video */}
              <video
                src="/consultationvideo.mp4"
                ref={consultationVideoRef}
                muted
                loop
                playsInline
                autoPlay
                preload="metadata"
                poster="/fallback image.webp"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Vignette-only overlay: keep center crisp, darken perimeter subtly */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0) 42%, rgba(0,0,0,0.92) 84%, rgba(0,0,0,0.99) 98%, rgba(0,0,0,1) 100%)",
                }}
              />
            </div>
          </div>

          {/* Feature grid */}
          <div
            ref={featuresGridRef}
            className="mt-4 md:mt-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-white"
            style={{ opacity: 0, transform: "translateY(56px)" }}
          >
            <div className="flex items-start gap-4">
              {/* Steering icon */}
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
                  <path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9Zm0 2a7 7 0 0 1 6.92 6H5.08A7 7 0 0 1 12 5Zm0 14a7 7 0 0 1-6.27-4h4.05a2 2 0 0 1 1.41.59l.94.94a1 1 0 0 0 1.41 0l.94-.94a2 2 0 0 1 1.41-.59h4.05A7 7 0 0 1 12 19Z" fill="currentColor" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold">Personalized Vehicle Consultation</h3>
                <p className="mt-2 text-white/70 text-justify">
                  Our team takes the time to understand your needs and guide you to the best options from Japan, Europe, Australia, and Thailand’s top local stock.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              {/* Lightning icon */}
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" fill="currentColor" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold">Future-Proof Recommendations</h3>
                <p className="mt-2 text-white/70 text-justify">
                  Whether you’re buying your first car, upgrading for more performance, or seeking a long-term investment, we offer insights on reliability, resale value, and suitability for Sri Lankan roads.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              {/* Shield icon */}
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
                  <path d="M12 3 4 6v6c0 5 3.58 9.74 8 11 4.42-1.26 8-6 8-11V6l-8-3Z" fill="currentColor" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-semibold">Beyond the Purchase</h3>
                <p className="mt-2 text-white/70 text-justify">
                  Our consultation continues after the sale from maintenance schedules to upgrade advice ensuring your ownership experience stays seamless and satisfying for years to come.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Battery section – "Fast charging and long battery" (after Features) */}
      <section aria-label="Battery" className="relative bg-black overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32" style={{ contentVisibility: "auto" }}>
        {/* Background image with gradients to match reference */}
        <div className="absolute inset-0 z-0">
          <img
            decoding="async"
            loading="lazy"
            width={5760}
            height={3172}
            sizes="100vw"
            srcSet="https://framerusercontent.com/images/kAj9qICvYpYA71fe9UWYIj0cJkk.jpg?scale-down-to=512 512w, https://framerusercontent.com/images/kAj9qICvYpYA71fe9UWYIj0cJkk.jpg?scale-down-to=1024 1024w, https://framerusercontent.com/images/kAj9qICvYpYA71fe9UWYIj0cJkk.jpg?scale-down-to=2048 2048w, https://framerusercontent.com/images/kAj9qICvYpYA71fe9UWYIj0cJkk.jpg?scale-down-to=4096 4096w, https://framerusercontent.com/images/kAj9qICvYpYA71fe9UWYIj0cJkk.jpg 5760w"
            src="https://framerusercontent.com/images/kAj9qICvYpYA71fe9UWYIj0cJkk.jpg"
            alt=""
            className="battery-img h-full w-full object-cover transform-gpu"
            aria-hidden
          />
          {/* Subtle dark vignette to ensure readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/85" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/55" />
          {/* Radial vignette to keep center crisp and edges darker (like reference) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.94) 58%, rgba(0,0,0,0.99) 92%, rgba(0,0,0,1) 100%)",
            }}
          />
        </div>

        {/* Header: dot subtitle, title, paragraph, button (centered) */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 text-center text-white">

          <h2
            ref={batteryHeadingRef}
            className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight"
          >
            Why Choose Car Arena Ceylon?
          </h2>
          <p className="mt-10 mb-10 text-base sm:text-lg text-white/70 text-justify">
            Car Arena Ceylon is more than a dealership, we’re your trusted road partner. From Colombo, we handpick vehicles for quality, style, and performance, and make ownership effortless, rewarding, and uniquely yours.
          </p>

          <div className="mt-6">
            <Link
              to="/about"
              className="group inline-flex items-center rounded-full bg-white pl-4 pr-2 py-3 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 ring-1 ring-white/70 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <span>About Us</span>
              <span className="ml-3 grid size-8 place-items-center rounded-full bg-gray-900/10 transition-transform group-hover:translate-x-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                  <path d="M12.97 4.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4.75a.75.75 0 0 1 0-1.5h12.94l-4.72-4.72a.75.75 0 0 1 0-1.06Z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Why Us highlights grid */}
        <div className="relative z-10 mx-auto mt-16 sm:mt-24 md:mt-72 lg:mt-80 max-w-7xl px-6 sm:px-8 text-white">
          <div
            ref={batteryGridRef}
            className="grid grid-cols-1 gap-x-10 gap-y-28 text-center md:grid-cols-2 lg:grid-cols-6"
          >
            {/* 1. Global Sourcing, Local Expertise */}
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold">Global Sourcing, Local Expertise</h3>
              <p className="mt-3 text-white/70 text-center">
                Access to a wide range of imported vehicles alongside quality local options.
              </p>
            </div>

            {/* 2. Unwavering Quality Assurance */}
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold">Unwavering Quality Assurance</h3>
              <p className="mt-3 text-white/70 text-center">
                Every vehicle undergoes stringent inspections for your peace of mind.
              </p>
            </div>

            {/* 3. Comprehensive Automotive Solutions */}
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold">Comprehensive Automotive Solutions</h3>
              <p className="mt-3 text-white/70 text-center">
                From sales and modifications to maintenance, we cover all your needs.
              </p>
            </div>

            {/* 4. Customer-Centric Approach */}
            <div className="lg:col-span-2 lg:col-start-2">
              <h3 className="text-xl sm:text-2xl font-bold">Customer-Centric Approach</h3>
              <p className="mt-3 text-white/70 text-center">
                Personalized service and dedicated support throughout your ownership journey.
              </p>
            </div>

            {/* 5. Trusted Reputation */}
            <div className="lg:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold">Trusted Reputation</h3>
              <p className="mt-3 text-white/70 text-center">
                Built on integrity, transparency, and countless satisfied customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Motor section – moved to the end of the homepage */}
      <section aria-label="Motor" className="relative bg-black overflow-hidden pt-28 pb-24 md:pt-36 md:pb-32" style={{ contentVisibility: "auto" }}>
        {/* Right-side image */}
        <div className="absolute inset-0 bg-black" aria-hidden="true" />
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 lg:w-[55%] z-0">
          <img
            decoding="async"
            loading="lazy"
            width={1536}
            height={960}
            sizes="(max-width: 768px) 100vw, 55vw"
            srcSet="/Engines-power-Land-Defender-V8-1536x960.jpg 1536w"
            src="/Engines-power-Land-Defender-V8-1536x960.webp"
            alt="Defender V8 engine power - custom modifications"
            className="h-full w-full object-cover object-center"
            style={{
              WebkitMaskImage:
                'radial-gradient(circle at 55% 50%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 58%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.25) 76%, rgba(0,0,0,0) 82%)',
              maskImage:
                'radial-gradient(circle at 55% 50%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 58%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.25) 76%, rgba(0,0,0,0) 82%)'
            }}
          />
          {/* Gradient fade toward content */}
          <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-black/0" />
          {/* Radial fade applied directly to image via mask above */}
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 min-h-[60vh] md:min-h-[70vh] flex items-start md:items-center pt-16 md:pt-0">
          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-y-12">
            <div
              ref={motorContentRef}
              className="mt-32 md:mt-0 md:col-span-5 md:col-start-1 lg:col-start-2 will-change-transform transform-gpu"
              style={{ opacity: 0, transform: "translateX(-56px)" }}
            >
              <div className="flex items-center gap-2 text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-wide">Modifications</span>
              </div>

              <h2 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
                Tailored to Your Taste: Custom Modifications

              </h2>

              <p className="mt-10 mb-8 max-w-xl text-base sm:text-lg leading-relaxed text-white/70 text-justify">
                Unleash your vehicle's full potential with our expert custom modification services. From
                performance enhancements to aesthetic upgrades, our skilled technicians transform your
                vision into reality. Personalize your ride and make a statement on the road.
              </p>

              <div className="mt-7">
                <Link
                  to="/services"
                  className="group inline-flex items-center rounded-full bg-white pl-4 pr-2 py-3 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 ring-1 ring-white/70 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  <span>Custom Modifications</span>
                  <span className="ml-3 grid size-8 place-items-center rounded-full bg-gray-900/10 transition-transform group-hover:translate-x-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      <path d="M12.97 4.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4.75a.75.75 0 0 1 0-1.5h12.94l-4.72-4.72a.75.75 0 0 1 0-1.06Z" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand messages ticker – placed after Motor section */}
      <section aria-label="Brand Messages" className="bg-black py-28 md:py-40" style={{ contentVisibility: "auto" }}>
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          {/* Heading removed as requested */}
          <div className="ticker ticker-mask">
            {/* We duplicate the list so it can loop seamlessly. The track scrolls by 50% width. */}
            <div className="ticker-track">
              {/* row 1 */}
              {[
                { quote: "Where your dream car meets reality.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Crafted for drivers who demand more.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Turning journeys into experiences.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Luxury, performance, and trust in every mile.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "From Colombo to the open road drive with pride.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Not just a car your statement.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Because every drive should feel special.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Passion in every detail, commitment in every handover.", name: "Car Arena Ceylon", loc: "Brand Message" },
              ].map((r, i) => (
                <article key={`rev-a-${i}`} className="flex-none w-[360px] md:w-[400px] lg:w-[520px] py-8 md:py-6 text-white">
                  <h3 className="quote-2lines mx-auto max-w-[90%] text-center text-3xl md:text-2xl lg:text-3xl font-semibold text-white/90">“{r.quote}”</h3>
                </article>
              ))}
              {/* row 2 duplicate */}
              {[
                { quote: "Where your dream car meets reality.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Crafted for drivers who demand more.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Turning journeys into experiences.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Luxury, performance, and trust in every mile.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "From Colombo to the open road — drive with pride.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Not just a car — your statement.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Because every drive should feel special.", name: "Car Arena Ceylon", loc: "Brand Message" },
                { quote: "Passion in every detail, commitment in every handover.", name: "Car Arena Ceylon", loc: "Brand Message" },
              ].map((r, i) => (
                <article aria-hidden key={`rev-b-${i}`} className="flex-none w-[360px] md:w-[400px] lg:w-[520px] py-8 md:py-6 text-white">
                  <h3 className="quote-2lines mx-auto max-w-[90%] text-center text-3xl md:text-2xl lg:text-3xl font-semibold text-white/90">“{r.quote}”</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interior section – final section on the page */}
      <section aria-label="Interior" className="relative bg-black overflow-hidden pt-28 md:pt-36" style={{ contentVisibility: "auto" }}>
        {/* Background image with layered gradients for legibility, matching the reference */}
        <div className="absolute inset-0 z-0">
          <img
            decoding="async"
            loading="lazy"
            width={5760}
            height={3176}
            sizes="100vw"
            src="/imgmain.webp"
            alt="Maintenance and consultation - Car Arena Ceylon"
            className="interior-img h-full w-full object-cover"
          />
          {/* Top/Bottom darkening to echo the screenshot */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-black/95" />
          {/* Slight radial vignette to keep center visible while edges fade */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 80% at 50% 30%, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.85) 100%)",
            }}
          />
        </div>

        {/* Centered header content (pushed lower for better vertical centering over bg image) */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 text-center text-white pt-20 sm:pt-24 md:pt-32 lg:pt-40">
          {/* Glass panel to ensure text legibility over the image */}
          <div className="mx-auto max-w-2xl rounded-3xl bg-white/5 backdrop-blur-md ring-1 ring-white/15 p-5 sm:p-6 md:p-8 lg:p-10 shadow-lg shadow-black/30">


            <h2
              ref={maintenanceHeadingRef}
              className="mt-3 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight"
              style={{ opacity: 0, transform: "translateX(-56px)" }}
            >
              Uncompromised Care  Maintenance & Consultation
            </h2>

            <p
              ref={maintenanceDescRef}
              className="mt-10 text-base sm:text-lg text-white/70 text-justify"
              style={{ opacity: 0, transform: "translateY(56px)" }}
            >
              Keep your vehicle in peak condition with Car Arena Ceylon's comprehensive maintenance
              services.Our qualified maintenance and detailing partners with state of the art service facilities provide everything from
              routine servicing to complex repairs. Trust us for expert advice and reliable care that
              extends the life and performance of your car.
            </p>

            {/* CTA + price note */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <Link
                to="/testimonials"
                className="group inline-flex items-center rounded-full bg-white pl-4 pr-2 py-3 text-sm font-medium text-gray-900 shadow-lg shadow-black/20 ring-1 ring-white/70 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <span>Testimonials</span>
                <span className="ml-3 grid size-8 place-items-center rounded-full bg-gray-900/10 transition-transform group-hover:translate-x-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
                    <path d="M12.97 4.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4.75a.75.75 0 0 1 0-1.5h12.94l-4.72-4.72a.75.75 0 0 1 0-1.06Z" />
                  </svg>
                </span>
              </Link>

            </div>
          </div>
        </div>

        {/* Spacer to reveal more of the background and end the page with the image */}
        <div className="h-[55vh] sm:h-[60vh]" />
      </section>
    </main>
  );
};

export default Index;
