import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin, ArrowRight, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FaWhatsapp } from "react-icons/fa";
import { SiTiktok, SiGoogle } from "react-icons/si";

const year = new Date().getFullYear();

const pages = [
  { to: "/", label: "Home" },
  { to: "/cars-for-sale", label: "Cars for Sale" },
  { to: "/used-cars", label: "Used Cars" },
  { to: "/japanese-car-import", label: "Japanese Import" },
  { to: "/brand-new-cars", label: "Brand New Cars" },
  { to: "/services", label: "Services" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/sitemap", label: "Sitemap" },
];

// Social links + subtle brand colors for hover accents
const socials = [
  { name: "Facebook", href: "https://www.facebook.com/share/1XB5WTeM8p/", icon: Facebook, color: "#1877F2" },
  { name: "Instagram", href: "https://www.instagram.com/cararenaceylon?igsh=NnFhdWcyc2FjdmZi", icon: Instagram, color: "#E4405F" },
  { name: "TikTok", href: "https://www.tiktok.com/@cararenaceylon?_t=ZS-8wEajr16ZWx&_r=1", icon: SiTiktok, color: "#25F4EE" },
  { name: "Google", href: "https://g.co/kgs/k26VW9Q", icon: SiGoogle, color: "#4285F4" },
  // WhatsApp uses the same phone number from the contact section
  { name: "WhatsApp", href: "https://wa.me/94777893221", icon: FaWhatsapp, color: "#25D366", iconClass: "scale-[1.15]" },
];

// Opening hours (Mon–Fri 9–6, Sat 9–3, Sun Closed)
const openingHours: { day: string; label: string }[] = [
  { day: "Monday", label: "9 am–6 pm" },
  { day: "Tuesday", label: "9 am–6 pm" },
  { day: "Wednesday", label: "9 am–6 pm" },
  { day: "Thursday", label: "9 am–6 pm" },
  { day: "Friday", label: "9 am–6 pm" },
  { day: "Saturday", label: "9 am–3 pm" },
  { day: "Sunday", label: "Closed" },
];

const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
const todayHours = openingHours.find((h) => h.day === todayName)?.label ?? "";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      {/* Top section - full width, no container */}
      <div className="w-full px-6 md:px-12 lg:px-20 py-14 md:py-20">
        {/* Custom grid: wider brand column, 3 equal columns shifted right */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-y-12 gap-x-10">
          {/* Brand and blurb */}
          <div>
            <Link to="/" aria-label="Home" className="inline-flex items-center gap-3 min-w-0">
              <img
                src="/car arena logo.png"
                alt="Car Arena Ceylon logo"
                className="h-12 w-12 object-contain shrink-0"
                width={48}
                height={48}
                loading="lazy"
              />
              <span className="flex-1 truncate text-xl font-semibold tracking-tight" title="Car Sales & Product Arena Ceylon">Car Sales & Product Arena Ceylon
</span>
            </Link>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
              CSPA Ceylon (Private) Limited is dedicated to shaping the future of the Automobile industry in Sri Lanka with high quality imports, trusted used vehicles, transparent transactions, and enthusiast-level care.
            </p>

            {/* Compact hours: inline today + popover for full table */}
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm text-white/85 ring-1 ring-white/10">
                <Clock className="h-4 w-4 opacity-80" aria-hidden />
                <span className="hidden sm:inline">Today:</span>
                <span className={todayHours === "Closed" ? "text-red-300" : "text-white/90"}>{todayHours || "Hours"}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="ml-1 rounded-full bg-white/10 px-2 py-1 text-xs font-medium text-white/90 ring-1 ring-white/15 transition hover:bg-white/15 hover:ring-white/25">
                      View hours
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-80 bg-black p-0 text-white border border-white/15">
                    <div className="px-3 py-2 text-sm font-semibold">Opening hours</div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-white/10">
                        {openingHours.map(({ day, label }) => {
                          const isToday = day === todayName;
                          return (
                            <tr key={day} className={isToday ? "bg-white/5" : undefined}>
                              <td className="px-3 py-2 font-medium text-white/90">
                                {isToday ? (
                                  <span>
                                    <span className="mr-1 rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">Today</span>
                                    {day}
                                  </span>
                                ) : (
                                  day
                                )}
                              </td>
                              <td className={`px-3 py-2 text-right tabular-nums ${label === "Closed" ? "text-red-300" : "text-white/80"}`}>
                                {label}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="px-3 py-2 text-[11px] text-white/60">Public holidays may affect times.</div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Pages */}
          <div className="lg:order-last">
              <h4 className="text-base font-semibold tracking-wide">Pages</h4>
              <ul className="mt-4 space-y-2 text-white/75">
                {pages.map((p) => (
                  <li key={p.to}>
                    <Link
                      to={p.to}
                      className="group inline-flex items-center gap-2 rounded-md px-1 py-1 hover:text-white"
                    >
                      <span>{p.label}</span>
                      <span className="opacity-0 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          {/* Follow us (replaces Utility column) */}
          <div>
              <h4 className="text-base font-semibold tracking-wide">Follow us</h4>
              <p className="mt-3 text-sm text-white/70">Stay connected for updates, arrivals, and offers.</p>
              <div className="mt-5 grid grid-flow-col auto-cols-max items-center gap-3 sm:gap-4">
                {socials.map(({ name, href, icon: Icon, color, iconClass }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    // Use a CSS var to drive the hover color without adding custom CSS files
                    style={{ ["--brand" as any]: color }}
                    className="group inline-flex size-11 items-center justify-center rounded-full bg-white/5 text-white/85 ring-1 ring-white/15 outline-none transition
                               hover:bg-white/10 hover:text-white hover:ring-[var(--brand)]
                               focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                    title={name}
                  >
                    <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconClass ?? ""}`} aria-hidden />
                    <span className="sr-only">{name}</span>
                  </a>
                ))}
              </div>
            </div>

          {/* Contact */}
          <div>
              <h4 className="text-base font-semibold tracking-wide">Contact us</h4>
              <div className="mt-4 space-y-4">
                <a
                  href="mailto:cararenaceylon@gmail.com"
                  className="group flex items-center gap-3 rounded-md px-1 py-1 text-white/80 hover:text-white"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/15">
                    <Mail className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-white/60">Send us an email</span>
                    <span className="block text-sm font-medium">cararenaceylon@gmail.com</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </a>

                <a
                  href="tel:+94777893221"
                  className="group flex items-center gap-3 rounded-md px-1 py-1 text-white/80 hover:text-white"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/15">
                    <Phone className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-white/60">Give us a call</span>
                    <span className="block text-sm font-medium">+94 77 789 3221</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </a>

                <a
                  href="https://maps.app.goo.gl/eKfmSxEzEkRVb9YJ7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-md px-1 py-1 text-white/80 hover:text-white"
                  aria-label="Open address in Google Maps"
                >
                  <span className="grid size-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/15">
                    <MapPin className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs text-white/60">Address</span>
                    <span className="block text-sm font-medium">
                      Level 12<br />
                      One Galle Face Tower<br />
                      No.1A, Center Road, Colombo 02<br />
                      Sri Lanka, 00200
                    </span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 opacity-0 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </a>
              </div>
            </div>
        </div>
      </div>

      {/* Bottom bar - full width */}
      <div className="border-t border-white/10 w-full">
        <div className="w-full px-6 md:px-12 lg:px-20 py-6">
          <div className="flex items-center justify-center">
            <Link
              to="/admin/login"
              className="inline-flex h-9 items-center justify-center rounded-md bg-white/10 px-3 text-xs font-medium text-white/90 ring-1 ring-white/20 transition hover:bg-white/15"
            >
              Admin Login
            </Link>
          </div>
          <p className="mt-3 text-center text-sm text-white/60">
            Copyright © {year} <span className="text-white">CSPA Ceylon (Private) Limited </span>
          </p>
          <p className="mt-1 text-center text-sm text-white/60">
            Powered by{" "}
            <a
              href="https://www.arcai.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-white hover:opacity-80 transition-opacity align-middle"
              title="Web Design, Development & AI Solutions by ARC AI"
              aria-label="Web Development and AI Solutions by ARC AI"
            >
              <span className="sr-only">Web Design & AI Solutions by ARC AI</span>
              <img
                src="/arclogo.png"
                alt="ARC AI - Web Design & AI Agency Logo"
                className="h-14 w-14 md:h-20 md:w-20 object-contain"
                width={80}
                height={80}
                loading="lazy"
              />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
