"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

/* ================= Theme (from the logo) =================
   gold #D4A437 · gold-light #F0C766 · gold-deep #8A6011
   royal(graphite) #4A4A52 · navy(panel) #141414 · ink #F5EFDD · bg #000000 */
const goldGrad = "bg-[linear-gradient(135deg,var(--color-gold-light)_0%,var(--color-gold)_55%,var(--color-gold-deep)_100%)]";
const container = "mx-auto w-full max-w-7xl px-5 sm:px-8";
const btnPrimary = `${goldGrad} inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-navy-deep shadow-[0_12px_30px_-10px_rgba(212,164,55,.55)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-10px_rgba(212,164,55,.75)]`;

const pic = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* ================= Data: real estate content ================= */
const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#plots", label: "Plots" },
  { href: "#process", label: "How to buy" },
  { href: "#dubai", label: "Dubai" },
  { href: "#faq", label: "FAQ" },
];

const heroSlides = [
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTymNtfSjVG8RhcQLbsygcK9icLBlB2wnWpmldAGmBWemMCrEmGQUJ7xAGx&s=10",
    label: "Residential plots",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsS3Gga6gFmgyxiHv4XkRemZ-dny-iDAPCp8-fYilE6VmVU4Ukjv52DCA&s=10",
    label: "Land near main highways",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYtGbyYTMTs_xF3nXL4J1nt4A_wLRxJkZLpnJDzp6-8jYEHg2lUVhTMu0&s=10",
    label: "Planned residential layouts",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnBfHbBqGKGN4Cngp2wPKRwZ7QvT9c55Usp3PsCNhfCdLw75_8jrAgwu0&s=10",
    label: "Dubai partner properties",
  },
];

/* Card styles — every card has a gold or blue border */
const cardGold = "rounded-3xl border border-gold/30 bg-surface shadow-[0_15px_40px_-28px_rgba(0,0,0,.55)] transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_25px_50px_-25px_rgba(212,164,55,.35)]";
const cardBlue = "rounded-3xl border border-royal/25 bg-surface shadow-[0_15px_40px_-28px_rgba(0,0,0,.55)] transition duration-300 hover:-translate-y-1.5 hover:border-royal hover:shadow-[0_25px_50px_-25px_rgba(180,180,190,.3)]";

const mission = [
  "We help families and investors buy land they can trust — plots with clear titles, proper approvals and the registry in the buyer's own name.",
  "Every property we offer is checked by our legal and finance team before it reaches you, so you see the documents, the land and the numbers before you pay.",
  "We stay with you after the sale too — for resale, leasing or your next purchase — because a good property relationship lasts for years, not one transaction.",
];

const visionPillars = [
  ["Trust", "before transactions"],
  ["Value", "before volume"],
  ["Quality", "before speed"],
  ["Transparency", "in every document"],
  ["Professionalism", "at every site visit"],
  ["Customer relationships", "for the long term"],
  ["Teamwork", "over individual success"],
  ["Leadership", "through action, not position"],
];


const leaderQuotes = [
  {
    name: "Sourav Mahajan",
    role: "MD, Business & Strategic Growth",
    quote: "The greatest success is not what we achieve alone, but how many families we help own something of their own.",
    more: "My focus is to grow United Legacy into a real estate platform people recommend to their relatives — built on honest advice and properties that hold their value.",
    tags: ["People", "Purpose", "Progress"],
  },
  {
    name: "Surender Chandel",
    role: "MD, Operations & Development",
    quote: "Real estate is not just an investment — it is ownership, security and a legacy for the next generation.",
    more: "The Army gave me discipline. Leadership gave me purpose. Business taught me scale. On every project, we think big, speak less and deliver on time.",
    tags: ["Discipline", "Leadership", "Delivery"],
  },
  {
    name: "Umesh Kapoor",
    role: "MD, Sales & Market Expansion",
    quote: "A property sale is done right only when the buyer is still happy with it years later.",
    more: "20+ years in networking and marketing and 10 years in the pharmaceutical industry. I lead our sales network with one rule: tell the customer the full picture before they buy.",
    tags: ["Connect", "Create", "Grow"],
  },
];

const leaders = [
  { name: "Sourav Mahajan", role: "MD, Business & Strategic Growth", area: "Vision & growth", icon: "chart", text: "Strategy, developer partnerships, new projects and overall company growth." },
  { name: "Surender Chandel", role: "MD, Operations & Development", area: "Operations & site work", icon: "gear", text: "Project development, site operations, plot handover, systems and processes." },
  { name: "Umesh Kapoor", role: "MD, Sales & Market Expansion", area: "Sales & customers", icon: "users", text: "Sales team, channel partners, buyer relationships and new markets." },
  { name: "Deepak Poddar", role: "Chartered Accountant", area: "Finance & compliance", icon: "doc", text: "Payments, receipts, taxation, audit and statutory compliance for every sale." },
  { name: "Khera Gund", role: "Advocate", area: "Legal & property papers", icon: "scale", text: "Title checks, agreements, NA/NOC, registry and legal risk on every plot." },
];



const whyUs = [
  { icon: "doc", title: "Verified titles", text: "Every plot is checked by our advocate for title, land records and approvals before we list it." },
  { icon: "shield", title: "Registry in your name", text: "On full payment, the sale deed is registered in your name — full legal ownership." },
  { icon: "search", title: "See before you pay", text: "Free guided site visits, or a video tour if you live abroad." },
  { icon: "wallet", title: "Transparent pricing", text: "Price per sq yd, the 2% admin charge and every other cost shared in writing upfront." },
  { icon: "refresh", title: "Support after the sale", text: "Help with resale, leasing and your next purchase from our after-sales desk." },
];



