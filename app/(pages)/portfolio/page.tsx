"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { IconType } from "react-icons";
import {
  FaHouse, FaLayerGroup, FaRulerCombined, FaIndianRupeeSign, FaSackDollar, FaChartLine, FaCalculator,
  FaCircleCheck, FaArrowRight, FaFileSignature, FaHandshake, FaCalendarDays, FaPercent, FaWallet,
  FaCoins, FaFire, FaGem, FaSeedling, FaHandPointer, FaCircleInfo,
  FaHouseChimney, FaIndustry, FaBuilding, FaMicrochip, FaPlaneDeparture, FaCity, FaEarthAsia, FaLeaf,
  FaArrowTrendUp, FaBullseye, FaUsers, FaGear, FaChartColumn,
} from "react-icons/fa6";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

/* ================= Theme (same as homepage) =================
   gold #D4A12A · gold-light #F5D06B · gold-deep #A87A12
   royal #1E4BB8 · navy #0B1D45 · ink #0F172A · soft #F7F9FD */
const goldGrad = "bg-[linear-gradient(135deg,var(--color-gold-light)_0%,var(--color-gold)_55%,var(--color-gold-deep)_100%)]";
const accentGrad = "bg-[linear-gradient(135deg,var(--color-accent-light)_0%,var(--color-accent)_55%,var(--color-accent-deep)_100%)]";
const goldText = "bg-[linear-gradient(135deg,var(--color-gold-light),var(--color-gold)_60%,var(--color-gold-deep))] bg-clip-text text-transparent";
const container = "mx-auto w-full max-w-7xl px-5 sm:px-8";
const btnPrimary = `${goldGrad} inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-on-gold shadow-[0_12px_30px_-10px_color-mix(in_srgb,var(--color-gold)_80%,transparent)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-10px_color-mix(in_srgb,var(--color-gold)_90%,transparent)]`;
const btnGhost = "inline-flex items-center justify-center gap-2 rounded-full border border-fg/15 bg-surface px-7 py-3.5 text-sm font-semibold text-fg transition hover:border-accent-light hover:text-accent-light";
const cardGold = "rounded-3xl border border-gold/40 bg-surface shadow-[0_15px_40px_-28px_rgba(0,0,0,.45)] transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_25px_50px_-25px_color-mix(in_srgb,var(--color-gold)_55%,transparent)]";
const cardAccent = "rounded-3xl border border-accent-light/25 bg-surface shadow-[0_15px_40px_-28px_rgba(0,0,0,.45)] transition duration-300 hover:-translate-y-1.5 hover:border-accent-light hover:shadow-[0_25px_50px_-25px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]";

/* Dummy images — replace with your own photos later */
const pic = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

/** Set to false to hide the monthly return / total return columns and calculator figures. */
const SHOW_RETURNS = true;
const PLAN_MONTHS = 25;
const ADMIN_RATE = 0.02;

/* ================= Data (from the presentation) ================= */

const heroSlides = [
  { img: pic("ulp-hero-1", 1920, 1080), tag: "Land builds legacies", title: "Invest in a planned smart city", text: "Registered plots with clear titles, in a city planned for people, industry and business." },
  { img: pic("ulp-hero-2", 1920, 1080), tag: "25-month plan", title: "Plots from ₹6,50,000", text: "Full plots at ₹12,500 per sq yd and fractional options at ₹13,000 per sq yd." },
  { img: pic("ulp-hero-3", 1920, 1080), tag: "Plug and play", title: "Infrastructure ready before you build", text: "Underground utilities, smart meters and 24×7 power, planned from day one." },
  { img: pic("ulp-hero-4", 1920, 1080), tag: "360° connectivity", title: "Air, road, rail and sea — all connected", text: "International airport, 250 m expressway, freight corridor, metro and sea port." },
];

type Plot = { size: string; rate: number; total: number; monthly: number; tag?: "Popular" | "Best value" | "Low entry" };
const fullPlots: Plot[] = [
  { size: "100 sq yd", rate: 12500, total: 1250000, monthly: 24500, tag: "Popular" },
  { size: "125 sq yd", rate: 12500, total: 1562500, monthly: 30625 },
  { size: "200 sq yd", rate: 12500, total: 2500000, monthly: 49000, tag: "Best value" },
];
const fractionalPlots: Plot[] = [
  { size: "50 sq yd", rate: 13000, total: 650000, monthly: 12740, tag: "Low entry" },
  { size: "62.5 sq yd", rate: 13000, total: 812500, monthly: 15925 },
];
const allPlots = [...fullPlots, ...fractionalPlots];

const tickerItems = ["Land builds legacies", "Invest today for a brighter tomorrow", "Prime land, timeless value", "A stronger tomorrow begins here", "Opportunities grow generations", "Smart, sustainable, connected"];

const missedCities = [
  { city: "Chandigarh & Mohali", then: "A growing city", now: "A premium destination", img: pic("ulp-city-1", 400, 300) },
  { city: "Noida", then: "An upcoming hub", now: "A real estate hotspot", img: pic("ulp-city-2", 400, 300) },
  { city: "Gurgaon", then: "Just another town", now: "A global business hub", img: pic("ulp-city-3", 400, 300) },
  { city: "Bangalore", then: "An emerging IT city", now: "A global innovation hub", img: pic("ulp-city-4", 400, 300) },
];

const landUse: [string, string, string][] = [
  ["R", "#F4D03F", "Residential"], ["H", "#F39C12", "High access corridor"], ["C", "#1E4BB8", "City centre"], ["I", "#8E44AD", "Industrial"],
  ["L", "#2D2D2D", "Logistics"], ["K", "#EC7FB6", "Knowledge and IT"], ["S", "#C5E03A", "Recreation and sports"], ["E", "#27AE60", "Entertainment"],
  ["O", "#BDC3C7", "Roads"], ["T", "#7F8C8D", "Strategic infrastructure"], ["U", "#1E7D3A", "Tourism and resorts"], ["G", "#A9DF6B", "Green space"],
  ["V", "#76D7B6", "Village buffer"], ["X", "#F1948A", "Existing village settlements"], ["A", "#58B947", "Agriculture"], ["P", "#E74C3C", "Public facility zone"],
  ["W", "#5DADE2", "Rivers, canals and water bodies"], ["Z", "#F5B7B1", "Solar energy park"], ["Q", "#D6EAF8", "Land under CRZ I"],
];
const zoneColor = Object.fromEntries(landUse.map(([k, c]) => [k, c]));

/* Illustrative zoning mosaic, 14 columns */
const mapRows = [
  "....IIKK......",
  "...IIIRKZZ....",
  "..GITRRRKZZQQ.",
  ".GGRRHCHRRWQQQ",
  "AGRRIHCHIIRWQQ",
  "AGRIIHLHIIRWQQ",
  "AGRRIICIIPRWQQ",
  ".GSRRHHHRRSWQ.",
  ".GASRRKRPSEWQ.",
  "..AXGSSEEGWQ..",
  "...AVGGUUWW...",
  ".....AOU......",
];

const infraFeatures = [
  { icon: "tree", title: "Green streets", text: "Cycle tracks, footpaths, trees and plants along every road." },
  { icon: "drop", title: "Smart water", text: "Water management with smart meters and SCADA monitoring." },
  { icon: "bolt", title: "24×7 power", text: "Uninterrupted power supply with smart meters and SCADA." },
  { icon: "wifi", title: "ICT-enabled city", text: "City-wide Wi-Fi and integrated city management." },
  { icon: "home", title: "100% waste collection", text: "Full domestic waste and industrial effluent collection." },
  { icon: "refresh", title: "Water recycling", text: "100% recycling and reuse of waste water." },
  { icon: "cloud", title: "Rainwater harvesting", text: "Open storm canals with recreational spaces alongside." },
  { icon: "trash", title: "Waste to energy", text: "Maximum recycling, bio-methanation and waste-to-energy." },
];

