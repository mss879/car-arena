import { SEO } from "@/lib/seo";
import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

const BrandNewCars = () => {
  useEffect(() => {
    const faq = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"How do allocations for brand new cars work?","acceptedAnswer":{"@type":"Answer","text":"We monitor manufacturer release schedules and secure slots; earlier interest improves allocation probability."}},
      {"@type":"Question","name":"Can I customize OEM options before shipping?","acceptedAnswer":{"@type":"Answer","text":"Yes. Factory-approved accessory and trim configurations are locked prior to final order confirmation."}},
      {"@type":"Question","name":"Do brand new imports include warranty coverage?","acceptedAnswer":{"@type":"Answer","text":"Eligible units carry manufacturer or region-equivalent warranty; scope is disclosed before payment."}}
    ]};
    const id="brand-new-faq"; const existing=document.getElementById(id); if(existing) existing.remove();
    const s=document.createElement("script"); s.id=id; s.type="application/ld+json"; s.text=JSON.stringify(faq); document.head.appendChild(s);
    return ()=>{ const x=document.getElementById(id); if(x) x.remove(); };
  }, []);
  return (
    <main className="bg-black text-white py-20 md:py-24">
      <SEO
        title="Brand New Cars Sri Lanka | Authorized Sourcing | Car Arena"
        description="Brand new cars Sri Lanka sourcing with allocation guidance, order tracking, OEM upgrade options and delivery support."
        canonical="https://cararenaceylon.com/brand-new-cars"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="brand new cars Sri Lanka, cars for sale Sri Lanka, Japanese car import Sri Lanka, car dealers Colombo"
      />
      <header className="mx-auto max-w-6xl px-6 md:px-8">
        <Breadcrumbs />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Brand New Cars Sri Lanka</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80 text-justify">
          Structured sourcing for newly released models with clarity on delivery windows, warranty scope and factory-correct OEM customization options.
        </p>
      </header>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Allocation & Ordering</h2>
        <p className="max-w-3xl text-white/75 text-justify">
          We monitor manufacturer release cycles and secure allocation slots. Ordering modules and dynamic availability indicators will surface here as program data matures.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6 max-w-3xl text-white/80 text-justify">
          <div>
            <h3 className="font-semibold text-white">How do allocations for brand new cars work?</h3>
            <p>Allocation depends on release timing, demand, and early reservation; we advise on realistic delivery windows.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Can I customize OEM options before shipping?</h3>
            <p>Factory-supported accessories and select trim packages can be confirmed pre-shipment.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Do brand new imports include warranty coverage?</h3>
            <p>Warranty eligibility and regional equivalency are provided before commitment; optional extended coverage may be available.</p>
          </div>
        </div>
      </section>
      <div className="sr-only">
        <h2>Cars for Sale Sri Lanka New Vehicle Listings</h2>
        <p>Supports intent adjacency between brand new cars Sri Lanka and broader cars for sale Sri Lanka searches without duplicating core copy.</p>
      </div>
    </main>
  );
};

export default BrandNewCars;