const zones = [
  { icon: "home", title: "Residential plots", tag: "Build your home", points: ["Plots for your own house", "Planned communities with parks and schools", "Suited to long-term holding"], img: pic("uli-zone-1", 900, 600) },
  { icon: "factory", title: "Industrial land", tag: "Build your business", points: ["Land near industrial zones", "For MSMEs and warehousing", "Demand from new factories"], img: pic("uli-zone-2", 900, 600) },
  { icon: "office", title: "Commercial plots", tag: "Build your income", points: ["Shops, offices and showrooms", "Close to the city centre and main roads", "Scope for rental income"], img: pic("uli-zone-3", 900, 600) },
];

const locationFactors = [
  { icon: "road", title: "Highways & expressways", text: "Good road access makes land easier to use and easier to sell" },
  { icon: "plane", title: "Airports nearby", text: "Air links bring business, travel and new residents" },
  { icon: "train", title: "Rail & metro links", text: "Easier daily travel raises demand for homes" },
  { icon: "factory", title: "Industrial corridors", text: "New factories and offices bring jobs — and housing demand" },
  { icon: "city", title: "Schools, hospitals & markets", text: "Everyday facilities turn land into a place people want to live" },
];

const landChecks = [
  "Clear title and ownership chain",
  "Latest land records checked",
  "NA / land-use conversion order verified",
  "Layout or town-planning approval",
  "Proper access road to the plot",
  "Water and power availability",
  "No pending disputes or loans on the land",
  "Correct zoning for your intended use",
];

const plots = [
  { img: pic("uli-plot-1", 800, 600), name: "Residential plot", area: "Prime residential location", size: "100 sq yd", price: "₹12,50,000", tag: "Popular" },
  { img: pic("uli-plot-2", 800, 600), name: "Premium plot", area: "Near main highway", size: "200 sq yd", price: "₹25,00,000", tag: "Largest" },
  { img: pic("uli-plot-3", 800, 600), name: "Family plot", area: "Planned residential layout", size: "125 sq yd", price: "₹15,62,500" },
  { img: pic("uli-plot-4", 800, 600), name: "Starter plot", area: "Fractional option", size: "50 sq yd", price: "₹6,50,000", tag: "Low entry" },
  { img: pic("uli-plot-5", 800, 600), name: "Compact plot", area: "Fractional option", size: "62.5 sq yd", price: "₹8,12,500" },
];



const stats = [
  ["₹6.5 lakh", "Plots start from"],
  ["100%", "Registry in the buyer's name"],
  ["India + Dubai", "Where we work"],
  ["5 leaders", "Sales, ops, legal & finance"],
];

const dubaiPoints = [
  "Buy a plot in India while living in the UAE",
  "Power of attorney and remote registration support",
  "Access to property options in Dubai",
];


/* ================= Helpers ================= */
function Photo({ src, alt, sizes, priority, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const [ok, setOk] = useState(true);
  const isExternal = src.startsWith("http"); // direct links load without next.config checks
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#1A1A1A_0%,#050505_100%)]">
      {ok && <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={isExternal} onError={() => setOk(false)} className={`object-cover ${className}`} />}
    </div>
  );
}

type From = "left" | "right" | "top" | "bottom" | "zoom";
const hiddenFrom: Record<From, string> = {
  left: "-translate-x-16 opacity-0",
  right: "translate-x-16 opacity-0",
  top: "-translate-y-12 opacity-0",
  bottom: "translate-y-12 opacity-0",
  zoom: "scale-90 opacity-0",
};

