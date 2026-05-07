import { Link, NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, ChevronRight, Home, Info, Wrench, MessageSquareText, Phone as PhoneIcon, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const getIconFor = (to: string) => {
    switch (to) {
      case "/":
        return <Home className="h-5 w-5" aria-hidden />;
      case "/about":
        return <Info className="h-5 w-5" aria-hidden />;
      case "/services":
        return <Wrench className="h-5 w-5" aria-hidden />;
      case "/testimonials":
        return <MessageSquareText className="h-5 w-5" aria-hidden />;
      case "/contact":
        return <PhoneIcon className="h-5 w-5" aria-hidden />;
      default:
        return null;
    }
  };
  return (
    <header
    className={`z-50 w-full bg-transparent ${isHome ? "fixed" : "sticky"} pl-safe pr-safe`}
    style={{ top: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
    >
  <nav className="container flex h-28 items-center justify-between">
        <Link to="/" aria-label="Home" className="flex items-center gap-2">
          {/* Fixed-size wrapper keeps layout width; inner img scaled for larger visual size */}
          <span className="relative block h-24 w-24 md:h-28 md:w-28 overflow-visible">
            <img
              src="/car arena logo.png"
              alt="Brand logo"
              className="absolute inset-0 h-full w-full object-contain origin-left scale-[1.28] md:scale-[1.38]"
              loading="eager"
              width={96}
              height={96}
            />
          </span>
        </Link>

    {/* Desktop nav (kept on the right, separate from logo) */}
  <ul className="hidden md:flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md ring-1 ring-white/15 shadow-[0_14px_28px_-12px_rgba(0,0,0,0.65)]">
          {navItems.map((item) => (
            <li key={item.to}>
      <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
    // base item style with underline animation
    "relative px-4 py-2 rounded-lg text-base uppercase font-medium text-[#C2A661]/80 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC97A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[2px] after:bg-[#E6D090] after:rounded after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:text-[#E6D090] hover:after:scale-x-100",
        // active state => keep floating look, no filled button, show underline
        isActive ? "text-[#E6D090] after:scale-x-100" : "",
                  ].join(" ")
                }
                aria-label={item.label}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile combined: inline link (Home only) connected with hamburger */}
        {(() => {
          const inlineSet = new Set(["/"]);
          const mobileInlineItems = navItems.filter((i) => inlineSet.has(i.to));
          const mobileSheetItems = navItems.filter((i) => !inlineSet.has(i.to));
          return (
            <div className="md:hidden flex items-center">
              <div className="flex items-center gap-1 rounded-2xl bg-white/10 px-2 py-1.5 backdrop-blur-md ring-1 ring-white/15 shadow-[0_12px_24px_-10px_rgba(0,0,0,0.6)]">
                <ul className="flex items-center gap-1">
                  {mobileInlineItems.map((item) => (
                    <li key={item.to}>
          <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          [
            "relative px-3 py-1.5 rounded-lg text-base uppercase font-medium text-[#C2A661]/85 transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC97A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent after:absolute after:left-2.5 after:right-2.5 after:bottom-0.5 after:h-[2px] after:bg-[#E6D090] after:rounded after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:text-[#E6D090] hover:after:scale-x-100",
                            isActive ? "text-[#E6D090] after:scale-x-100" : "",
                          ].join(" ")
                        }
                        aria-label={item.label}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
                <span className="mx-1 h-5 w-px bg-white/20" />
                <Sheet>
                  <SheetTrigger asChild>
                    <button
                      className="inline-flex items-center justify-center rounded-md p-2 text-[#C2A661] hover:text-[#E6D090] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC97A]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                      aria-label="Open menu"
                    >
                      <Menu className="h-5 w-5" />
                    </button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-full sm:w-[420px] p-0 bg-black/60 backdrop-blur-xl border-l border-white/10 ring-1 ring-inset ring-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.65)]"
                  >
                    <div className="relative flex h-full flex-col">
                      {/* Accent top bar */}
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E6D090]/60 to-transparent" />
                      {/* Branded header */}
                      <div className="flex items-center gap-3 px-5 pt-6 pb-4 border-b border-white/10">
                        <img
                          src="/car arena logo.png"
                          alt="Car Arena Ceylon"
                          className="h-9 w-9 object-contain"
                          width={36}
                          height={36}
                          loading="lazy"
                        />
                        <div className="text-sm font-semibold tracking-wider text-[#E6D090] uppercase">
                          Menu
                        </div>
                      </div>

                      {/* Navigation */}
                      <nav className="px-3 py-4 space-y-2">
                        {mobileSheetItems.map((item) => (
                          <SheetClose asChild key={item.to}>
                            <NavLink
                              to={item.to}
                              end={item.to === "/"}
                              className={({ isActive }) =>
                                [
                                  "group flex items-center gap-4 rounded-2xl px-5 py-4 text-base uppercase tracking-wide font-medium text-white/90 transition-colors duration-200",
                                  "ring-1 ring-white/10 bg-white/[0.04] hover:bg-white/10",
                                  isActive ? "text-[#E6D090] ring-[#E6D090]/30 bg-white/10" : "hover:text-[#E6D090]",
                                ].join(" ")
                              }
                              aria-label={item.label}
                            >
                              <span className="text-[#E6D090]">{getIconFor(item.to)}</span>
                              <span className="flex-1">{item.label}</span>
                              <ChevronRight className="h-5 w-5 opacity-60 group-hover:opacity-100 transition-opacity" aria-hidden />
                            </NavLink>
                          </SheetClose>
                        ))}
                      </nav>

                      {/* Social links */}
                      <div className="mt-auto px-5 pt-4 border-t border-white/10">
                        <div className="text-xs uppercase tracking-widest text-white/50 mb-3">Connect</div>
                        <div className="flex items-center gap-3 pb-4">
                          <a
                            href="https://facebook.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="inline-flex size-12 items-center justify-center rounded-full bg-white/5 text-white/90 ring-2 ring-[#C2A661]/70 hover:ring-[#E6D090]/80 hover:bg-white/10 transition-colors"
                          >
                            <Facebook className="h-6 w-6" />
                          </a>
                        </div>
                        {/* Bottom quick actions */}
                        <div className="text-xs uppercase tracking-widest text-white/50 mb-3">Quick actions</div>
                        <div className="flex items-center gap-3">
                          <a
                            href="https://wa.me/94777893221"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C2A661]/90 text-black font-semibold px-4 py-3 ring-1 ring-[#E6D090]/70 hover:bg-[#E6D090] transition-colors"
                            aria-label="WhatsApp us"
                          >
                            <FaWhatsapp className="h-5 w-5" />
                            WhatsApp
                          </a>
                          <a
                            href="tel:+94777893221"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/[0.06] text-white font-semibold px-4 py-3 ring-1 ring-white/15 hover:bg-white/10 transition-colors"
                            aria-label="Call us"
                          >
                            <PhoneIcon className="h-5 w-5" />
                            Call
                          </a>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          );
        })()}
      </nav>
    </header>
  );
};

export default Navbar;
