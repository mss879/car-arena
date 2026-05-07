import { SEO } from "@/lib/seo";
import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

const UsedCars = () => {
  useEffect(() => {
    const faq = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"What inspection items do you check?","acceptedAnswer":{"@type":"Answer","text":"Exterior paint depth, panel alignment, chassis corrosion, engine diagnostics, transmission behavior, suspension wear, electronics and interior condition."}},
      {"@type":"Question","name":"Can I request the inspection report?","acceptedAnswer":{"@type":"Answer","text":"Yes. A summary view will be public; a full report can be requested for shortlisted vehicles."}},
      {"@type":"Question","name":"Do you assist with financing for used cars?","acceptedAnswer":{"@type":"Answer","text":"We provide partner introductions and required documentation guidance; approval remains lender dependent."}}
    ]};
    const id = "used-cars-faq"; let el=document.getElementById(id); if(el) el.remove();
    const s=document.createElement("script"); s.id=id; s.type="application/ld+json"; s.text=JSON.stringify(faq); document.head.appendChild(s);
    return ()=>{ const x=document.getElementById(id); if(x) x.remove(); };
  }, []);
  return (
    <main className="bg-black text-white py-20 md:py-24">
      <SEO
        title="Used Cars Sri Lanka | Inspected Pre-Owned Vehicles | Car Arena"
        description="Quality used cars in Sri Lanka with inspection transparency, documentation support and optional warranties."
        canonical="https://cararenaceylon.com/used-cars"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="used cars Sri Lanka, cars for sale Sri Lanka, inspected used cars, car dealers Colombo"
      />
      <header className="mx-auto max-w-6xl px-6 md:px-8">
        <Breadcrumbs />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Used Cars Sri Lanka</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80 text-justify">
          A selective roster of pre-owned vehicles with service histories and thorough condition verification. Our process emphasizes mechanical integrity and value retention.
        </p>
      </header>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Inspection Framework</h2>
        <p className="max-w-3xl text-white/75 text-justify">
          Each vehicle undergoes structured checks: exterior, chassis, drivetrain, electronics and interior. Findings will appear in a standardized summary once listing modules are active.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6 max-w-3xl text-white/80 text-justify">
          <div>
            <h3 className="font-semibold text-white">What inspection items do you check?</h3>
            <p>We evaluate structural, mechanical, electronic and interior metrics for objective condition clarity.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Can I request the inspection report?</h3>
            <p>A concise summary will be visible; full reports can be shared upon qualified interest.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Do you assist with financing for used cars?</h3>
            <p>We coordinate documentation and connect you with partner lenders to streamline approval.</p>
          </div>
        </div>
      </section>
      <div className="sr-only">
        <h2>Cars for Sale Sri Lanka Pre-Owned Listings</h2>
        <p>Supports relevance for cars for sale Sri Lanka while maintaining unique focus on used cars Sri Lanka intent.</p>
      </div>
    </main>
  );
};

export default UsedCars;