/** Slides children in from a direction when they scroll into view. */
function Reveal({ children, from = "bottom", delay = 0, className = "" }: { children: ReactNode; from?: From; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(.22,.8,.2,1)] motion-reduce:transition-none ${shown ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hiddenFrom[from]} ${className}`}
    >
      {children}
    </div>
  );
}

function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    city: <path {...p} d="M3 21h18M5 21V9l5-3v15M10 21V4l6 3v14M16 21v-9l4 2v7M7.5 12h0M7.5 15h0M13 9h0M13 12h0M13 15h0" />,
    chip: <path {...p} d="M7 7h10v10H7zM10 10h4v4h-4zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4" />,
    plane: <path {...p} d="M10.5 13.5 3 11l1.5-1.5 7.5.5 4-4.5c1-1 2.5-1.5 3-1s0 2-1 3L13.5 11.5l.5 7.5-1.5 1.5-2.5-7.5-3 3v2L5.5 20l-.5-2.5L2.5 17 4 15.5h2l3-3" />,
    road: <path {...p} d="M8 3 4 21M16 3l4 18M12 4v3M12 10v3M12 16v4" />,
    factory: <path {...p} d="M3 20V10l6 4V10l6 4V6h6v14H3zM7 17h2M12 17h2M17 17h2" />,
    office: <path {...p} d="M4 20V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v15M15 9h4a1 1 0 0 1 1 1v10M2 20h20M8 8h3M8 12h3M8 16h3" />,
    home: <path {...p} d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6" />,
    chart: <path {...p} d="M4 20h16M6 16v-4M10 16V9M14 16v-6M18 16V5" />,
    gear: <path {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 3V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 10h0a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />,
    users: <path {...p} d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8" />,
    doc: <path {...p} d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6" />,
    scale: <path {...p} d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z" />,
    shield: <path {...p} d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4" />,
    refresh: <path {...p} d="M20 11A8 8 0 0 0 5.3 7M4 4v4h4M4 13a8 8 0 0 0 14.7 4M20 20v-4h-4" />,
    clock: <path {...p} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2" />,
    coins: <path {...p} d="M9 11c3.3 0 6-1.3 6-3s-2.7-3-6-3-6 1.3-6 3 2.7 3 6 3zM3 8v4c0 1.7 2.7 3 6 3s6-1.3 6-3V8M9 15v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4c0-1.7-2.7-3-6-3" />,
    leaf: <path {...p} d="M5 21c0-9 5-15 16-16-1 11-7 16-16 16zM5 21l8-8" />,
    train: <path {...p} d="M6 3h12a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM4 11h16M8 21l2-3M16 21l-2-3M8 15h0M16 15h0" />,
    ship: <path {...p} d="M3 18c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 6 0M5 15l-1-5h16l-1 5M8 10V6h8v4M12 3v3" />,
    museum: <path {...p} d="M3 21h18M4 10h16M12 3 3 8h18zM6 10v8M10 10v8M14 10v8M18 10v8" />,
    quote: <path d="M7 7c-2.2 0-4 1.8-4 4v6h6v-6H5c0-1.1.9-2 2-2zm10 0c-2.2 0-4 1.8-4 4v6h6v-6h-4c0-1.1.9-2 2-2z" fill="currentColor" />,
    x: <path {...p} d="M6 6l12 12M18 6 6 18" />,
    pin: <path {...p} d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
    area: <path {...p} d="M4 4h16v16H4zM4 9h16M9 4v16" />,
    wallet: <path {...p} d="M3 7h18v12H3zM3 11h18M16 15h2" />,
    search: <path {...p} d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4" />,
    left: <path {...p} d="M15 5l-7 7 7 7" />,
    right: <path {...p} d="M9 5l7 7-7 7" />,
    check: <path {...p} d="M5 12.5 10 17 19 7" />,
    heart: <path {...p} d="M12 20s-7-4.4-9-8.8C1.6 8 3.8 5 7 5c2 0 3.3 1 4.1 2.2h1.8C13.7 6 15 5 17 5c3.2 0 5.4 3 4 6.2C19 15.6 12 20 12 20z" />,
    arrow: <path {...p} d="M5 12h14M13 6l6 6-6 6" />,
    plus: <path {...p} d="M12 5v14M5 12h14" />,
    globe: <path {...p} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />,
    phone: <path {...p} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
    mail: <path {...p} d="M3 6h18v12H3zM3 7l9 6 9-6" />,
  };
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">{paths[name]}</svg>;
}

function Heading({ eyebrow, title, text, center = false, light = false }: { eyebrow?: string; title: string; text?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className={`inline-flex items-center gap-2 text-sm font-semibold ${light ? "text-gold-light" : "text-gold"}`}>
          <span className={`${goldGrad} h-0.5 w-6 rounded-full`} />
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${light ? "text-ink" : "text-ink"}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-relaxed ${light ? "text-ink/70" : "text-ink/65"}`}>{text}</p>}
    </div>
  );
}


/* ================= House-shaped image frame ================= */
const blueGrad = "bg-[linear-gradient(135deg,var(--color-royal-light)_0%,var(--color-royal)_55%,var(--color-navy-deep)_100%)]";
const houseClipL = "polygon(0% 11%, 26% 11%, 38% 0%, 50% 11%, 100% 0%, 100% 100%, 0% 100%)";
const houseClipR = "polygon(0% 0%, 50% 11%, 62% 0%, 74% 11%, 100% 11%, 100% 100%, 0% 100%)";

