import { Link } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Leaf, Cog, Lightbulb, Users, MessageSquare, Star } from "lucide-react";
import Reveal from "../components/Reveal";
import { SEO } from "@/lib/seo";

// Code-split heavier, below-the-fold content
const TimelineDemo = lazy(() => import("@/components/timeline-demo"));

const About = () => {
  // Preconnect + preload the hero image host for faster LCP
  useEffect(() => {
    const heroUrl = "https://framerusercontent.com/images/ONBYliQfOXng5kPB9bZV2uMBXw.jpg";
    const preconnect = document.createElement("link");
    preconnect.rel = "preconnect";
    preconnect.href = "https://framerusercontent.com";
    document.head.appendChild(preconnect);

    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.href = heroUrl;
    // Hint high priority for Chromium-based browsers
    // @ts-expect-error fetchpriority is not yet in TS lib typings everywhere
    preload.fetchpriority = "high";
    document.head.appendChild(preload);

    return () => {
      if (preconnect.parentNode) preconnect.parentNode.removeChild(preconnect);
      if (preload.parentNode) preload.parentNode.removeChild(preload);
    };
  }, []);

  return (
    <main className="bg-black text-white">
      <SEO
        title="About Car Arena Ceylon | Car Dealer Colombo & Japanese Car Import Sri Lanka"
        description="About Car Arena Ceylon – leading car dealer in Colombo Sri Lanka offering Japanese car import services, brand new cars, certified used cars and OEM upgrades with transparent after-sales care."
        canonical="https://cararenaceylon.com/about"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="car dealer Colombo, Japanese car import Sri Lanka, brand new cars Sri Lanka, used cars Sri Lanka, cars for sale Sri Lanka, about Car Arena Ceylon"
      />
      <div className="sr-only">
        <h2>Leading Car Dealer in Colombo Sri Lanka</h2>
        <p>We support cars for sale Sri Lanka demand through curated brand new cars Sri Lanka sourcing, Japanese car import Sri Lanka facilitation and quality used cars Sri Lanka inventory.</p>
      </div>
      {/* Hero with background image and soft gradients */}
  <section aria-label="About hero" className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://framerusercontent.com/images/ONBYliQfOXng5kPB9bZV2uMBXw.jpg"
            alt="Car Arena Ceylon — About background"
            className="h-full w-full object-cover -translate-y-20 sm:-translate-y-12 md:translate-y-0"
            decoding="async"
            loading="eager"
            // Provide modern priority hint and responsive size intent
            // @ts-expect-error not yet in TS DOM typings in all versions
            fetchpriority="high"
            sizes="100vw"
            style={{ objectPosition: "center center" }}
            draggable={false}
          />
          {/* Vignettes for contrast (slightly reduced fade) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/45 to-black/90" />
        </div>

  <div className="relative mx-auto max-w-7xl px-6 sm:px-8 pt-48 pb-28 md:pt-60 md:pb-36">
          <Reveal>
            <div className="max-w-3xl pt-7 translate-y-14">
              
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Crafting better drives for Sri Lanka
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg text-justify">
                Car Arena Ceylon brings premium imports, trusted used vehicles, and enthusiast-grade care
                together so you can drive with confidence and pride.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who we are */}
      <section className="relative mx-auto max-w-7xl px-6 sm:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-6" delay={0}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Who we are</h2>
            <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg text-justify">
              We’re a Sri Lankan automotive partner focused on quality, transparency, and after‑sales care.
              From curated imports to high‑condition used cars and tasteful upgrades, our team blends
              expertise with service you can feel.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { title: "Premium imports", desc: "Handpicked to match local roads and expectations." },
                { title: "Trusted used cars", desc: "Well‑maintained vehicles with clear histories." },
                { title: "Upgrades & detailing", desc: "Subtle performance and aesthetic enhancements." },
                { title: "End‑to‑end support", desc: "Financing guidance, registration, and after‑care." },
              ].map((f, i) => (
                <Reveal
                  key={i}
                  delay={100 + i * 120}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 supports-[backdrop-filter]:backdrop-blur-md p-5 ring-1 ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_30px_rgba(0,0,0,0.35)] transition-colors"
                >
                  {/* glossy highlight */}
                  <div className="pointer-events-none absolute inset-0 z-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_65%)]">
                    <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-white/12 blur-2xl" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                  </div>
                  <div className="relative z-[1]">
                    <div className="text-[#E6D090] text-sm font-semibold uppercase tracking-wider">{f.title}</div>
                    <p className="mt-1.5 text-sm text-white/75 text-justify">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Reveal className="md:col-span-6" delay={120}>
            <div className="relative overflow-hidden rounded-3xl">
              <img
                src="/about fixed.webp"
                alt="Car Arena Ceylon showroom"
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              {/* Strong rectangular feathered fade (no borders) */}
              <div className="pointer-events-none absolute inset-0">
                {/* Use stronger mid opacity to blend */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute left-0 top-0 h-full w-36 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute right-0 top-0 h-full w-36 bg-gradient-to-l from-black via-black/40 to-transparent" />
                {/* Subtle inner vignette to smooth corners */}
                <div className="absolute inset-0 [background:radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)] mix-blend-multiply" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* Our Story - timeline (replaced with Timeline component) */}
      <section className="relative mx-auto max-w-7xl px-0 sm:px-0">
        <Suspense
          fallback={
            <div className="px-6 sm:px-8 py-16 md:py-24">
              <div className="h-40 w-full animate-pulse rounded-2xl bg-white/5 ring-1 ring-white/10" />
            </div>
          }
        >
          <TimelineDemo />
        </Suspense>
      </section>

    {/* Values (replaces "Why choose us") */}
  <section className="relative mx-auto max-w-7xl px-6 sm:px-8 mt-12 md:mt-16 pt-16 md:pt-24 pb-16 md:pb-24">
        {/* Title row */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <Reveal className="max-w-3xl" delay={0}>
            
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The values that drive everything we do
            </h2>
          </Reveal>
          <Reveal delay={120} className="shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Join us
              <span aria-hidden className="inline-block">→</span>
            </Link>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Sustainability",
              desc:
                "We prioritize solutions, ensuring our operations and vehicles contribute to a greener planet",
              Icon: Leaf,
            },
            {
              title: "Infrastructure",
              desc:
                "Our network of charging stations and service centers ensures support for every journey.",
              Icon: Cog,
            },
            {
              title: "Innovation",
              desc:
                "We push technological boundaries, developing features for safer, smarter, and exciting drives.",
              Icon: Lightbulb,
            },
            {
              title: "Team work",
              desc:
                "Collaboration is at our core; talents unite, fostering a culture of success and achievements.",
              Icon: Users,
            },
            {
              title: "Communication",
              desc:
                "Transparent dialogue fuels our progress, strengthening relationships with our customers, partners, and teams.",
              Icon: MessageSquare,
            },
            {
              title: "Excellence",
              desc:
                "We uphold uncompromising standards in every vehicle we import and deliver, ensuring dependable performance.",
              Icon: Star,
            },
          ].map((item, i) => (
            <Reveal
              key={item.title}
              delay={80 + i * 100}
              className="text-center"
            >
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-black ring-1 ring-white/20">
                <item.Icon aria-hidden className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/75 text-justify">{item.desc}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-6 sm:px-8 pb-24">
        <Reveal className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C2A661]/10 via-transparent to-transparent" />
          <div className="relative z-10 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-7" delay={0}>
              <h3 className="text-2xl font-semibold sm:text-3xl">Ready to find your next car?</h3>
              <p className="mt-2 max-w-xl text-white/80 text-justify">
                Explore our services or talk to us for tailored recommendations today.
              </p>
            </Reveal>
            <Reveal className="md:col-span-5 flex flex-wrap gap-3 md:justify-end" delay={120}>
              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-xl bg-[#C2A661]/90 px-5 py-3 font-semibold text-black ring-1 ring-[#E6D090]/70 transition-colors hover:bg-[#E6D090]"
              >
                View Services
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-white/10 px-5 py-3 font-semibold text-white ring-1 ring-white/20 transition-colors hover:bg-white/15"
              >
                Contact Us
              </Link>
            </Reveal>
          </div>
        </Reveal>
      </section>
    </main>
  );
};

export default About;