const connectivity = [
  { icon: "plane", title: "International airport", sub: "Cargo and passenger", tagline: "Faster business. Bigger opportunities.", img: pic("ulp-air", 1100, 900) },
  { icon: "train", title: "Dedicated Freight Corridor", sub: "Seamless logistics", tagline: "Stronger supply chains. A stronger India.", img: pic("ulp-rail", 1100, 900) },
  { icon: "road", title: "250 m expressway", sub: "High-speed growth", tagline: "Shorter distances. Greater opportunities.", img: pic("ulp-road-2", 1100, 900) },
  { icon: "metro", title: "Mono rail & metro", sub: "People on the move", tagline: "Fast, convenient, connected communities.", img: pic("ulp-metro", 1100, 900) },
  { icon: "ship", title: "Sea port", sub: "Global trade access", tagline: "A gateway to global markets.", img: pic("ulp-port", 1100, 900) },
];

const gallery = Array.from({ length: 8 }, (_, n) => pic(`ulp-gallery-${n + 1}`, 700, 500));
const gallery2 = Array.from({ length: 8 }, (_, n) => pic(`ulp-gallery-b${n + 1}`, 700, 500));

/* ================= Helpers ================= */
function Photo({ src, alt, sizes, priority, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-surface)_0%,var(--color-surface-2)_100%)]">
      {ok && <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={src.startsWith("http")} onError={() => setOk(false)} className={`object-cover ${className}`} />}
    </div>
  );
}

function useInView<T extends Element>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, shown] as const;
}

type From = "left" | "right" | "top" | "bottom" | "zoom";
const hiddenFrom: Record<From, string> = {
  left: "-translate-x-20 opacity-0",
  right: "translate-x-20 opacity-0",
  top: "-translate-y-16 opacity-0",
  bottom: "translate-y-16 opacity-0",
  zoom: "scale-[.85] opacity-0",
};
const sideFrom = (n: number): From => (["left", "top", "bottom", "right"] as From[])[n % 4];

/** Slides children in (left→right, right→left, top→bottom, bottom→top or zoom) when scrolled into view. */
function Reveal({ children, from = "bottom", delay = 0, className = "" }: { children: ReactNode; from?: From; delay?: number; className?: string }) {
  const [ref, shown] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(.22,.8,.2,1)] motion-reduce:transition-none ${shown ? "translate-x-0 translate-y-0 scale-100 opacity-100" : hiddenFrom[from]} ${className}`}
    >
      {children}
    </div>
  );
}

/** Counts up to a number when visible, and animates between values when it changes. */
function CountUp({ value, format = (n: number) => Math.round(n).toLocaleString("en-IN") }: { value: number; format?: (n: number) => string }) {
  const [ref, shown] = useInView<HTMLSpanElement>(0.3);
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!shown) return;
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1000);
      const cur = a + (value - a) * (1 - Math.pow(1 - p, 3));
      from.current = cur;
      setV(cur);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, shown]);
  return <span ref={ref}>{format(v)}</span>;
}

function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    plane: <path {...p} d="M10.5 13.5 3 11l1.5-1.5 7.5.5 4-4.5c1-1 2.5-1.5 3-1s0 2-1 3L13.5 11.5l.5 7.5-1.5 1.5-2.5-7.5-3 3v2L5.5 20l-.5-2.5L2.5 17 4 15.5h2l3-3" />,
    train: <path {...p} d="M6 3h12a2 2 0 0 1 2 2v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM4 11h16M8 21l2-3M16 21l-2-3M8 15h0M16 15h0" />,
    metro: <path {...p} d="M7 3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM4 9h16M9 13h0M15 13h0M8 20l2-3M16 20l-2-3M2 21h20" />,
    road: <path {...p} d="M8 3 4 21M16 3l4 18M12 4v3M12 10v3M12 16v4" />,
    ship: <path {...p} d="M3 18c2 2 4 2 6 0 2 2 4 2 6 0 2 2 4 2 6 0M5 15l-1-5h16l-1 5M8 10V6h8v4M12 3v3" />,
    city: <path {...p} d="M3 21h18M5 21V9l5-3v15M10 21V4l6 3v14M16 21v-9l4 2v7" />,
    home: <path {...p} d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6" />,
    chart: <path {...p} d="M4 20h16M6 16v-4M10 16V9M14 16v-6M18 16V5" />,
    gear: <path {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />,
    users: <path {...p} d="M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-2a4 4 0 0 0-3-3.9M16 2.1a4 4 0 0 1 0 7.8" />,
    globe: <path {...p} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />,
    leaf: <path {...p} d="M5 21c0-9 5-15 16-16-1 11-7 16-16 16zM5 21l8-8" />,
    tree: <path {...p} d="M12 22v-6M12 16a5 5 0 0 0 5-5 5 5 0 0 0-2-4 4 4 0 0 0-6 0 5 5 0 0 0-2 4 5 5 0 0 0 5 5z" />,
    drop: <path {...p} d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z" />,
    bolt: <path {...p} d="M13 2 4 14h7l-1 8 9-12h-7z" />,
    wifi: <path {...p} d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 19.5h0" />,
    refresh: <path {...p} d="M20 11A8 8 0 0 0 5.3 7M4 4v4h4M4 13a8 8 0 0 0 14.7 4M20 20v-4h-4" />,
    cloud: <path {...p} d="M7 16a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 7a4 4 0 0 1 0 9zM8 19l-1 2M12 19l-1 2M16 19l-1 2" />,
    trash: <path {...p} d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
    check: <path {...p} d="M5 12.5 10 17 19 7" />,
    arrow: <path {...p} d="M5 12h14M13 6l6 6-6 6" />,
    up: <path {...p} d="M12 20V5M6 11l6-6 6 6" />,
    left: <path {...p} d="M15 5l-7 7 7 7" />,
    right: <path {...p} d="M9 5l7 7-7 7" />,
    phone: <path {...p} d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
    star: <path d="M12 2l2.9 6.9L22 9.8l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.4L2 9.8l7.1-.9z" fill="currentColor" />,
    compass: <path {...p} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z" />,
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
          {center && <span className={`${goldGrad} h-0.5 w-6 rounded-full`} />}
        </p>
      )}
      <h2 className={`mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.6rem] ${light ? "text-white" : "text-fg"}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-fg/65"}`}>{text}</p>}
    </div>
  );
}


function Ring({ className }: { className: string }) {
  return <span aria-hidden className={`pointer-events-none absolute rounded-full border-gold ${className}`} />;
}


