import { Mail, Phone, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/lib/seo";
import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { useToast } from "@/hooks/use-toast";

const SERVICE_ID = "service_0hrjv6l";
const TEMPLATE_ID = "template_nh1010b";
const PUBLIC_KEY = "N-v1LB_v3O90I3R8d";

const Contact = () => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Initialize EmailJS once on mount
  useEffect(() => {
    try {
      emailjs.init({ publicKey: PUBLIC_KEY });
    } catch {
      // no-op; init is idempotent in practice
    }
  }, []);
  return (
    <main className="container mx-auto max-w-7xl py-20 md:py-28">
      <SEO
        title="Contact Car Arena Ceylon | Car Dealer Colombo & Imports"
        description="Contact Car Arena Ceylon – speak to a Colombo car dealer specialist about Japanese car import Sri Lanka, brand new cars, used cars for sale and OEM upgrades."
        canonical="https://cararenaceylon.com/contact"
        image="https://cararenaceylon.com/hero%20image.png"
        keywords="contact car dealer Colombo, Japanese car import Sri Lanka, cars for sale Sri Lanka, used cars Sri Lanka"
      />
      <div className="sr-only">
        <h2>Contact for Cars for Sale and Japanese Imports</h2>
        <p>Reach our team regarding cars for sale Sri Lanka lists, used cars Sri Lanka inspections, Japanese car import Sri Lanka timelines or brand new cars Sri Lanka sourcing.</p>
      </div>
      {/* Section: Hero / Title */}
      <section aria-labelledby="contact-title" className="text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 text-sm font-medium text-foreground/80">• Get in touch</div>

          <h1
            id="contact-title"
            className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-6xl"
          >
            Contact us today
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl text-justify">
            We're eager to hear from you. Whether you have questions, feedback, or
            need support, our team is ready to provide assistance now.
          </p>
        </div>
      </section>

      
      {/* Section: Contact Methods */}
      <section className="mt-12 md:mt-16">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 [perspective:1600px]">
          {/* Email */}
          <Card className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#14171a] to-[#090a0c] p-8 text-center md:p-10 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.75),0_2px_0_rgba(255,255,255,0.05)_inset] transition-all duration-500 ease-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.12),rgba(255,255,255,0)_60%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 hover:-translate-y-3 hover:scale-[1.025] hover:shadow-[0_18px_42px_-8px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-b from-[#24282c] to-[#14171a] shadow-inner shadow-black/60 ring-1 ring-white/10">
              <Mail className="h-6 w-6 text-[#c2a259] drop-shadow-[0_0_4px_rgba(194,162,89,0.4)]" />
            </div>
            <h2 className="text-2xl font-semibold">Send us an email</h2>
            <p className="mt-3 max-w-sm text-base text-muted-foreground text-justify">
              For detailed inquiries or support, please email us; we'll respond shortly here.
            </p>
            <div className="mt-auto pt-6">
              <a
                href="mailto:cararenaceylon@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-lg font-semibold text-foreground hover:underline underline-offset-4"
              >
                cararenaceylon@gmail.com
                <ArrowRight className="h-4 w-4 text-sky-500" />
              </a>
            </div>
          </Card>

          {/* Phone */}
          <Card className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#14171a] to-[#090a0c] p-8 text-center md:p-10 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.75),0_2px_0_rgba(255,255,255,0.05)_inset] transition-all duration-500 ease-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.12),rgba(255,255,255,0)_60%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 hover:-translate-y-3 hover:scale-[1.025] hover:shadow-[0_18px_42px_-8px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-b from-[#24282c] to-[#14171a] shadow-inner shadow-black/60 ring-1 ring-white/10">
              <Phone className="h-6 w-6 text-[#c2a259] drop-shadow-[0_0_4px_rgba(194,162,89,0.4)]" />
            </div>
            <h2 className="text-2xl font-semibold">Give us a call</h2>
            <p className="mt-3 max-w-sm text-base text-muted-foreground text-justify">
              Prefer to talk? Our customer service team is available by phone during business hours.
            </p>
            <div className="mt-auto pt-6">
              <a
                href="tel:+94777893221"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-lg font-semibold text-foreground hover:underline underline-offset-4"
              >
                +94 77 789 3221
                <ArrowRight className="h-4 w-4 text-sky-500" />
              </a>
            </div>
          </Card>

          {/* Address */}
          <Card className="group relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#14171a] to-[#090a0c] p-8 text-center md:p-10 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.75),0_2px_0_rgba(255,255,255,0.05)_inset] transition-all duration-500 ease-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.12),rgba(255,255,255,0)_60%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100 hover:-translate-y-3 hover:scale-[1.025] hover:shadow-[0_18px_42px_-8px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)_inset]">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-b from-[#24282c] to-[#14171a] shadow-inner shadow-black/60 ring-1 ring-white/10">
              <MapPin className="h-6 w-6 text-[#c2a259] drop-shadow-[0_0_4px_rgba(194,162,89,0.4)]" />
            </div>
            <h2 className="text-2xl font-semibold">Address</h2>
            <p className="mt-3 max-w-sm text-base text-muted-foreground text-justify">
              Level 12<br />
              One Galle Face Tower<br />
              No.1A, Center Road, Colombo 02<br />
              Sri Lanka, 00200
            </p>
            <div className="mt-auto pt-6">
              <a
                href="https://maps.app.goo.gl/eKfmSxEzEkRVb9YJ7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-lg font-semibold text-foreground hover:underline underline-offset-4"
              >
                Open in Google Maps
                <ArrowRight className="h-4 w-4 text-sky-500" />
              </a>
            </div>
          </Card>
        </div>
      </section>
      {/* Section: Contact Form */}
      <section aria-labelledby="contact-form-title" className="mt-16 md:mt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-4 text-sm font-medium text-foreground/80">• Contact</div>
          <h2
            id="contact-form-title"
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Send us a message
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg text-justify">
            If you have questions or need information, use the form below. Our team will get back to you promptly today.
          </p>
        </div>

        {/* Form Card */}
        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-white/10 bg-[rgb(9,10,12)] p-6 md:p-10">
          <form
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (submitting) return;

              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const fullName = String(data.get("fullName") || "").trim();
              const email = String(data.get("email") || "").trim();
              const phone = String(data.get("phone") || "").trim();
              const subject = String(data.get("subject") || "").trim();
              const message = String(data.get("message") || "").trim();

              // Basic front-end validation
              if (!fullName || !email || !phone || !subject || !message) {
                toast({
                  title: "Missing details",
                  description: "Please fill in all fields before sending.",
                });
                return;
              }

              setSubmitting(true);
              try {
                // Map our form fields to your EmailJS template variables
                const templateParams = {
                  from_name: fullName,
                  email,
                  phone,
                  subject,
                  message,
                };

                await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);

                toast({
                  title: "Message sent",
                  description: "Thanks for reaching out. We'll get back to you shortly.",
                });
                form.reset();
              } catch (err) {
                console.error("EmailJS error", err);
                toast({
                  title: "Couldn't send message",
                  description: "Please try again in a moment or email us directly.",
                });
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {/* Full name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName" className="text-sm font-medium">Full name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Carter"
                required
                className="h-12 rounded-full border border-[rgb(9,10,12)] bg-[rgb(18,20,24)] px-4 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="email@example.com"
                required
                className="h-12 rounded-full border border-[rgb(9,10,12)] bg-[rgb(18,20,24)] px-4 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="(123) 456 - 7890"
                required
                className="h-12 rounded-full border border-[rgb(9,10,12)] bg-[rgb(18,20,24)] px-4 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Support request"
                required
                className="h-12 rounded-full border border-[rgb(9,10,12)] bg-[rgb(18,20,24)] px-4 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Message */}
            <div className="md:col-span-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Write your message here..."
                  className="h-36 resize-vertical rounded-xl border border-[rgb(18,20,24)] bg-[rgb(18,20,24)] px-4 py-4 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                variant="default"
                disabled={submitting}
                className="h-10 rounded-full px-5 font-semibold bg-[#C2A661] text-black hover:bg-[#B59A55] focus-visible:ring-2 focus-visible:ring-[#C2A661] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </span>
                ) : (
                  <span className="inline-flex items-center">Send Message <ArrowRight className="ml-2 h-4 w-4" /></span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Section: Office imagery (1 wide + 2 square) */}
      <section aria-labelledby="office-images" className="mt-24 md:mt-32">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="office-images"
            className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Visit our office
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg text-center">
            Book your appointment to visit our office for your import consultation
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-6xl px-2 md:px-4">
          {/* Top long panoramic image only */}
          <div className="relative overflow-hidden rounded-3xl bg-black/40 ring-1 ring-white/5">
            <img
              src="/top%20long%20image%20.jpg"
              alt="Showroom panoramic view"
              className="edge-fade-xy h-[32vh] w-full object-cover md:h-[46vh]"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>
    </main>
  );
};
export default Contact;