function HouseFrame({
  src, alt, sizes, tone = "gold", flip = false, className = "", priority, children,
}: { src: string; alt: string; sizes: string; tone?: "gold" | "blue"; flip?: boolean; className?: string; priority?: boolean; children?: ReactNode }) {
  const clip = flip ? houseClipR : houseClipL;
  return (
    <div className={`group/frame relative [filter:drop-shadow(0_28px_30px_rgba(0,0,0,.55))] ${className}`}>
      <div className={`h-full w-full p-[6px] ${tone === "gold" ? goldGrad : blueGrad}`} style={{ clipPath: clip, borderRadius: 26 }}>
        <div className="relative h-full w-full overflow-hidden" style={{ clipPath: clip, borderRadius: 21 }}>
          <div className="absolute inset-0 transition duration-700 ease-out group-hover/frame:scale-110">
            <Photo src={src} alt={alt} sizes={sizes} priority={priority} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function MiniFrame({ src, tone = "blue", className = "", float = "animate-[float_6s_ease-in-out_infinite]" }: { src: string; tone?: "gold" | "blue"; className?: string; float?: string }) {
  return (
    <div className={`rounded-2xl p-[5px] shadow-xl ${tone === "gold" ? goldGrad : blueGrad} ${float} ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <Photo src={src} alt="" sizes="260px" />
      </div>
    </div>
  );
}



/* ================= Hero ================= */
const houseClip = "polygon(0% 11%, 26% 11%, 38% 0%, 50% 11%, 100% 0%, 100% 100%, 0% 100%)";

const socials = [
  { label: "Facebook", d: "M14 8h2V5h-2.5C11 5 10 6.6 10 9v2H8v3h2v6h3v-6h2.3l.7-3H13V9.3c0-.8.3-1.3 1-1.3z" },
  { label: "Instagram", d: "M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm4 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" },
  { label: "YouTube", d: "M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" },
  { label: "WhatsApp", d: "M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3zm4.4 12.6c-.2.5-1.1 1-1.6 1-.4.1-.9.1-1.5-.1a13 13 0 0 1-5.3-4.7c-.5-.7-.9-1.6-.9-2.4 0-.9.5-1.4.7-1.6.2-.2.4-.2.6-.2h.4c.2 0 .3 0 .5.4l.7 1.6c0 .2 0 .3-.1.5l-.3.4-.3.3c.4.7 1 1.4 1.6 1.9.6.5 1.2.8 1.9 1.1l.4-.5.4-.4c.2-.1.3-.1.5 0l1.5.7c.2.1.4.2.4.3v.8z" },
];

function Ring({ className }: { className: string }) {
  return <span aria-hidden className={`pointer-events-none absolute rounded-full border-gold ${className}`} />;
}

function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % heroSlides.length), 4500);
    return () => clearInterval(t);
  }, [i]);
  const next = (i + 1) % heroSlides.length;
  const next2 = (i + 2) % heroSlides.length;

  const field = "w-full appearance-none bg-transparent text-sm font-semibold text-ink outline-none";

  return (
    <section id="home" className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,#161616_0%,#000000_60%)] pb-16 pt-28 lg:pt-32">
      <span aria-hidden className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-gold-light/20 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-royal/20 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute left-[30%] top-20 hidden h-24 w-[40%] rounded-bl-[2.5rem] border-b border-l border-gold/30 lg:block" />
      <span aria-hidden className="pointer-events-none absolute bottom-40 right-[18%] hidden h-40 w-[30%] rounded-tr-[2.5rem] border-r border-t border-gold/30 lg:block" />
      <Ring className="left-[4%] top-24 hidden h-4 w-4 border-2 lg:block" />
      <Ring className="left-[31%] top-[64%] hidden h-10 w-10 border-[4px] opacity-60 animate-[float_7s_ease-in-out_infinite] xl:block" />
      <Ring className="right-[10%] top-[70%] hidden h-5 w-5 border-2 animate-[float_6s_ease-in-out_infinite] lg:block" />

      <div className={`${container} relative grid items-center gap-12 lg:grid-cols-[1fr_1.35fr_0.85fr] lg:gap-10`}>
        {/* LEFT */}
        <div className="order-1 text-center lg:text-left">
          <Reveal from="top">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold-light">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              Trusted real estate partner in India &amp; Dubai
            </span>
          </Reveal>
          <Reveal from="left" delay={150}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[2.75rem] xl:text-5xl">
              Your land,{" "}
              <span className="bg-[linear-gradient(135deg,var(--color-gold-light),var(--color-gold))] bg-clip-text text-transparent">your legacy</span>
            </h1>
          </Reveal>
          <Reveal from="left" delay={300}>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-ink/65 lg:mx-0">
              Residential, commercial and industrial plots from United Legacy Infra — clear titles, a written agreement and the registry in your name.
            </p>
          </Reveal>
          <Reveal from="bottom" delay={450}>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a href="#plots" className={btnPrimary}>See available plots <Icon name="arrow" className="h-4 w-4" /></a>
              {/* <a href="#process" className="inline-flex items-center px-2 py-3.5 text-sm font-semibold text-ink underline decoration-gold decoration-2 underline-offset-8 transition hover:text-royal-light">
                How buying works
              </a> */}
            </div>
          </Reveal>
        </div>

        {/* CENTRE */}
        <Reveal from="zoom" delay={200} className="order-2 relative mx-auto w-full max-w-xl pb-14 sm:pr-24">
          <Ring className="-top-6 left-[36%] h-7 w-7 border-[3px]" />
          <div className={`relative aspect-[4/4] ${goldGrad} p-[6px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]`} style={{ clipPath: houseClip, borderRadius: 26 }}>
            <div className="relative h-full w-full overflow-hidden" style={{ clipPath: houseClip, borderRadius: 22 }}>
              {heroSlides.map((s, n) => (
                <div key={s.img} aria-hidden={n !== i} className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${n === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
                  <Photo src={s.img} alt={s.label} sizes="(min-width:1024px) 40vw, 90vw" priority={n === 0} />
                </div>
              ))}
            </div>
          </div>

          <div className="absolute right-0 top-[14%] hidden w-[34%] sm:block">
            <button onClick={() => setI(next)} aria-label="Show next image" className="relative block aspect-[4/3.3] w-full overflow-hidden rounded-2xl border-[5px] border-royal shadow-xl transition hover:-translate-y-1 animate-[float_6s_ease-in-out_infinite]">
              <div key={next} className="absolute inset-0 animate-[fadeUp_.8s_ease-out_both]"><Photo src={heroSlides[next].img} alt="" sizes="200px" /></div>
            </button>
            <button onClick={() => setI(next2)} aria-label="Show image after next" className="relative -ml-8 mt-4 block aspect-[4/3.5] w-[118%] overflow-hidden rounded-2xl border-[5px] border-gold shadow-xl transition hover:-translate-y-1 animate-[float_7s_ease-in-out_1s_infinite]">
              <div key={next2} className="absolute inset-0 animate-[fadeUp_.8s_ease-out_both]"><Photo src={heroSlides[next2].img} alt="" sizes="260px" /></div>
            </button>
          </div>

          <div className={`${goldGrad} absolute -left-2 bottom-16 z-10 rounded-2xl px-5 py-3 text-navy-deep shadow-[0_18px_40px_-12px_rgba(212,164,55,.6)] sm:-left-8`}>
            <p className="text-sm font-medium">Plots start at</p>
            <p className="text-2xl font-extrabold sm:text-3xl">₹6,50,000</p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between sm:right-24">
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className={`${goldGrad} flex h-8 w-8 items-center justify-center rounded-full text-navy-deep transition hover:-translate-y-0.5`}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden><path d={s.d} /></svg>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {heroSlides.map((_, n) => (
                <button key={n} aria-label={`Show slide ${n + 1}`} onClick={() => setI(n)} className={`h-2 rounded-full transition-all duration-300 ${n === i ? "w-7 bg-gold" : "w-2 bg-ink/20"}`} />
              ))}
              <button onClick={() => setI(next)} aria-label="Next image" className="group ml-1 flex items-center text-ink">
                <span className="h-px w-6 bg-ink/40 transition-all group-hover:w-10" />
                <Icon name="right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* RIGHT */}
        <div className="order-3 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: "doc", v: "Clear title", l: "Documents shared before booking" },
            { icon: "shield", v: "Registry in your name", l: "Full legal ownership" },
            { icon: "search", v: "Free site visit", l: "See the land before you pay" },
          ].map((f, n) => (
            <Reveal key={f.v} from="right" delay={300 + n * 150}>
              <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-surface/80 p-4 shadow-[0_15px_35px_-25px_rgba(0,0,0,.6)] backdrop-blur transition hover:-translate-x-1 hover:border-gold/50">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-royal/10 text-royal-light"><Icon name={f.icon} className="h-6 w-6" /></span>
                <span>
                  <span className="block font-bold text-ink">{f.v}</span>
                  <span className="block text-xs text-ink/55">{f.l}</span>
                </span>
              </div>
            </Reveal>
          ))}
          <Reveal from="bottom" delay={800} className="sm:col-span-3 lg:col-span-1">
            <a href="#dubai" className="group flex items-center gap-4 rounded-2xl bg-navy p-4 text-ink shadow-xl transition hover:bg-navy-2">
              <span className={`${goldGrad} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-navy-deep`}><Icon name="globe" className="h-6 w-6" /></span>
              <span className="flex-1">
                <span className="block font-bold">NRI or living in Dubai?</span>
                <span className="block text-xs text-ink/65">Buy remotely with our Dubai desk</span>
              </span>
              <Icon name="arrow" className="h-5 w-5 text-gold-light transition group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>
      </div>

      {/* Search */}
      <Reveal from="bottom" delay={300} className={`${container} relative mt-14`}>
        <form
          onSubmit={(e: FormEvent) => { e.preventDefault(); document.getElementById("plots")?.scrollIntoView({ behavior: "smooth" }); }}
          className="mx-auto grid max-w-5xl gap-4 rounded-3xl border border-gold/20 bg-surface p-5 shadow-[0_25px_60px_-25px_rgba(0,0,0,.6)] sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-center sm:gap-0 sm:rounded-full sm:p-3 sm:pl-8"
        >
          {[
            { icon: "home", label: "Property type", opts: ["Residential plot", "Commercial plot", "Industrial land", "Dubai property"] },
            { icon: "area", label: "Plot size", opts: ["50 – 62.5 sq yd", "100 sq yd", "125 sq yd", "200 sq yd"] },
            { icon: "wallet", label: "Budget", opts: ["Under ₹10 lakh", "₹10 – 20 lakh", "₹20 – 30 lakh", "Above ₹30 lakh"] },
          ].map((f, n) => (
            <label key={f.label} className={`flex items-center gap-3 ${n > 0 ? "sm:border-l sm:border-ink/10 sm:pl-6" : ""}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-royal/10 text-royal-light"><Icon name={f.icon} className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-ink/55">{f.label}</span>
                <select className={field} defaultValue="">
                  <option value="">Any</option>
                  {f.opts.map((o) => <option key={o}>{o}</option>)}
                </select>
              </span>
            </label>
          ))}
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gold px-8 py-4 text-sm font-semibold text-navy-deep transition hover:bg-gold-light sm:rounded-full">
            <Icon name="search" className="h-4 w-4" /> Find plots
          </button>
        </form>
      </Reveal>
    </section>
  );
}