/* ================= Hero carousel ================= */
function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const len = heroSlides.length;
  const go = (n: number) => setI(((n % len) + len) % len);
  const s = heroSlides[i];

  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] overflow-hidden bg-page"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
    >
      {/* slides with Ken Burns zoom */}
      {heroSlides.map((sl, n) => (
        <div key={sl.img} aria-hidden={n !== i} className={`absolute inset-0 -z-20 transition-opacity duration-[1400ms] ${n === i ? "opacity-100" : "opacity-0"}`}>
          <div key={n === i ? `on-${i}` : "off"} className={`absolute inset-0 ${n === i ? "animate-[kenburns_9s_ease-out_both]" : ""}`}>
            <Photo src={sl.img} alt={sl.title} sizes="100vw" priority={n === 0} />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-page)_98%,transparent)_0%,color-mix(in_srgb,var(--color-page)_88%,transparent)_42%,color-mix(in_srgb,var(--color-page)_15%,transparent)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-page to-transparent" />
      <Ring className="-right-24 top-24 hidden h-96 w-96 border border-dashed opacity-40 animate-[spin_40s_linear_infinite] lg:block" />
      <Ring className="right-[38%] top-[22%] hidden h-6 w-6 border-2 animate-[float_6s_ease-in-out_infinite] lg:block" />
      <span aria-hidden className="pointer-events-none absolute -left-32 bottom-10 -z-10 h-96 w-96 rounded-full bg-gold-light opacity-30 blur-3xl" />

      <div className={`${container} grid min-h-[100svh] items-center gap-10 pb-36 pt-28 lg:grid-cols-[1.25fr_0.75fr]`}>
        {/* text — re-animates on every slide */}
        <div key={i} className="max-w-2xl">
          <span className="inline-flex animate-[slideL_.8s_ease-out_both] items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            {s.tag}
          </span>
          <h1 className="mt-6 animate-[slideL_.9s_ease-out_both] text-4xl font-extrabold leading-[1.08] tracking-tight text-fg [animation-delay:120ms] sm:text-6xl">
            {s.title}
          </h1>
          <p className="mt-6 max-w-lg animate-[slideL_.9s_ease-out_both] text-lg leading-relaxed text-fg/70 [animation-delay:240ms]">{s.text}</p>
          <div className="mt-9 flex animate-[fadeUp_.9s_ease-out_both] flex-wrap gap-3 [animation-delay:380ms]">
            <a href="#portfolio" className={btnPrimary}>View plots & plan <Icon name="arrow" className="h-4 w-4" /></a>
            <Link href="/home#contact" className={btnGhost}>Book a site visit</Link>
          </div>
        </div>

        {/* thumbnails */}
        <div className="hidden flex-col gap-3 lg:flex">
          {heroSlides.map((sl, n) => (
            <Reveal key={sl.img} from="right" delay={200 + n * 120}>
              <button
                onClick={() => go(n)}
                aria-label={`Show slide: ${sl.title}`}
                className={`group flex w-full items-center gap-4 rounded-2xl border p-2.5 text-left backdrop-blur transition duration-500 ${n === i ? "-translate-x-4 border-gold bg-surface shadow-xl" : "border-fg/10 bg-surface/80 hover:border-accent-light/40"}`}
              >
                <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Photo src={sl.img} alt="" sizes="96px" className="transition duration-500 group-hover:scale-110" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-gold">{sl.tag}</span>
                  <span className="block truncate text-sm font-bold text-fg">{sl.title}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* progress + arrows */}
      <div className={`${container} absolute inset-x-0 bottom-10 flex items-end gap-6`}>
        <div className="flex flex-1 gap-3">
          {heroSlides.map((sl, n) => (
            <button key={sl.img} onClick={() => go(n)} aria-label={`Go to slide ${n + 1}`} className="flex-1 text-left">
              <span className={`block text-xs font-bold transition ${n === i ? "text-gold" : "text-fg/35"}`}>{String(n + 1).padStart(2, "0")}</span>
              <span className="mt-2 block h-1 overflow-hidden rounded-full bg-fg/10">
                {n < i && <span className={`block h-full w-full ${goldGrad}`} />}
                {n === i && (
                  <span
                    key={`p-${i}`}
                    onAnimationEnd={() => go(i + 1)}
                    style={{ animationPlayState: paused ? "paused" : "running" }}
                    className={`block h-full ${goldGrad} animate-[progress_6s_linear_forwards]`}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => go(i - 1)} aria-label="Previous slide" className="flex h-12 w-12 items-center justify-center rounded-full border border-fg/20 bg-surface text-fg transition hover:bg-surface-2 hover:text-white"><Icon name="left" className="h-5 w-5" /></button>
          <button onClick={() => go(i + 1)} aria-label="Next slide" className={`${goldGrad} flex h-12 w-12 items-center justify-center rounded-full text-on-gold transition hover:scale-105`}><Icon name="right" className="h-5 w-5" /></button>
        </div>
      </div>
    </section>
  );
}

/* ================= Crossed ticker tapes ================= */
function Ticker() {
  const row = [...tickerItems, ...tickerItems];
  const Tape = ({ reverse, className }: { reverse?: boolean; className: string }) => (
    <div className={`absolute inset-x-[-5%] overflow-hidden py-3.5 shadow-xl ${className}`}>
      <div className={`flex w-max gap-10 ${reverse ? "animate-[marqueeRev_40s_linear_infinite]" : "animate-[marquee_40s_linear_infinite]"}`}>
        {[...row, ...row].map((t, n) => (
          <span key={n} className="flex items-center gap-10 whitespace-nowrap text-sm font-bold sm:text-base">
            {t}<Icon name="star" className="h-3.5 w-3.5" />
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <div aria-hidden className="relative h-32 overflow-hidden bg-surface">
      <Tape reverse className="top-8 rotate-[2deg] bg-surface-2 text-gold-light" />
      <Tape className={`top-9 -rotate-[2deg] ${goldGrad} text-on-gold`} />
    </div>
  );
}

/* ================= Product portfolio + calculator ================= */
const tagStyle: Record<NonNullable<Plot["tag"]>, { icon: IconType; cls: string }> = {
  Popular: { icon: FaFire, cls: "bg-rose-500/15 text-rose-300 border-rose-400/30" },
  "Best value": { icon: FaGem, cls: "bg-accent/15 text-accent-light border-accent-light/25" },
  "Low entry": { icon: FaSeedling, cls: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" },
};

const portfolioStats: { icon: IconType; value: string; label: string }[] = [
  { icon: FaIndianRupeeSign, value: "₹6.5 lakh", label: "Plots start from" },
  { icon: FaRulerCombined, value: "5 sizes", label: "50 to 200 sq yd" },
  { icon: FaCalendarDays, value: `${PLAN_MONTHS} months`, label: "Plan duration" },
  { icon: FaPercent, value: "2%", label: "Admin charge" },
];

const assurances: { icon: IconType; title: string; text: string }[] = [
  { icon: FaFileSignature, title: "Registry in your name", text: "Sale deed registered to you on full payment." },
  { icon: FaHandshake, title: "Written agreement", text: "Price, schedule and plan terms signed upfront." },
  { icon: FaCalendarDays, title: `${PLAN_MONTHS}-month plan`, text: "Clear timeline for every payment and payout." },
];

function Portfolio() {
  const [tab, setTab] = useState<"full" | "fractional">("full");
  const [sel, setSel] = useState<Plot>(fullPlots[0]);
  const [hm, setHm] = useState<number | null>(null);
  const rows = tab === "full" ? fullPlots : fractionalPlots;
  const admin = sel.total * ADMIN_RATE;

  const heads: { icon: IconType; label: string }[] = [
    { icon: FaRulerCombined, label: "Plot size" },
    { icon: FaIndianRupeeSign, label: "Price / sq yd" },
    { icon: FaWallet, label: "Total amount" },
    ...(SHOW_RETURNS ? [{ icon: FaCoins, label: "Return / month" }, { icon: FaChartLine, label: `Total in ${PLAN_MONTHS} months` }] : []),
  ];

  const calcRows: { icon: IconType; label: string; value: number; strong?: boolean }[] = [
    { icon: FaRulerCombined, label: `Plot price (${sel.size} × ${inr(sel.rate)})`, value: sel.total },
    { icon: FaPercent, label: "Admin charge (2%)", value: admin },
    { icon: FaWallet, label: "Amount payable", value: sel.total + admin, strong: true },
  ];

  return (
    <section id="portfolio" className="relative scroll-mt-20 overflow-hidden bg-page-2 py-14 sm:py-20 lg:py-28">
      <div className="absolute inset-0 opacity-10"><Photo src={pic("ulp-skyline", 1920, 1100)} alt="" sizes="100vw" /></div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-page-2)_0%,color-mix(in_srgb,var(--color-page-2)_85%,transparent)_40%,var(--color-page-2)_100%)]" />
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-40 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-gold opacity-20 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-accent opacity-10 blur-3xl" />

      <div className={`${container} relative`}>
        <Reveal from="top">
          <div className="text-center px-2">
            <p className="text-sm sm:text-lg font-semibold tracking-[0.25em] sm:tracking-[0.3em] text-fg/70">OUR</p>
            <h2 className={`text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl ${goldText}`}>Product portfolio</h2>
            <p className="mt-3 text-sm sm:text-base text-fg/65">Land investment options with a {PLAN_MONTHS}-month plan</p>
          </div>
        </Reveal>

        {/* quick stats */}
        <div className="mx-auto mt-8 sm:mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {portfolioStats.map((st, n) => {
            const I = st.icon;
            return (
              <Reveal key={st.label} from={sideFrom(n)} delay={n * 100}>
                <div className="group flex h-full items-center gap-2.5 sm:gap-3 rounded-2xl border border-gold/30 bg-surface/90 p-3 sm:p-3.5 shadow-[0_12px_30px_-22px_rgba(0,0,0,.5)] backdrop-blur transition hover:-translate-y-1 hover:border-gold">
                  <span className={`${n % 2 ? accentGrad + " text-white" : goldGrad + " text-on-gold"} flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl transition duration-500 group-hover:rotate-[10deg]`}><I className="h-4 w-4 sm:h-5 sm:w-5" /></span>
                  <span className="min-w-0">
                    <span className="block text-sm sm:text-base font-extrabold text-fg truncate">{st.value}</span>
                    <span className="block text-[10px] sm:text-xs text-fg/55 truncate">{st.label}</span>
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* tabs */}
        <Reveal from="bottom" delay={150} className="mt-8 sm:mt-10 flex justify-center px-2">
          <div className="relative grid w-full max-w-xs grid-cols-2 rounded-full border border-gold/50 bg-surface p-1.5 shadow-md sm:w-auto sm:max-w-none">
            <span aria-hidden className={`${goldGrad} absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-full shadow-lg transition-transform duration-500 ease-[cubic-bezier(.22,.8,.2,1)] ${tab === "fractional" ? "translate-x-full" : ""}`} />
            {(["full", "fractional"] as const).map((t) => {
              const I = t === "full" ? FaHouse : FaLayerGroup;
              return (
                <button
                  key={t}
                  onClick={() => { setTab(t); setSel(t === "full" ? fullPlots[0] : fractionalPlots[0]); }}
                  aria-pressed={tab === t}
                  className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 rounded-full px-3 py-2.5 text-xs sm:text-sm font-bold transition sm:px-8 ${tab === t ? "text-fg" : "text-fg/60 hover:text-fg"}`}
                >
                  <I className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{t === "full" ? "Full plots" : "Fractional"}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-8 sm:mt-10 grid gap-6 sm:gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            {/* ---------- MOBILE: card list (below sm) ---------- */}
            <Reveal from="left" delay={200}>
              <div className="space-y-3 sm:hidden">
                {rows.map((r, n) => {
                  const active = sel.size === r.size;
                  const T = r.tag ? tagStyle[r.tag] : null;
                  return (
                    <button
                      key={tab + r.size}
                      onClick={() => setSel(r)}
                      style={{ animationDelay: `${n * 100}ms` }}
                      className={`relative block w-full animate-[slideL_.6s_ease-out_both] overflow-hidden rounded-2xl border-2 p-4 text-left transition ${active ? "border-gold bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-gold)_14%,transparent),transparent)]" : "border-gold/30 bg-surface"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? `${goldGrad} text-on-gold shadow-md` : "bg-accent/15 text-accent-light"}`}>
                          {tab === "full" ? <FaHouse className="h-4 w-4" /> : <FaLayerGroup className="h-4 w-4" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-extrabold text-fg">{r.size}</span>
                            {T && r.tag && (
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ${T.cls}`}><T.icon className="h-2.5 w-2.5" />{r.tag}</span>
                            )}
                          </div>
                          <span className="text-xs text-fg/55">{inr(r.rate)} / sq yd</span>
                        </div>
                        {active && <FaCircleCheck className="h-5 w-5 shrink-0 text-gold" />}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gold/15 pt-3">
                        <div>
                          <p className="flex items-center gap-1 text-[10px] text-fg/50"><FaWallet className="h-2.5 w-2.5" /> Total amount</p>
                          <p className="mt-0.5 text-sm font-bold text-fg">{inr(r.total)}</p>
                        </div>
                        {SHOW_RETURNS && (
                          <div>
                            <p className="flex items-center gap-1 text-[10px] text-fg/50"><FaCoins className="h-2.5 w-2.5" /> Return / month</p>
                            <p className="mt-0.5 text-sm font-bold text-gold">{inr(r.monthly)}</p>
                          </div>
                        )}
                      </div>
                      {SHOW_RETURNS && (
                        <div className="mt-2 flex items-center justify-between rounded-lg bg-accent/10 px-2.5 py-1.5">
                          <span className="flex items-center gap-1 text-[10px] text-accent-light"><FaChartLine className="h-2.5 w-2.5" /> Total in {PLAN_MONTHS} months</span>
                          <span className="text-xs font-bold text-accent-light">{inr(r.monthly * PLAN_MONTHS)}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
                <p className="flex items-center justify-center gap-2 rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 text-center text-[10px] font-bold tracking-wider text-gold">
                  <FaPercent className="h-3 w-3 shrink-0" /> 2% ADMIN CHARGE APPLICABLE ON EVERY PRODUCT
                </p>
              </div>

              {/* ---------- DESKTOP/TABLET: table (sm and up) ---------- */}
              <div className="hidden overflow-x-auto rounded-3xl border-2 border-gold/70 bg-surface shadow-[0_30px_60px_-30px_color-mix(in_srgb,var(--color-gold)_55%,transparent)] sm:block">
                <table className="w-full min-w-[560px] text-left">
                  <thead className={`${goldGrad} text-on-gold`}>
                    <tr>
                      {heads.map((h) => {
                        const I = h.icon;
                        return (
                          <th key={h.label} className="px-4 lg:px-5 py-3.5 lg:py-4 text-xs lg:text-sm font-extrabold whitespace-nowrap">
                            <span className="flex items-center gap-2">
                              <span className="flex h-6 w-6 lg:h-7 lg:w-7 items-center justify-center rounded-lg bg-surface/35"><I className="h-3 w-3 lg:h-3.5 lg:w-3.5" /></span>
                              {h.label}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, n) => {
                      const active = sel.size === r.size;
                      const T = r.tag ? tagStyle[r.tag] : null;
                      return (
                        <tr
                          key={tab + r.size}
                          onClick={() => setSel(r)}
                          style={{ animationDelay: `${n * 120}ms` }}
                          className={`group cursor-pointer animate-[slideL_.7s_ease-out_both] border-t border-gold/20 text-fg transition ${active ? "bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-gold)_16%,transparent),transparent)]" : "hover:bg-page-2"}`}
                        >
                          <td className="relative px-4 lg:px-5 py-4 lg:py-5">
                            <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full transition ${active ? goldGrad : "bg-transparent"}`} />
                            <span className="flex items-center gap-3">
                              <span className={`flex h-9 w-9 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-xl transition ${active ? `${goldGrad} text-on-gold shadow-md` : "bg-accent/15 text-accent-light group-hover:bg-accent group-hover:text-white"}`}>
                                {tab === "full" ? <FaHouse className="h-4 w-4" /> : <FaLayerGroup className="h-4 w-4" />}
                              </span>
                              <span>
                                <span className="block text-base lg:text-lg font-extrabold leading-tight">{r.size}</span>
                                {T && r.tag && (
                                  <span className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${T.cls}`}><T.icon className="h-2.5 w-2.5" />{r.tag}</span>
                                )}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 lg:px-5 py-4 lg:py-5 font-semibold text-fg/70 whitespace-nowrap">{inr(r.rate)}</td>
                          <td className="px-4 lg:px-5 py-4 lg:py-5 font-bold whitespace-nowrap">{inr(r.total)}</td>
                          {SHOW_RETURNS && (
                            <td className="px-4 lg:px-5 py-4 lg:py-5">
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gold/10 px-2.5 py-1 font-bold text-gold whitespace-nowrap"><FaCoins className="h-3.5 w-3.5" />{inr(r.monthly)}</span>
                            </td>
                          )}
                          {SHOW_RETURNS && (
                            <td className="px-4 lg:px-5 py-4 lg:py-5">
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent/15 px-2.5 py-1 font-bold text-accent-light whitespace-nowrap"><FaChartLine className="h-3.5 w-3.5" />{inr(r.monthly * PLAN_MONTHS)}</span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="flex items-center justify-center gap-2 border-t border-gold/25 bg-gold/5 px-5 py-4 text-center text-xs font-bold tracking-[0.18em] text-gold">
                  <FaPercent className="h-3 w-3 shrink-0" /> 2% ADMIN CHARGE APPLICABLE ON EVERY PRODUCT
                </p>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] sm:text-xs text-fg/50"><FaHandPointer className="h-3 w-3 shrink-0" /> Tap a plot to see it in the plan calculator.</p>
            </Reveal>

            {/* assurance cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 xs:grid-cols-2 sm:grid-cols-3">
              {assurances.map((as, n) => {
                const I = as.icon;
                return (
                  <Reveal key={as.title} from="bottom" delay={300 + n * 120}>
                    <div className={`group h-full p-4 sm:p-5 ${n % 2 ? cardAccent : cardGold}`}>
                      <span className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition duration-500 group-hover:scale-110 ${n % 2 ? "bg-accent/15 text-accent-light" : "bg-gold/10 text-gold"}`}><I className="h-4 w-4 sm:h-5 sm:w-5" /></span>
                      <h3 className="mt-3 text-sm sm:text-base font-bold text-fg">{as.title}</h3>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-fg/60">{as.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* calculator */}
          <Reveal from="right" delay={300}>
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold/60 bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,.45)]">
              <div className={`${accentGrad} relative flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 text-white`}>
                <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/20" />
                <span aria-hidden className="absolute -right-2 top-8 h-12 w-12 rounded-full border border-gold-light/40" />
                <span className={`${goldGrad} flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl text-on-gold shadow-lg`}><FaCalculator className="h-4 w-4 sm:h-5 sm:w-5" /></span>
                <span className="min-w-0">
                  <span className="block text-base sm:text-lg font-extrabold">Plan calculator</span>
                  <span className="block text-[11px] sm:text-xs text-white/70">Choose a plot size to see the numbers</span>
                </span>
              </div>

              <div className="p-4 sm:p-6">
                <div className="flex flex-wrap gap-2">
                  {allPlots.map((p) => {
                    const on = sel.size === p.size;
                    return (
                      <button
                        key={p.size}
                        onClick={() => { setSel(p); setTab(fullPlots.includes(p) ? "full" : "fractional"); }}
                        aria-pressed={on}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] sm:text-xs font-bold transition ${on ? `${goldGrad} border-transparent text-on-gold shadow-md` : "border-fg/15 text-fg/70 hover:border-accent-light hover:text-accent-light"}`}
                      >
                        {on && <FaCircleCheck className="h-3 w-3" />}{p.size}
                      </button>
                    );
                  })}
                </div>

                <dl className="mt-5 sm:mt-6 space-y-2">
                  {calcRows.map((c) => {
                    const I = c.icon;
                    return (
                      <div key={c.label} className={`flex items-center gap-2.5 sm:gap-3 rounded-xl px-2.5 sm:px-3 py-2.5 ${c.strong ? "border border-fg/10 bg-page-2" : ""}`}>
                        <span className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${c.strong ? `${goldGrad} text-on-gold` : "bg-accent/15 text-accent-light"}`}><I className="h-3 w-3 sm:h-3.5 sm:w-3.5" /></span>
                        <dt className={`flex-1 text-xs sm:text-sm ${c.strong ? "font-bold text-fg" : "text-fg/65"}`}>{c.label}</dt>
                        <dd className={`${c.strong ? "text-base sm:text-lg font-extrabold" : "text-sm sm:text-base font-semibold"} text-fg whitespace-nowrap`}><CountUp value={c.value} format={inr} /></dd>
                      </div>
                    );
                  })}
                </dl>

                {SHOW_RETURNS && (
                  <div className="mt-5 rounded-2xl border border-gold/40 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--color-gold)_12%,var(--color-surface))_0%,var(--color-surface)_100%)] p-4 sm:p-5">
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      <div className="rounded-xl bg-surface p-2.5 sm:p-3 shadow-sm">
                        <p className="flex items-center gap-1.5 text-[10px] sm:text-xs text-fg/55"><FaCoins className="h-3 w-3 text-gold shrink-0" /> Return / month</p>
                        <p className="mt-1 text-base sm:text-xl font-extrabold text-fg"><CountUp value={sel.monthly} format={inr} /></p>
                      </div>
                      <div className="rounded-xl bg-surface p-2.5 sm:p-3 shadow-sm">
                        <p className="flex items-center gap-1.5 text-[10px] sm:text-xs text-fg/55"><FaSackDollar className="h-3 w-3 text-accent-light shrink-0" /> Total in {PLAN_MONTHS} months</p>
                        <p className="mt-1 text-base sm:text-xl font-extrabold text-fg"><CountUp value={sel.monthly * PLAN_MONTHS} format={inr} /></p>
                      </div>
                    </div>

                    <p className="mt-4 flex h-5 items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-fg/70">
                      <FaChartLine className="h-3 w-3 text-accent-light shrink-0" />
                      <span className="truncate">{hm === null ? "Tap bars for month totals" : `Month ${hm + 1}: ${inr(sel.monthly * (hm + 1))}`}</span>
                    </p>
                    <div key={sel.size} className="mt-2 flex h-16 sm:h-24 items-end gap-[2px] sm:gap-[3px]" onMouseLeave={() => setHm(null)}>
                      {Array.from({ length: PLAN_MONTHS }).map((_, k) => (
                        <span
                          key={k}
                          onMouseEnter={() => setHm(k)}
                          onClick={() => setHm(k)}
                          style={{ height: `${((k + 1) / PLAN_MONTHS) * 100}%`, animationDelay: `${k * 35}ms` }}
                          className={`flex-1 origin-bottom animate-[growUp_.5s_ease-out_both] cursor-pointer rounded-t-sm transition-colors ${hm === k || (hm === null && k === PLAN_MONTHS - 1) ? goldGrad : hm !== null && k < hm ? "bg-accent" : hm !== null ? "bg-accent/25" : "bg-accent"}`}
                        />
                      ))}
                    </div>
                    <div className="mt-1.5 flex justify-between text-[9px] sm:text-[10px] text-fg/45"><span>Month 1</span><span>Month {PLAN_MONTHS}</span></div>
                  </div>
                )}

                <Link href="/home#contact" className={`${btnPrimary} group mt-6 w-full justify-center text-sm sm:text-base`}>
                  <span className="truncate">Enquire about {sel.size}</span><FaArrowRight className="h-3.5 w-3.5 shrink-0 transition group-hover:translate-x-1" />
                </Link>
                <p className="mt-3 flex items-start gap-1.5 text-[10px] sm:text-[11px] leading-relaxed text-fg/45"><FaCircleInfo className="mt-0.5 h-3 w-3 shrink-0" /> Stamp duty and registration fees are extra, at government rates.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal from="bottom">
          <p className="mx-auto mt-8 sm:mt-10 max-w-3xl text-center text-[11px] sm:text-xs leading-relaxed text-fg/50 px-2">
            Returns are paid only as per the terms of your signed agreement. Real estate investment carries risk. Please read the agreement in full and take independent legal and financial advice before investing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= Dholera sections — fixed black & gold colours =================
   These two sections use their own hex colours (not the theme tokens),
   so they always show on a pure black background. */
const dGoldGrad = "bg-[linear-gradient(135deg,#F5D06B_0%,#D4A437_55%,#A87A12_100%)]";
const dGoldText = "bg-[linear-gradient(135deg,#F5D06B,#D4A437_60%,#A87A12)] bg-clip-text text-transparent";
const dAccentGrad = "bg-[linear-gradient(135deg,#5BD3A4_0%,#1F8A62_55%,#0B3D2B_100%)]";

/* ================= Dholera: master town planning (3 zones) ================= */
type ZoneTone = "gold" | "purple" | "accent";
const zoneToneGrad: Record<ZoneTone, string> = {
  gold: dGoldGrad,
  purple: "bg-[linear-gradient(135deg,#C9A2F2_0%,#7B3FC4_55%,#3E1A73_100%)]",
  accent: dAccentGrad,
};
const zoneToneText: Record<ZoneTone, string> = { gold: "text-[#D4A437]", purple: "text-[#C4A0F5]", accent: "text-[#5BD3A4]" };
const zoneToneBorder: Record<ZoneTone, string> = { gold: "border-[#D4A437]/50 hover:border-[#D4A437]", purple: "border-[#7B3FC4]/50 hover:border-[#9D6BE0]", accent: "border-[#5BD3A4]/40 hover:border-[#5BD3A4]" };
const zoneToneGlow: Record<ZoneTone, string> = { gold: "bg-[#D4A437]/20", purple: "bg-[#7B3FC4]/25", accent: "bg-[#1F8A62]/25" };

const dholeraZones: { no: string; title: string; motto: string[]; points: string[]; icon: IconType; tone: ZoneTone; img: string }[] = [
  { no: "01", title: "Residential", motto: ["Live", "Work", "Grow"], points: ["Modern living spaces", "Integrated communities", "Better quality of life"], icon: FaHouseChimney, tone: "gold", img: pic("dh-zone-res", 900, 520) },
  { no: "02", title: "Industrial", motto: ["Innovate", "Manufacture", "Lead"], points: ["World-class industrial zones", "MSME and global opportunities", "Employment and economic growth"], icon: FaIndustry, tone: "purple", img: pic("dh-zone-ind", 900, 520) },
  { no: "03", title: "Commercial", motto: ["Business", "Connect", "Expand"], points: ["Retail and business hubs", "Offices and financial districts", "Global investment opportunities"], icon: FaBuilding, tone: "accent", img: pic("dh-zone-com", 900, 520) },
];

const dholeraPillars: { icon: IconType; label: string }[] = [
  { icon: FaLeaf, label: "Sustainable development" },
  { icon: FaGear, label: "World-class infrastructure" },
  { icon: FaChartColumn, label: "Investment opportunities" },
  { icon: FaUsers, label: "Better livelihood" },
];

const dholeraStrip: { icon: IconType; label: string }[] = [
  { icon: FaBullseye, label: "Smart planning" },
  { icon: FaLeaf, label: "Sustainable cities" },
  { icon: FaEarthAsia, label: "Global opportunities" },
  { icon: FaArrowTrendUp, label: "Stronger India" },
];

function DholeraMasterPlan() {
  return (
    <section id="master-plan" className="relative scroll-mt-24 overflow-hidden bg-black py-20 sm:py-28">
      <span aria-hidden className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#D4A437]/10 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-[#7B3FC4]/10 blur-3xl" />

      <div className={`${container} relative`}>
        <Reveal from="top">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.3em] text-[#D4A437]">PLANNED, SUSTAINABLE, FUTURE READY</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-6xl">
              Dholera <span className={dGoldText}>master town planning</span>
            </h2>
            <span className="relative mx-auto mt-5 block h-0.5 w-40 overflow-hidden rounded-full bg-[#D4A437]/20">
              <span className={`${dGoldGrad} absolute inset-y-0 left-0 w-1/3 animate-[shine_2.8s_ease-in-out_infinite]`} />
            </span>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_2fr]">
          {/* 3-zone intro card */}
          <Reveal from="left" className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl border border-[#D4A437]/40 bg-[#111111] p-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,.8)]">
              <span aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-dashed border-[#D4A437]/40 animate-[spin_30s_linear_infinite]" />
              <p className={`text-7xl font-extrabold leading-none ${dGoldText}`}>3</p>
              <p className="mt-1 text-2xl font-extrabold text-white">Zone types of land</p>
              <p className="mt-3 text-sm leading-relaxed text-white/65">Integrated planning for a greater tomorrow — every plot sits in a zone with a clear, approved use.</p>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {dholeraPillars.map((p) => (
                  <li key={p.label} className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-[#0D0D0D] p-3 text-xs font-semibold text-white/85 transition hover:border-[#D4A437]/60">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4A437]/10 text-[#D4A437] transition group-hover:rotate-12"><p.icon className="h-4 w-4" /></span>
                    {p.label}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* zone rows */}
          <ol className="space-y-5">
            {dholeraZones.map((z, n) => (
              <Reveal key={z.title} from={n % 2 ? "left" : "right"} delay={n * 150}>
                <li className={`group relative grid overflow-hidden rounded-3xl border-2 bg-[#111111] transition duration-500 hover:-translate-y-1 md:grid-cols-[1fr_1.05fr] ${zoneToneBorder[z.tone]}`}>
                  <span aria-hidden className={`pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full blur-3xl ${zoneToneGlow[z.tone]}`} />

                  {/* text */}
                  <div className="relative z-10 p-6 sm:p-7">
                    <div className="flex items-center gap-4">
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-black text-lg font-extrabold shadow-lg ${zoneToneGrad[z.tone]} ${z.tone === "gold" ? "text-black" : "text-white"}`}>{z.no}</span>
                      <div>
                        <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{z.title}</h3>
                        <p className={`mt-0.5 flex flex-wrap gap-x-2 text-xs font-bold tracking-[0.2em] ${zoneToneText[z.tone]}`}>
                          {z.motto.map((m, k) => (
                            <span key={m} className="flex items-center gap-2">{k > 0 && <span className="h-1 w-1 rounded-full bg-current opacity-60" />}{m.toUpperCase()}</span>
                          ))}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-4">
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0D0D0D] ${zoneToneText[z.tone]} transition duration-500 group-hover:scale-110`}><z.icon className="h-6 w-6" /></span>
                      <ul className="space-y-2">
                        {z.points.map((p) => (
                          <li key={p} className="flex items-center gap-2 text-sm text-white/75"><FaCircleCheck className={`h-3.5 w-3.5 shrink-0 ${zoneToneText[z.tone]}`} />{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* slanted photo */}
                  <div className="relative min-h-[190px] md:min-h-full">
                    <div className="absolute inset-0 overflow-hidden md:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]">
                      <div className="absolute inset-0 transition duration-700 group-hover:scale-110"><Photo src={z.img} alt={`${z.title} zone`} sizes="(min-width:1024px) 35vw, 100vw" /></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/30 to-transparent" />
                    </div>
                    <span className={`absolute inset-y-0 left-[7%] hidden w-1 -skew-x-[8deg] md:block ${zoneToneGrad[z.tone]}`} />
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* bottom strip */}
        <Reveal from="bottom" className="mt-10">
          <div className="mx-auto grid max-w-4xl grid-cols-2 gap-2 rounded-2xl border border-[#D4A437]/40 bg-[#111111] p-2 backdrop-blur sm:grid-cols-4 sm:rounded-full">
            {dholeraStrip.map((s) => (
              <p key={s.label} className="flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-xs font-bold tracking-wide text-white/85 transition hover:bg-[#D4A437]/10 hover:text-[#D4A437]">
                <s.icon className="h-4 w-4 text-[#D4A437]" />{s.label.toUpperCase()}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= Why Dholera SIR ================= */
const whyDholeraPoints: { icon: IconType; title: string; text: string }[] = [
  { icon: FaCity, title: "Future-ready infrastructure", text: "Planned smart industrial city with integrated utilities and plug-and-play infrastructure." },
  { icon: FaMicrochip, title: "Semiconductor & tech hub", text: "India's first commercial semiconductor fab is being developed in Dholera." },
  { icon: FaPlaneDeparture, title: "Strategic connectivity", text: "Ahmedabad–Dholera Expressway, airport and freight/rail connectivity strengthen access." },
  { icon: FaIndustry, title: "Industrial & global investment", text: "DMIC-linked ecosystem attracting advanced manufacturing and global companies." },
  { icon: FaArrowTrendUp, title: "Long-term growth potential", text: "Large-scale planned development creates a strong long-term investment story." },
];

const whyDholeraTags = ["Infrastructure", "Industry", "Connectivity", "Technology", "Future growth"];

function WhyDholera() {
  return (
    <section id="why-dholera" className="relative isolate scroll-mt-24 overflow-hidden bg-black py-20 sm:py-28">
      {/* soft gold glows on pure black */}
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] -z-10 h-64 w-[50rem] -translate-x-1/2 rounded-full bg-[#D4A437]/15 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -left-32 top-10 -z-10 h-80 w-80 rounded-full bg-[#D4A437]/10 blur-3xl" />

      <div className={`${container} relative`}>
        <Reveal from="top">
          <div className="text-center">
            <h2 className={`text-4xl font-extrabold leading-tight sm:text-6xl ${dGoldText}`}>Why Dholera SIR?</h2>
            <p className="mt-2 text-xl font-bold text-white sm:text-2xl">Is it the best opportunity to invest?</p>
            <span className="relative mx-auto mt-5 block h-0.5 w-48 overflow-hidden rounded-full bg-[#D4A437]/20">
              <span className={`${dGoldGrad} absolute inset-y-0 left-0 w-1/3 animate-[shine_2.8s_ease-in-out_infinite]`} />
            </span>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {whyDholeraPoints.map((p, n) => (
            <Reveal key={p.title} from={(["left", "top", "bottom", "top", "right"] as From[])[n]} delay={n * 120}>
              <li className="group relative h-full rounded-3xl border border-[#D4A437]/30 bg-[#111111] p-6 text-center transition duration-500 hover:-translate-y-2 hover:border-[#D4A437] hover:bg-[#111111] lg:rounded-none lg:border-0 lg:border-l lg:border-[#D4A437]/25 lg:bg-transparent lg:backdrop-blur-0 lg:first:border-l-0 lg:hover:bg-[#111111]">
                <span className="relative mx-auto flex h-20 w-20 items-center justify-center">
                  <span aria-hidden className="absolute inset-0 rounded-full border border-dashed border-[#D4A437]/50 transition duration-700 group-hover:rotate-180" />
                  <span className={`${dGoldGrad} flex h-14 w-14 items-center justify-center rounded-full text-black shadow-[0_0_30px_rgba(212,164,55,.45)] transition duration-500 group-hover:scale-110`}>
                    <p.icon className="h-6 w-6" />
                  </span>
                </span>
                <h3 className="mt-5 text-base font-extrabold leading-snug text-[#F5D06B]">
                  <span className="text-white/50">{n + 1}.</span> {p.title}
                </h3>
                <span className={`${dGoldGrad} mx-auto mt-3 block h-0.5 w-10 rounded-full transition-all duration-500 group-hover:w-20`} />
                <p className="mt-3 text-sm leading-relaxed text-white/70">{p.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal from="bottom" className="mt-14">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#D4A437]/25 pt-6 text-xs font-bold tracking-[0.25em] text-white/70">
            {whyDholeraTags.map((t, n) => (
              <span key={t} className="flex items-center gap-5">
                {n > 0 && <span className="h-1.5 w-1.5 rotate-45 bg-[#D4A437]" />}
                {t.toUpperCase()}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= The opportunity we already missed ================= */
function Missed() {
  return (
    <section className="relative overflow-hidden bg-page py-20 sm:py-28">
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="Learn from the past" title="The opportunity we have already missed" text="Opportunities come once. Wise people recognise them early." /></Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-4">
            {missedCities.map((c, n) => (
              <Reveal key={c.city} from="left" delay={n * 130}>
                <article className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-fg/10 bg-surface p-3 pr-5 transition duration-500 hover:border-gold/60 hover:bg-surface hover:shadow-lg">
                  <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl grayscale transition duration-500 group-hover:grayscale-0">
                    <Photo src={c.img} alt={c.city} sizes="112px" className="transition duration-700 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-lg font-extrabold text-fg">{c.city}</span>
                    <span className="block text-sm text-fg/55">Then: {c.then}</span>
                    <span className="block text-sm text-fg/55">Now: {c.now}</span>
                  </span>
                  <span className="shrink-0 -rotate-12 rounded-md border-2 border-rose-600 px-2.5 py-1 text-xs font-extrabold text-rose-600 transition duration-300 group-hover:scale-110 group-hover:-rotate-6">MISSED</span>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal from="right" delay={200}>
            <div className="relative isolate flex h-full min-h-[460px] flex-col items-center overflow-hidden rounded-[2rem] border-2 border-gold p-8 text-center shadow-2xl">
              <div className="absolute inset-0 -z-10"><Photo src={pic("ulp-road", 1200, 1000)} alt="" sizes="(min-width:1024px) 50vw, 100vw" /></div>
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-page)_97%,transparent)_0%,color-mix(in_srgb,var(--color-page)_75%,transparent)_45%,color-mix(in_srgb,var(--color-page)_5%,transparent)_100%)]" />
              <span aria-hidden className="absolute left-6 top-24 animate-[fly_6s_ease-in-out_infinite] text-accent-light"><Icon name="plane" className="h-8 w-8 rotate-45" /></span>
              <p className="mt-6 text-3xl font-bold text-fg">But not</p>
              <p className={`text-6xl font-extrabold sm:text-7xl ${goldText}`}>this one</p>
              <p className="mt-4 max-w-sm text-fg/70">A once-in-a-generation opportunity, still ahead of us.</p>
              <div className="mt-auto pt-10">
                <div className="animate-[float_5s_ease-in-out_infinite] rounded-xl border-4 border-white/80 bg-[#0B6B3A] px-6 py-3 text-white shadow-2xl">
                  <p className="flex items-center justify-center gap-6 text-xl font-extrabold"><Icon name="up" className="h-6 w-6" />Invest today<Icon name="up" className="h-6 w-6" /></p>
                  <p className="text-xs font-semibold text-white/85">Today&apos;s vision, tomorrow&apos;s wealth</p>
                </div>
                <span className="mx-auto block h-10 w-1.5 bg-surface/70" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= Smart city key indicators ================= */
function CityPlan() {
  const [active, setActive] = useState<string | null>(null);
  const [mapRef, shown] = useInView<HTMLDivElement>(0.2);

  return (
    <section id="plan" className="relative scroll-mt-20 overflow-hidden bg-page-2 py-20 sm:py-28">
      <span aria-hidden className="pointer-events-none absolute -right-24 top-20 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="Planned smart city" title="Key indicators of the master plan" text="Every zone is planned before plots are sold, so you know what will be built around your land. Hover a zone to find it on the map." /></Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {landUse.map(([k, c, label], n) => (
              <Reveal key={k} from="left" delay={n * 40}>
                <li>
                  <button
                    onMouseEnter={() => setActive(k)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(k)}
                    onBlur={() => setActive(null)}
                    className={`flex w-full items-center gap-3 rounded-xl border bg-surface px-3 py-2.5 text-left text-sm font-medium text-fg transition ${active === k ? "translate-x-2 border-gold shadow-md" : "border-fg/10"}`}
                  >
                    <span className="h-4 w-4 shrink-0 rounded shadow-inner" style={{ background: c }} />
                    {label}
                  </button>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal from="right" delay={150}>
            <div className="relative overflow-hidden rounded-[2rem] border-2 border-gold/60 bg-surface p-5 shadow-2xl sm:p-8">
              <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent opacity-10 blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-fg/55">Planned area</p>
                  <p className={`text-3xl font-extrabold sm:text-4xl ${goldText}`}><CountUp value={879.3} format={(v) => v.toFixed(1)} /> sq km</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold"><Icon name="compass" className="h-7 w-7 animate-[spin_14s_linear_infinite]" /></span>
              </div>

              <div ref={mapRef} className="relative mx-auto mt-6 grid max-w-lg gap-[3px]" style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }} aria-label="Illustrative zoning map" role="img">
                {mapRows.flatMap((row, r) =>
                  row.split("").map((k, c) => (
                    <span
                      key={`${r}-${c}`}
                      style={{ background: k === "." ? "transparent" : zoneColor[k], transitionDelay: shown ? `${(r + c) * 28}ms` : "0ms" }}
                      className={`aspect-square rounded-[4px] transition-all duration-500 ${shown ? "scale-100 opacity-100" : "scale-0 opacity-0"} ${active && k !== "." && k !== active ? "!opacity-15" : ""} ${active === k ? "scale-110 shadow-[0_0_12px_rgba(245,208,107,.8)]" : ""}`}
                    />
                  )),
                )}
              </div>
              <p className="relative mt-5 text-center text-xs text-fg/45">Illustrative layout. Refer to the official development plan for exact zones.</p>

              <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[["home", "Planned communities"], ["chart", "Economic growth"], ["globe", "World-class infrastructure"], ["users", "Sustainable future"]].map(([ic, t]) => (
                  <div key={t} className="flex flex-col items-center gap-2 rounded-xl border border-fg/10 bg-page-2 p-3 text-center text-xs font-semibold text-fg">
                    <Icon name={ic} className="h-5 w-5 text-gold" />{t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= Smart infrastructure ================= */
function Infrastructure() {
  const leftPipes = [
    { y: 180, c: "#F5D06B", l: "Gas" },
    { y: 210, c: "#6E9BFF", l: "ICT / power" },
    { y: 240, c: "#38BDF8", l: "Water (potable)" },
    { y: 270, c: "#34D399", l: "Water (recycled)" },
    { y: 305, c: "#C08A3E", l: "Sewer / industrial effluent" },
  ];
  return (
    <section id="infra" className="scroll-mt-20 bg-page py-20 sm:py-28">
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="Plug and play module" title="Smart infrastructure, built in from day one" text="Utilities run in planned underground corridors — ready to connect the day you build." /></Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {infraFeatures.map((f, n) => (
            <Reveal key={f.title} from={sideFrom(n)} delay={(n % 4) * 110}>
              <article className={`group relative h-full overflow-hidden p-6 ${n % 2 ? cardAccent : cardGold}`}>
                <span aria-hidden className={`absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-10 transition duration-500 group-hover:scale-150 ${n % 2 ? "bg-accent" : "bg-gold"}`} />
                <span className={`relative flex h-14 w-14 items-center justify-center rounded-2xl transition duration-500 group-hover:rotate-6 group-hover:scale-110 ${n % 2 ? `${accentGrad} text-white` : `${goldGrad} text-on-gold`}`}><Icon name={f.icon} /></span>
                <h3 className="relative mt-5 text-lg font-bold text-fg">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-fg/65">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* cross-section */}
        <Reveal from="zoom" className="mt-16">
          <div className="overflow-hidden rounded-[2rem] border-2 border-gold/60 bg-surface p-4 shadow-2xl sm:p-8">
            <div className="mb-5 flex flex-col justify-between gap-2 px-2 sm:flex-row sm:items-end">
              <h3 className="text-xl font-extrabold text-fg sm:text-2xl">What lies beneath every road</h3>
              <p className="text-sm text-gold">Road cross-section, plug and play module</p>
            </div>
            <div className="overflow-x-auto">
              <svg viewBox="0 0 1000 380" className="min-w-[720px]" role="img" aria-label="Road cross-section showing gas, power, water, sewer and storm water lines under the road">
                <defs>
                  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--color-page)" /><stop offset="1" stopColor="var(--color-surface-2)" /></linearGradient>
                  <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7A5431" /><stop offset="1" stopColor="#3A2614" /></linearGradient>
                </defs>
                <rect width="1000" height="130" fill="url(#sky)" />
                {/* skyline */}
                {[[300, 60, 30], [340, 40, 22], [370, 75, 26], [610, 55, 28], [645, 35, 20], [675, 70, 30]].map(([x, y, w], n) => (
                  <rect key={n} x={x} y={y} width={w} height={130 - y} fill="var(--color-line)" />
                ))}
                {/* trees & lights */}
                {[70, 190, 810, 930].map((x) => (
                  <g key={x}><rect x={x - 3} y="95" width="6" height="30" fill="#5B3A1E" /><circle cx={x} cy="88" r="22" fill="#27AE60" /><circle cx={x + 10} cy="80" r="14" fill="#2ECC71" /></g>
                ))}
                {[130, 870].map((x) => (
                  <g key={x}><rect x={x - 2} y="50" width="4" height="78" fill="#94A3B8" /><circle cx={x} cy="48" r="6" fill="#F5D06B" /><circle cx={x} cy="48" r="16" fill="#F5D06B" opacity=".25" className="animate-pulse" /></g>
                ))}
                {/* road */}
                <rect y="128" width="1000" height="26" fill="#2B3440" />
                <rect x="470" y="124" width="60" height="30" rx="4" fill="#27AE60" />
                {[40, 140, 240, 340, 640, 740, 840, 940].map((x) => <rect key={x} x={x} y="140" width="50" height="3" fill="#fff" opacity=".8" />)}
                {/* soil */}
                <rect y="154" width="1000" height="226" fill="url(#soil)" />
                {/* storm water ducts */}
                {[240, 640].map((x) => (
                  <g key={x}>
                    <rect x={x} y="190" width="55" height="55" rx="4" fill="#1F2937" stroke="#CBD5E1" strokeWidth="3" />
                    <rect x={x + 62} y="190" width="55" height="55" rx="4" fill="#1F2937" stroke="#CBD5E1" strokeWidth="3" />
                    <text x={x + 58} y="268" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">Storm water</text>
                  </g>
                ))}
                {/* pipes (animated flow) */}
                {leftPipes.map((p) => (
                  <g key={p.l}>
                    <line x1="0" y1={p.y} x2="225" y2={p.y} stroke={p.c} strokeWidth={p.l.startsWith("Sewer") ? 7 : 5} className="flow" />
                    <line x1="775" y1={p.y} x2="1000" y2={p.y} stroke={p.c} strokeWidth={p.l.startsWith("Sewer") ? 7 : 5} className="flow flow-rev" />
                    <text x="8" y={p.y - 7} fill="#fff" fontSize="12" fontWeight="600">{p.l}</text>
                    <text x="992" y={p.y - 7} textAnchor="end" fill="#fff" fontSize="12" fontWeight="600">{p.l}</text>
                  </g>
                ))}
                {/* median note */}
                <line x1="500" y1="160" x2="500" y2="320" stroke="#F5D06B" strokeWidth="2" strokeDasharray="4 5" />
                <circle cx="500" cy="160" r="4" fill="#F5D06B" />
                <text x="500" y="345" textAnchor="middle" fill="#F5D06B" fontSize="14" fontWeight="700">Median / space for future transit</text>
              </svg>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-fg/10 pt-6 sm:grid-cols-4">
              {[["leaf", "Greener cities"], ["gear", "Smarter systems"], ["users", "Healthier communities"], ["chart", "Brighter tomorrow"]].map(([ic, t]) => (
                <p key={t} className="flex items-center justify-center gap-2 text-sm font-semibold text-fg"><Icon name={ic} className="h-5 w-5 text-gold" />{t}</p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= 360° connectivity ================= */
function Connectivity() {
  const [a, setA] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = connectivity[a];

  return (
    <section id="connectivity" className="relative scroll-mt-20 overflow-hidden bg-page-2 py-20 sm:py-28">
      <span aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-accent opacity-10 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-gold opacity-20 blur-3xl" />
      <div className={`${container} relative`}>
        <Reveal from="top"><Heading center eyebrow="Plan, connect, invest, grow" title="360° connectivity" text="Air, road, rail and sea links planned around the city from day one." /></Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <ol className="space-y-3">
            {connectivity.map((c, n) => (
              <Reveal key={c.title} from="left" delay={n * 110}>
                <li>
                  <button
                    onClick={() => setA(n)}
                    aria-pressed={a === n}
                    className={`relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border p-4 text-left transition duration-500 ${a === n ? "translate-x-3 border-gold bg-surface shadow-xl" : "border-fg/10 bg-surface hover:border-accent-light/40"}`}
                  >
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full transition ${a === n ? `${goldGrad} text-on-gold` : "border border-gold/50 bg-gold/10 text-gold"}`}><Icon name={c.icon} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-bold text-fg">{c.title}</span>
                      <span className="block text-xs font-semibold tracking-wide text-gold">{c.sub}</span>
                    </span>
                    <span className="hidden max-w-[10rem] text-right text-xs text-fg/55 sm:block">{c.tagline}</span>
                    {a === n && (
                      <span
                        key={`c-${a}`}
                        onAnimationEnd={() => setA((a + 1) % connectivity.length)}
                        style={{ animationPlayState: paused ? "paused" : "running" }}
                        className={`absolute bottom-0 left-0 h-0.5 ${goldGrad} animate-[progress_4.5s_linear_forwards]`}
                      />
                    )}
                  </button>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal from="right" delay={200} className="relative">
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[2rem] border-4 border-gold shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
              {connectivity.map((c, n) => (
                <div key={c.img} aria-hidden={n !== a} className={`absolute inset-0 transition-all duration-[1100ms] ease-out ${n === a ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
                  <Photo src={c.img} alt={c.title} sizes="(min-width:1024px) 50vw, 100vw" />
                </div>
              ))}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-6 pt-20">
                <p key={a} className="animate-[fadeUp_.7s_ease-out_both] text-xl font-extrabold text-white">{item.tagline}</p>
              </div>
            </div>
            <div className="absolute -left-6 -top-6 flex h-28 w-28 items-center justify-center rounded-full bg-surface shadow-2xl">
              <span aria-hidden className="absolute inset-1.5 animate-[spin_10s_linear_infinite] rounded-full border-2 border-dashed border-gold" />
              <span className="text-center leading-tight">
                <span className={`block text-2xl font-extrabold ${goldText}`}>360°</span>
                <span className="block text-[10px] font-semibold text-fg/70">Connectivity</span>
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}



/* ================= Page ================= */
export default function PortfolioPage() {
  return (
    <div className={`${font.className} min-h-screen overflow-x-hidden bg-page text-fg antialiased`}>
      <style>{`
        @keyframes navIn { from { transform: translateY(-100%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes slideL { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: none; } }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.14); } }
        @keyframes progress { from { width: 0; } to { width: 100%; } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(320%); } }
        @keyframes growUp { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        @keyframes fly { 0% { transform: translate(-40px, 30px); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translate(380px, -70px); opacity: 0; } }
        @keyframes flowAnim { to { stroke-dashoffset: -40; } }
        .flow { stroke-dasharray: 14 6; animation: flowAnim 1.4s linear infinite; }
        .flow-rev { animation-direction: reverse; }
        html { scroll-behavior: smooth; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
      `}</style>
      <main>
        <Hero />
        <Ticker />
        <WhyDholera />
        <Portfolio />
        <DholeraMasterPlan />
        <Missed />
        <CityPlan />
        <Infrastructure />
        <Connectivity />
      
       
      </main>
    </div>
  );
}