import ScrollStack from "@/components/ScrollStack";
import { useEffect, useRef } from "react";
import Reveal from "@/components/Reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timeline } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BadgeCheck, Eye, WalletMinimal, FileCheck2, ShieldCheck, Handshake, Wrench, ClipboardList, Car } from "lucide-react";
import { SEO } from "@/lib/seo";

const Services = () => {
  // Lazy load & optimize background video (defer network until section is near viewport)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const loadVideo = () => {
      if (videoEl.getAttribute("data-loaded") === "true") return;
      const sources = Array.from(videoEl.querySelectorAll<HTMLSourceElement>("source[data-src]"));
      sources.forEach(s => {
        const ds = s.getAttribute("data-src");
        if (ds) s.src = ds;
      });
      const direct = videoEl.getAttribute("data-src");
      if (direct) videoEl.src = direct; // fallback if using direct src approach
      videoEl.load();
      videoEl.setAttribute("data-loaded", "true");
    };

    const onCanPlay = () => {
      videoEl.playbackRate = 0.85; // slightly slower
      videoEl.classList.remove("opacity-0");
      videoEl.classList.add("opacity-100");
    };
    videoEl.addEventListener("canplay", onCanPlay, { once: true });

    // IntersectionObserver to trigger load early (~200px before in view)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          loadVideo();
          observer.disconnect();
        }
      });
    }, { root: null, rootMargin: "200px 0px", threshold: 0 });
    observer.observe(videoEl);

    return () => {
      videoEl.removeEventListener("canplay", onCanPlay);
      observer.disconnect();
    };
  }, []);
  return (
    <main className="relative w-full text-white overflow-hidden bg-black">
      <div className="relative z-10">
        <SEO
          title="Services | Japanese Car Import, Brand New & Used Cars Sri Lanka | Car Arena"
          description="End-to-end Japanese car import Sri Lanka service, sourcing brand new cars, certified used cars, OEM upgrades, detailing & nationwide after-sales at Car Arena Ceylon."
          canonical="https://cararenaceylon.com/services"
          image="https://cararenaceylon.com/hero%20image.png"
          keywords="Japanese car import Sri Lanka, brand new cars Sri Lanka, used cars Sri Lanka, cars for sale Sri Lanka, car dealers Colombo, OEM upgrades, detailing, ceramic coating, PPF"
        />
        <div className="sr-only">
          <h2>Japanese Car Import & Brand New Car Services in Sri Lanka</h2>
          <p>Our services cover cars for sale Sri Lanka sourcing, brand new cars Sri Lanka allocations, used cars Sri Lanka inspection, and car dealer Colombo level Japanese import logistics.</p>
        </div>
        <div className="relative">
          {/* Background services video behind scrollable panels (not behind header) */}
          <div className="absolute inset-x-0 bottom-0 top-24 md:top-24 -z-10 overflow-hidden">
            <video
              id="services-bg-video"
              ref={videoRef}
              className="h-full w-full object-cover [object-position:center] opacity-0 transition-opacity duration-700 ease-out will-change-opacity"
              // data-src kept for fallback if <source> isn't used by some browsers
              data-src="/services%20video%20.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="none" /* prevent eager network use */
              aria-label="Services background video"
              disablePictureInPicture
              tabIndex={-1}
            >
              <source data-src="/services%20video%20.mp4" type="video/mp4" />
              {/* If you transcode a lighter WebM version, add below for better compression */}
              {/* <source data-src="/services-video-optimized.webm" type="video/webm" /> */}
            </video>
            {/* Overlays for readability & slight vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/75" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,transparent_0%,transparent_55%,#000_100%)] opacity-20 md:opacity-35" />
          </div>
          <ScrollStack
            className="bg-transparent"
        stickyHeader={
              <div className="sticky top-4 md:top-6 z-20 w-full border-b border-white/10 bg-black/60 supports-[backdrop-filter]:backdrop-blur-md">
                <div className="mx-auto max-w-6xl px-6 md:px-8 py-4 md:py-5">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Services</h1>
            </div>
          </div>
        }
      >
        {/* A. Importing brand new and high quality used vehicles */}
  <ScrollStack.Panel>
              <div className="mx-auto max-w-6xl px-6 md:px-8 grid place-items-center">
                <div className="w-full">
              <div className="mx-auto w-full max-w-5xl">
                    <Card className="rounded-2xl border-white/10 bg-white/[0.04] supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)]">
      <CardHeader className="pb-1 p-4 md:p-6">
        <Reveal as={CardTitle as any} className="text-xl md:text-4xl font-bold tracking-tight">
                      Importing brand new and high quality used vehicles
                    </Reveal>
                  </CardHeader>
      <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
        <Reveal as="p" delay={120} className="mt-2 max-w-2xl text-sm md:text-lg leading-relaxed text-white/80 text-justify">
                      Get the exact spec you want through a transparent pre order service. We source from trusted dealers and auctions in Japan, Thailand, Australia and Europe. You receive inspection details, shipping updates and full support from order to handover.
                    </Reveal>
                        <Reveal as="div" delay={240} className="mt-4 md:mt-5 grid gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E6D090]">What you get</h3>
                          <ul className="list-disc pl-5 space-y-2 marker:text-[#E6D090]">
                        <li>Multi country sourcing and verified inspections</li>
                        <li>Clear pricing with step by step status updates</li>
                        <li>Registration and delivery assistance with finance guidance on request</li>
                      </ul>
                    </Reveal>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
  </ScrollStack.Panel>

        

        {/* B. OEM modifications and customisations */}
  <ScrollStack.Panel>
          <div className="mx-auto max-w-6xl px-6 md:px-8 grid place-items-center">
            <div className="w-full">
              <div className="mx-auto w-full max-w-5xl">
    <Card className="rounded-2xl border-white/10 bg-white/[0.04] supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)]">
                  <CardHeader className="pb-1 p-4 md:p-6">
                    <Reveal as={CardTitle as any} className="text-xl md:text-4xl font-bold tracking-tight">
                      OEM modifications and customisations
                    </Reveal>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
  <Reveal as="p" delay={120} className="mt-2 max-w-2xl text-sm md:text-lg leading-relaxed text-white/80 text-justify">
                      Keep it factory correct and make it yours. We install genuine parts and approved packages so upgrades look right, perform reliably and protect long term value.
                    </Reveal>
                    <Reveal as="div" delay={240} className="mt-4 md:mt-5 grid gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E6D090]">Popular requests</h3>
                      <ul className="list-disc pl-5 space-y-2 marker:text-[#E6D090]">
                        <li>Manufacturer body kits lighting wheels and interior trim</li>
                        <li>Infotainment and driver assist feature upgrades</li>
                        <li>Warranty friendly professional installation</li>
                      </ul>
                    </Reveal>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
  </ScrollStack.Panel>

        {/* C. Local value additions and aftermarket upgrades */}
  <ScrollStack.Panel>
          <div className="mx-auto max-w-6xl px-6 md:px-8 grid place-items-center">
            <div className="w-full">
              <div className="mx-auto w-full max-w-5xl">
    <Card className="rounded-2xl border-white/10 bg-white/[0.04] supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)]">
                  <CardHeader className="pb-1 p-4 md:p-6">
                    <Reveal as={CardTitle as any} className="text-xl md:text-4xl font-bold tracking-tight">
                      Local value additions and aftermarket upgrades
                    </Reveal>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
  <Reveal as="p" delay={120} className="mt-2 max-w-2xl text-sm md:text-lg leading-relaxed text-white/80 text-justify">
                      Refine comfort protection and style once the vehicle arrives. We use quality parts and neat installs for a premium finish.
                    </Reveal>
                    <Reveal as="div" delay={240} className="mt-4 md:mt-5 grid gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E6D090]">Examples</h3>
                      <ul className="list-disc pl-5 space-y-2 marker:text-[#E6D090]">
                        <li>Detailing ceramic coating paint protection film and premium tints</li>
                        <li>Upholstery refresh floor and boot liners dash cam and parking sensors</li>
                        <li>CarPlay and Android Auto retrofits and audio enhancements</li>
                      </ul>
                    </Reveal>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
  </ScrollStack.Panel>

        {/* D. Facilitation for selling your existing vehicle */}
  <ScrollStack.Panel>
          <div className="mx-auto max-w-6xl px-6 md:px-8 grid place-items-center">
            <div className="w-full">
              <div className="mx-auto w-full max-w-5xl">
    <Card className="rounded-2xl border-white/10 bg-white/[0.04] supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)]">
                  <CardHeader className="pb-1 p-4 md:p-6">
                    <Reveal as={CardTitle as any} className="text-xl md:text-4xl font-bold tracking-tight">
                      Facilitation for selling your existing vehicle
                    </Reveal>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
  <Reveal as="p" delay={120} className="mt-2 max-w-2xl text-sm md:text-lg leading-relaxed text-white/80 text-justify">
                      Sell faster and with confidence. We help you prepare price and present your car to serious buyers and guide you through paperwork.
                    </Reveal>
                    <Reveal as="div" delay={240} className="mt-4 md:mt-5 grid gap-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E6D090]">How we help</h3>
                      <ul className="list-disc pl-5 space-y-2 marker:text-[#E6D090]">
                        <li>Market based pricing and listing strategy</li>
                        <li>Buyer screening viewings and negotiation support</li>
                        <li>Correct transfer documentation and finance guidance</li>
                      </ul>
                    </Reveal>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollStack.Panel>
      </ScrollStack>
        </div>
          {/* Value Added Services - standalone section after ScrollStack */}
          <section className="relative border-t border-white/10 bg-black">
            {/* ambient luxury glow */}
            <div className="pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#E6D090]/10 blur-3xl" />
              <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-6xl px-6 md:px-8 py-12 md:py-16">
              <div className="mx-auto w-full max-w-5xl">
                <Card className="rounded-2xl border-white/10 bg-white/[0.04] supports-[backdrop-filter]:backdrop-blur-md ring-1 ring-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)]">
                  <CardHeader className="pb-1 p-4 md:p-6">
                    <Reveal as={CardTitle as any} className="text-xl md:text-4xl font-bold tracking-tight">
                      Value Added Services
                    </Reveal>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    <Reveal as="p" delay={120} className="mt-2 max-w-3xl text-sm md:text-lg text-white/80 text-justify">
                      We pair every vehicle with concierge-level care and clear, document-backed processes. Enjoy premium peace of mind from order to registration and beyond.
                    </Reveal>
                    <Reveal as="div" delay={240} className="mt-7 grid gap-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#E6D090]">Included with every purchase</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* item cards */}
                        {[{
                          icon: BadgeCheck,
                          title: "Best market pricing",
                          desc: "Guaranteed best prices for personal orders",
                        }, {
                          icon: Eye,
                          title: "Total transparency",
                          desc: "Highest level of transparency at every step",
                        }, {
                          icon: WalletMinimal,
                          title: "Flat 3% fee",
                          desc: "No hidden charges — ever",
                        }, {
                          icon: FileCheck2,
                          title: "Legal assurance",
                          desc: "Document-based, compliant transactions",
                        }, {
                          icon: ShieldCheck,
                          title: "Comprehensive warranty",
                          desc: "100,000 Kms / 3-year coverage",
                        }, {
                          icon: Handshake,
                          title: "Finance assistance",
                          desc: "Guidance and support for requirements",
                        }, {
                          icon: Wrench,
                          title: "After-sales support",
                          desc: "Partner service facilities nationwide",
                        }, {
                          icon: ClipboardList,
                          title: "Pre-delivery inspection",
                          desc: "Detailed PDI before handover",
                        }, {
                          icon: Car,
                          title: "RMV registration",
                          desc: "Smooth government registration",
                        }].map(({ icon: Icon, title, desc }, idx) => (
                          <div key={idx} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 md:p-4 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_24px_rgba(0,0,0,0.35)]">
                            <div className="absolute inset-0 pointer-events-none opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_55%)]">
                              <div className="absolute -top-8 -left-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                            </div>
                            <div className="relative z-[1] flex items-start gap-3">
                              <div className="grid h-8 w-8 md:h-10 md:w-10 place-items-center rounded-lg bg-[#E6D090]/10 text-[#E6D090] ring-1 ring-[#E6D090]/20">
                                <Icon className="h-4 w-4 md:h-5 md:w-5" strokeWidth={2} />
                              </div>
                              <div>
                                <div className="text-white font-medium">{title}</div>
                                <div className="text-white/70 text-sm">{desc}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Reveal>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* How it works - premium timeline */}
          <section className="relative bg-black">
            <div className="mx-auto max-w-6xl px-6 md:px-8 py-8 md:py-14">
              <Reveal as="h2" className="text-2xl md:text-3xl font-bold tracking-tight text-white">How it works</Reveal>
              <div className="mt-6">
                <Timeline
                  data={[
                    {
                      title: "Consultation",
                      content: (
                        <div>
                          <p className="text-justify">Tell us your goals, budget and desired spec. We align sourcing channels and timelines.</p>
                        </div>
                      ),
                    },
                    {
                      title: "Sourcing & Shortlist",
                      content: (
                        <div>
                          <p className="text-justify">We scan trusted dealers and auctions across markets and present verified options.</p>
                        </div>
                      ),
                    },
                    {
                      title: "Inspection & Order",
                      content: (
                        <div>
                          <p className="text-justify">Independent checks, documentation and order confirmation with transparent pricing.</p>
                        </div>
                      ),
                    },
                    {
                      title: "Shipping & Clearance",
                      content: (
                        <div>
                          <p className="text-justify">Tracked logistics, customs handling and regular status updates until arrival.</p>
                        </div>
                      ),
                    },
                    {
                      title: "Handover & Aftercare",
                      content: (
                        <div>
                          <p className="text-justify">Pre-delivery inspection, RMV registration, warranty activation and after-sales support.</p>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* CTA band */}
          <section className="relative bg-black">
            <div className="mx-auto max-w-6xl px-6 md:px-8 pb-16">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(230,208,144,0.08),rgba(255,255,255,0.04))] p-6 md:p-8 ring-1 ring-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.55)]">
                <div className="pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_right,black,transparent_80%)]">
                  <div className="absolute -top-10 left-0 h-40 w-40 rounded-full bg-[#E6D090]/20 blur-3xl" />
                </div>
                <div className="relative z-[1] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Book a private consultation</h3>
                    <p className="mt-1 text-white/75 max-w-2xl text-justify">Discuss specs, timelines and budgets with a specialist. No pressure just clarity and options that suit you.</p>
                  </div>
                  <Link to="/contact" className="shrink-0">
                    <Button className="bg-[#E6D090] text-black hover:bg-[#e0c77a] font-semibold">Start now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
      </div>
    </main>
  );
};

export default Services;