/* ================= Shared small pieces ================= */
function IconBadge({ name, tone = "blue" }: { name: string; tone?: "blue" | "gold" | "navy" }) {
  const t = {
    blue: "border-royal/30 bg-royal/10 text-royal-light group-hover:bg-royal group-hover:text-ink",
    gold: "border-gold/40 bg-gold/10 text-gold-light group-hover:bg-gold group-hover:text-navy-deep",
    navy: "border-gold/40 bg-navy text-gold-light",
  }[tone];
  return <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border transition duration-300 ${t}`}><Icon name={name} /></span>;
}

const sideFrom = (n: number, cols = 3): From => (["left", "bottom", "right", "top"] as From[])[cols === 4 ? n % 4 : n % 3];

/* ================= About ================= */
function AboutMission() {
  return (
    <section id="about" className="scroll-mt-20 bg-bg py-20 sm:py-28">
      <div className={container}>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal from="left">
            <Heading eyebrow="About United Legacy" title="A real estate company you can check, not just trust" />
            <div className="mt-6 space-y-4">
              {mission.map((m, n) => (
                <p key={n} className="border-l-2 border-gold pl-4 leading-relaxed text-ink/70">{m}</p>
              ))}
            </div>
            <p className="mt-6 text-sm font-semibold text-royal-light">Land in India and property in Dubai — handled by one accountable team.</p>
          </Reveal>
          <Reveal from="right" delay={150} className="relative sm:pr-20">
            <Ring className="-top-5 left-[40%] h-7 w-7 border-[3px]" />
            <HouseFrame src={pic("uli-mission", 1000, 900)} alt="Planned residential land" sizes="(min-width:1024px) 45vw, 100vw" tone="gold" className="aspect-[5/4.4]" />
            <Reveal from="top" delay={500} className="absolute right-0 top-[16%] hidden w-[30%] sm:block">
              <MiniFrame src={pic("uli-mission-2", 400, 340)} tone="blue" className="aspect-[4/3.4]" />
            </Reveal>
            <div className="absolute -bottom-6 -left-4 z-10 rounded-2xl border border-gold/50 bg-navy px-6 py-4 text-ink shadow-xl sm:-left-8">
              <p className="text-lg font-bold text-gold-light">Your land, your name</p>
              <p className="text-xs text-ink/70">Registered sale deed on every plot</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-24">
          <Reveal from="top"><Heading center eyebrow="What we stand for" title="How we do business" text="Eight rules every member of our team follows with every buyer." /></Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visionPillars.map(([k, v], n) => (
              <Reveal key={k} from={sideFrom(n, 4)} delay={(n % 4) * 100}>
                <div className={`group h-full p-6 ${n % 2 ? cardBlue : cardGold}`}>
                  <p className="text-xl font-bold text-ink">{k}</p>
                  <p className="mt-1 text-sm text-ink/60">{v}</p>
                  <span className={`${goldGrad} mt-4 block h-1 w-8 rounded-full transition-all duration-500 group-hover:w-16`} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



/* ================= Leadership ================= */
function Leadership() {
  const [q, setQ] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQ((n) => (n + 1) % leaderQuotes.length), 6500);
    return () => clearInterval(t);
  }, [q]);
  const L = leaderQuotes[q];
  const initials = (name: string) => name.split(" ").map((w) => w[0]).join("");

  return (
    <section className="bg-bg py-20 sm:py-28">
      <div className={container}>
        <Reveal from="left"><Heading eyebrow="Leadership" title="Five leaders covering sales, sites, legal and finance" text="Every plot we sell passes through operations, legal and accounts before it reaches you." /></Reveal>

        <Reveal from="bottom" delay={150} className="mt-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-gold/40 bg-navy p-7 text-ink sm:p-12">
            <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-royal opacity-40 blur-3xl" />
            <div key={q} className="relative grid animate-[fadeUp_.7s_ease-out_both] gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="flex items-center gap-4 lg:flex-col lg:text-center">
                <span className={`${goldGrad} flex h-20 w-20 items-center justify-center rounded-full border-4 border-ink/20 text-2xl font-extrabold text-navy-deep lg:h-28 lg:w-28 lg:text-3xl`}>{initials(L.name)}</span>
                <div>
                  <p className="text-lg font-bold">{L.name}</p>
                  <p className="text-sm text-gold-light">{L.role}</p>
                </div>
              </div>
              <div>
                <Icon name="quote" className="h-10 w-10 text-gold" />
                <p className="mt-3 text-xl font-semibold leading-relaxed sm:text-2xl">{L.quote}</p>
                <p className="mt-4 leading-relaxed text-ink/70">{L.more}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {L.tags.map((t) => <span key={t} className="rounded-full border border-gold/50 px-3 py-1 text-xs text-gold-light">{t}</span>)}
                </div>
              </div>
            </div>
            <div className="relative mt-8 flex gap-2">
              {leaderQuotes.map((l, n) => (
                <button key={l.name} onClick={() => setQ(n)} aria-label={`Show ${l.name}`} className={`h-2 rounded-full transition-all ${n === q ? `${goldGrad} w-10` : "w-2 bg-ink/25"}`} />
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {leaders.map((l, n) => (
            <Reveal key={l.name} from={(["left", "top", "bottom", "top", "right"] as From[])[n]} delay={n * 100}>
              <article className={`group h-full p-6 ${n % 2 ? cardBlue : cardGold}`}>
                <IconBadge name={l.icon} tone={n % 2 ? "blue" : "gold"} />
                <p className="mt-4 text-xs font-semibold text-gold">{l.area}</p>
                <h3 className="mt-1 text-lg font-bold text-ink">{l.name}</h3>
                <p className="text-sm font-medium text-royal-light">{l.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{l.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Why us ================= */
function WhyUs() {
  return (
    <section id="why" className="scroll-mt-20 bg-bg py-20 sm:py-28">
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="Why United Legacy Infra" title="Buy land with complete peace of mind" text="Five promises we keep with every buyer, on every plot." /></Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {whyUs.map((h, n) => (
            <Reveal key={h.title} from={(["left", "top", "bottom", "top", "right"] as From[])[n]} delay={n * 100}>
              <article className={`group h-full p-6 ${n % 2 ? cardGold : cardBlue}`}>
                <IconBadge name={h.icon} tone={n % 2 ? "gold" : "blue"} />
                <h3 className="mt-5 text-lg font-bold text-ink">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{h.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}



/* ================= Property types / master plan ================= */
function MasterPlan() {
  return (
    <section className="bg-bg py-20 sm:py-28">
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="Property types" title="Choose land for living, business or industry" text="Every plot comes with approved land use, so you know exactly what you can build on it." /></Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {zones.map((z, n) => (
            <Reveal key={z.title} from={sideFrom(n)} delay={n * 120}>
              <article className={`group h-full overflow-hidden ${n === 1 ? cardBlue : cardGold}`}>
                <div className="px-4 pt-4">
                  <HouseFrame src={z.img} alt={z.title} sizes="(min-width:1024px) 33vw, 100vw" tone={n === 1 ? "blue" : "gold"} flip={n % 2 === 1} className="aspect-[16/11]" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <IconBadge name={z.icon} tone={n === 1 ? "blue" : "gold"} />
                    <div>
                      <h3 className="text-xl font-bold text-ink">{z.title}</h3>
                      <p className="text-xs font-medium text-gold">{z.tag}</p>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {z.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-ink/70"><Icon name="check" className="h-4 w-4 text-royal-light" />{p}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ================= Connectivity ================= */
function Connectivity() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 sm:py-28">
      <span aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-royal opacity-40 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gold opacity-15 blur-3xl" />
      <div className={`${container} relative`}>
        <Reveal from="top"><Heading light center eyebrow="Location & connectivity" title="Location decides land value" text="We shortlist land close to the things that drive demand — roads, transport, jobs and daily facilities." /></Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {locationFactors.map((c, n) => (
            <Reveal key={c.title} from={(["left", "bottom", "top", "bottom", "right"] as From[])[n]} delay={n * 100}>
              <article className="group h-full rounded-3xl border border-gold/30 bg-white/[.04] p-6 text-ink transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:bg-white/[.08]">
                <IconBadge name={c.icon} tone="navy" />
                <h3 className="mt-5 font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-ink/65">{c.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Land checks ================= */
function LandChecks() {
  return (
    <section className="bg-bg-alt py-20 sm:py-28">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
        <Reveal from="left" className="relative sm:pl-20">
          <Ring className="-top-5 right-[40%] h-7 w-7 border-[3px]" />
          <HouseFrame src={pic("uli-infra", 1000, 900)} alt="Land being checked by our team" sizes="(min-width:1024px) 45vw, 100vw" tone="blue" flip className="aspect-[5/4.4]" />
          <Reveal from="bottom" delay={500} className="absolute left-0 top-[18%] hidden w-[30%] sm:block">
            <MiniFrame src={pic("uli-infra-2", 400, 340)} tone="gold" className="aspect-[4/3.4]" float="animate-[float_7s_ease-in-out_1s_infinite]" />
          </Reveal>
          <div className={`${goldGrad} absolute -bottom-6 right-6 z-10 rounded-2xl border border-navy-deep/20 px-6 py-4 text-navy-deep shadow-xl`}>
            <p className="text-2xl font-extrabold">8-point check</p>
            <p className="text-xs font-semibold">Done before every plot is listed</p>
          </div>
        </Reveal>
        <Reveal from="right" delay={150}>
          <Heading eyebrow="Before we list a plot" title="Our land verification checklist" text="Our legal and operations team checks every plot on these points. You get copies of the documents before booking." />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {landChecks.map((t, n) => (
              <li key={t} className={`flex items-start gap-3 rounded-xl border bg-surface p-3 text-sm font-medium text-ink ${n % 2 ? "border-royal/25" : "border-gold/30"}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-gold-light"><Icon name="check" className="h-3.5 w-3.5" /></span>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}







/* ================= Plot carousel ================= */
function usePerView() {
  const [pv, setPv] = useState(3);
  useEffect(() => {
    const on = () => setPv(window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return pv;
}

function PlotCarousel() {
  const perView = usePerView();
  const maxIndex = Math.max(0, plots.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = useCallback((n: number) => setIndex(n < 0 ? maxIndex : n > maxIndex ? 0 : n), [maxIndex]);

  useEffect(() => { if (index > maxIndex) setIndex(maxIndex); }, [index, maxIndex]);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(index + 1), 4000);
    return () => clearInterval(t);
  }, [index, paused, go]);

  return (
    <section id="plots" className="scroll-mt-20 bg-bg py-20 sm:py-28">
      <div className={container}>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal from="left"><Heading eyebrow="Available plots" title="Plots for sale" text="Full plots at ₹12,500 per sq yd and fractional options at ₹13,000 per sq yd. Every plot comes with documents you can check before booking." /></Reveal>
          <Reveal from="right" className="flex gap-3">
            <button aria-label="Previous plots" onClick={() => go(index - 1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-navy hover:text-ink"><Icon name="left" className="h-5 w-5" /></button>
            <button aria-label="Next plots" onClick={() => go(index + 1)} className={`${goldGrad} flex h-12 w-12 items-center justify-center rounded-full text-navy-deep transition hover:brightness-105`}><Icon name="right" className="h-5 w-5" /></button>
          </Reveal>
        </div>

        <Reveal from="bottom" delay={150}>
          <div
            className="-mx-3 mt-12 overflow-hidden py-4"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true); }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
              touchX.current = null;
              setPaused(false);
            }}
          >
            <div className="flex transition-transform duration-700 ease-[cubic-bezier(.22,.8,.2,1)]" style={{ transform: `translateX(-${(index * 100) / perView}%)` }}>
              {plots.map((p, pn) => (
                <div key={p.name} className="shrink-0 px-3" style={{ width: `${100 / perView}%` }}>
                  <article className={`group overflow-hidden rounded-3xl border bg-surface ${pn % 2 ? "border-royal/30 hover:border-royal" : "border-gold/30 hover:border-gold"} shadow-[0_20px_45px_-28px_rgba(0,0,0,.55)] transition duration-300 hover:-translate-y-1.5`}>
                    <div className="px-4 pt-4">
                      <HouseFrame src={p.img} alt={p.name} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" tone={pn % 2 ? "blue" : "gold"} flip={pn % 2 === 1} className="aspect-[4/3.2]">
                        {p.tag && <span className="absolute bottom-3 left-3 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink shadow">{p.tag}</span>}
                        <button aria-label={`Save ${p.name}`} className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-ink transition hover:text-rose-400">
                          <Icon name="heart" className="h-4 w-4" />
                        </button>
                      </HouseFrame>
                    </div>
                    <div className="p-6">
                      <p className="flex items-center gap-1.5 text-xs text-ink/55"><Icon name="pin" className="h-3.5 w-3.5" />{p.area}</p>
                      <h3 className="mt-2 text-lg font-bold text-ink">{p.name}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/65">
                        <span className="flex items-center gap-1.5"><Icon name="area" className="h-4 w-4 text-gold" />{p.size}</span>
                        <span className="flex items-center gap-1.5"><Icon name="doc" className="h-4 w-4 text-gold" />Registry in your name</span>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                        <p className="text-xl font-extrabold text-ink">{p.price}</p>
                        <a href="#contact" className="text-sm font-semibold text-royal-light hover:underline">Book site visit</a>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, n) => (
            <button key={n} aria-label={`Go to slide ${n + 1}`} onClick={() => go(n)} className={`h-2 rounded-full transition-all duration-300 ${n === index ? `${goldGrad} w-8` : "w-2 bg-ink/15"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Stats band ================= */
function StatsBand() {
  return (
    <section className="relative overflow-hidden border-y-2 border-gold/40 bg-navy py-16">
      <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-royal opacity-45 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-gold opacity-15 blur-3xl" />
      <dl className={`${container} relative grid grid-cols-2 gap-8 text-center md:grid-cols-4`}>
        {stats.map(([v, l], n) => (
          <Reveal key={l} from={n % 2 ? "top" : "bottom"} delay={n * 100} className="flex flex-col-reverse">
            <dt className="mt-1 text-sm text-ink/65">{l}</dt>
            <dd className="text-2xl font-extrabold text-gold-light sm:text-4xl">{v}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}

/* ================= Dubai ================= */
function Dubai() {
  const imgs = [pic("uli-dubai-1", 900, 1100), pic("uli-dubai-2", 900, 1100), pic("uli-dubai-3", 900, 1100)];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % imgs.length), 3500);
    return () => clearInterval(t);
  }, [imgs.length]);

  return (
    <section id="dubai" className="scroll-mt-20 bg-bg py-20 sm:py-28">
      <div className={`${container} grid items-center gap-14 lg:grid-cols-2`}>
        <Reveal from="left">
          <Heading eyebrow="For NRIs and UAE residents" title="Buy Indian land from Dubai" text="Living in the UAE? Buy a plot in India without flying back for every step, or explore property options in Dubai — one team handles both." />
          <ul className="mt-8 space-y-4">
            {dubaiPoints.map((t) => (
              <li key={t} className="flex items-center gap-3 text-ink">
                <span className={`${goldGrad} flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-navy-deep`}><Icon name="check" className="h-4 w-4" /></span>
                <span className="font-medium">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className={btnPrimary}>Talk to our Dubai desk</a>
          </div>
        </Reveal>

        <Reveal from="right" delay={150} className="relative mx-auto h-[420px] w-full max-w-md sm:h-[480px]">
          {imgs.map((src, n) => {
            const pos = (n - i + imgs.length) % imgs.length;
            const styles = [
              "z-30 translate-x-0 rotate-0 scale-100 opacity-100",
              "z-20 translate-x-10 rotate-6 scale-95 opacity-90",
              "z-10 -translate-x-10 -rotate-6 scale-90 opacity-80",
            ];
            return (
              <div key={src} className={`absolute inset-x-6 inset-y-0 transition-all duration-700 ease-[cubic-bezier(.22,.8,.2,1)] ${styles[pos]}`}>
                <HouseFrame src={src} alt={pos === 0 ? "Dubai skyline" : ""} sizes="(min-width:1024px) 40vw, 90vw" tone={n % 2 ? "blue" : "gold"} flip={n === 1} className="h-full" />
              </div>
            );
          })}
          <div className="absolute -bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-gold/50 bg-surface px-5 py-2.5 text-sm font-semibold text-ink shadow-lg">
            <Icon name="globe" className="h-4 w-4 text-gold" /> India and Dubai
          </div>
        </Reveal>
      </div>
    </section>
  );
}






/* ================= Page ================= */
export default function Page() {
  return (
    <div className={`${font.className} min-h-screen overflow-x-hidden bg-bg text-ink antialiased`}>
      <style>{`
        @keyframes navIn { from { transform: translateY(-100%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        html { scroll-behavior: smooth; }
        body { background: #000000; color: #F5EFDD; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
      `}</style>
    
      <main>
        <Hero />
        <AboutMission />
        <MasterPlan />
        <WhyUs />
        <PlotCarousel />
        <LandChecks />
        <Connectivity />
       <Dubai />
        <Leadership />
        <StatsBand />
        
       
      </main>
      
    </div>
  );
}