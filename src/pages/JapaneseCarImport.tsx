import { SEO } from "@/lib/seo";
import { useEffect } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

const JapaneseCarImport = () => {
  useEffect(() => {
    const faq = {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
      {"@type":"Question","name":"How long does a Japanese car import take?","acceptedAnswer":{"@type":"Answer","text":"Typical end-to-end timelines range 6–10 weeks depending on auction scheduling, shipping lanes and clearance queues."}},
      {"@type":"Question","name":"What costs are included in the import process?","acceptedAnswer":{"@type":"Answer","text":"Auction hammer, inland transport, export handling, ocean freight, insurance, duties, taxes, port & clearance fees plus our flat service fee."}},
      {"@type":"Question","name":"Can I bid directly in auctions?","acceptedAnswer":{"@type":"Answer","text":"We execute bids on your behalf using verified channels while you approve target ranges and condition reports."}}
    ]};
    const id="jp-import-faq"; const existing=document.getElementById(id); if(existing) existing.remove();
    const s=document.createElement("script"); s.id=id; s.type="application/ld+json"; s.text=JSON.stringify(faq); document.head.appendChild(s);
    return ()=>{ const x=document.getElementById(id); if(x) x.remove(); };
  }, []);
  return (
    <main className="bg-black text-white py-20 md:py-24">
      <SEO
        title="Japanese Car Import Sri Lanka | End-to-End Sourcing | Car Arena"
        description="Transparent Japanese car import Sri Lanka service: auction sourcing, inspection, shipping, clearance and delivery with documentation support."
        canonical="https://cararenaceylon.com/japanese-car-import"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="Japanese car import Sri Lanka, import cars Sri Lanka, car dealers Colombo, brand new cars Sri Lanka"
      />
      <header className="mx-auto max-w-6xl px-6 md:px-8">
        <Breadcrumbs />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Japanese Car Import Sri Lanka</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80 text-justify">
          A guided pathway to secure the exact vehicle specification via vetted auction and dealer channels in Japan with real-time cost structure visibility and logistics oversight.
        </p>
      </header>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-14">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Process Snapshot</h2>
        <p className="max-w-3xl text-white/75 text-justify">
          Sourcing → Auction bid strategy → Pre-export inspection → Shipping coordination → Customs & duty management → Local registration and delivery. A fuller procedural breakdown will follow in upcoming detailed modules.
        </p>
      </section>
      <section className="mx-auto max-w-6xl px-6 md:px-8 mt-16">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6 max-w-3xl text-white/80 text-justify">
          <div>
            <h3 className="font-semibold text-white">How long does a Japanese car import take?</h3>
            <p>Most orders clear within 6–10 weeks subject to vessel schedules and customs throughput.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">What costs are included in the import process?</h3>
            <p>We outline all line items: auction hammer, logistics, insurance, statutory duties and service fee before commitment.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Can I bid directly in auctions?</h3>
            <p>We handle bid execution after you approve target price bands and condition disclosures.</p>
          </div>
        </div>
      </section>
      <div className="sr-only">
        <h2>Brand New Cars Sri Lanka Pathways</h2>
        <p>Clarifies overlap where Japanese car import Sri Lanka workflows apply to certain brand new cars Sri Lanka allocations.</p>
      </div>
    </main>
  );
};

export default JapaneseCarImport;
