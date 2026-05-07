import { SEO } from "@/lib/seo";
import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

const CarsForSale = () => {
  // Inject page-specific FAQ JSON-LD
  useEffect(() => {
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question","name": "How do you verify used cars before listing?","acceptedAnswer": {"@type": "Answer","text": "Each vehicle passes a structured multi-point inspection covering chassis, drivetrain, electronics and interior; documentation and condition notes will be published with listings."}},
        {"@type": "Question","name": "Can I reserve a car that is in transit?","acceptedAnswer": {"@type": "Answer","text": "Yes. Eligible inbound units can be reserved with a transparent deposit; final payment is due post-inspection and document validation."}},
        {"@type": "Question","name": "Do listings include warranty information?","acceptedAnswer": {"@type": "Answer","text": "Where applicable, factory or extended warranty scope will be indicated; additional coverage options may be offered at purchase."}}
      ]
    };
    const id = "cars-for-sale-faq";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (script) script.remove();
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.text = JSON.stringify(faq);
    document.head.appendChild(script);
    return () => { script && script.remove(); };
  }, []);
  return (
    <main className="bg-black text-white py-20 md:py-24">
      <SEO
        title="Cars for Sale Sri Lanka | Certified Listings | Car Arena Ceylon"
        description="Browse curated cars for sale in Sri Lanka – vetted brand new allocations & inspected used vehicles with transparent pricing and nationwide support."
        canonical="https://cararenaceylon.com/cars-for-sale"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="cars for sale Sri Lanka, used cars Sri Lanka, brand new cars Sri Lanka, car dealers Colombo"
      />
      <header className="mx-auto max-w-6xl px-6 md:px-8">
        <Breadcrumbs />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Cars for Sale in Sri Lanka</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80 text-justify">
          Discover a focused selection of brand new and high-condition used vehicles sourced through trusted channels. Each listing is matched to Sri Lankan conditions with documentation support.
        </p>
      </header>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Inventory Overview</h2>
        <p className="max-w-3xl text-white/75 text-justify">
          Our active inventory updates as orders finalize and new arrivals complete inspection. Detailed vehicle pages, pricing transparency and warranty eligibility indicators will appear here as inventory expands.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6 max-w-3xl text-white/80 text-justify">
          <div>
            <h3 className="font-semibold text-white">How do you verify used cars before listing?</h3>
            <p>Each vehicle is inspected against a consistent multi-point framework so you can trust condition claims once listings go live.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Can I reserve a car that is in transit?</h3>
            <p>Yes, qualifying inbound vehicles can be reserved with a documented deposit structure and clear timelines.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Do listings include warranty information?</h3>
            <p>Eligible vehicles will show available factory balance or optional extended coverage pathways.</p>
          </div>
        </div>
      </section>
      <div className="sr-only">
        <h2>Used Cars Sri Lanka Listings</h2>
        <p>Section supports used cars Sri Lanka searchers with certified inspection and pricing clarity.</p>
        <h2>Brand New Cars Sri Lanka Availability</h2>
        <p>Highlights allocation windows and preorder paths for brand new vehicles.</p>
      </div>
    </main>
  );
};

export default CarsForSale;
