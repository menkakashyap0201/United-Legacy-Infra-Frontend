"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import type { IconType } from "react-icons";
import {
  FaCrown, FaHandshake, FaStar, FaGem, FaUserTie, FaUsers, FaGift, FaPlane, FaBed, FaMapLocationDot,
  FaCarSide, FaHouseChimney, FaTrophy, FaUserPlus, FaSackDollar, FaRocket, FaFileSignature, FaShieldHalved,
  FaArrowRight, FaChevronRight, FaChevronLeft, FaPhone, FaCircleCheck, FaMedal, FaFacebookF, FaInstagram,
  FaYoutube, FaWhatsapp, FaPercent, FaChartLine, FaCalculator, FaRotate, FaQuoteLeft, FaLandmark, FaAward,
  FaHandHoldingDollar,
} from "react-icons/fa6";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const script = Great_Vibes({ subsets: ["latin"], weight: "400" });

/* ================= Theme (same as other pages) =================
   gold #D4A12A · gold-light #F5D06B · gold-deep #A87A12
   royal #1E4BB8 · navy #0B1D45 · ink #0F172A · soft #F7F9FD */
const goldGrad = "bg-[linear-gradient(135deg,var(--color-gold-light)_0%,var(--color-gold)_55%,var(--color-gold-deep)_100%)]";
const accentGrad = "bg-[linear-gradient(135deg,var(--color-accent-light)_0%,var(--color-accent)_55%,var(--color-accent-deep)_100%)]";
const purpleGrad = "bg-[linear-gradient(135deg,#C9A2F2_0%,#7B3FC4_55%,#3E1A73_100%)]";
const bronzeGrad = "bg-[linear-gradient(135deg,#F2C29B_0%,#B8733A_55%,#6E3F1B_100%)]";
const goldText = "bg-[linear-gradient(135deg,var(--color-gold-light),var(--color-gold))] bg-clip-text text-transparent";
const container = "mx-auto w-full max-w-7xl px-5 sm:px-8";
const btnPrimary = `${goldGrad} inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-on-gold shadow-[0_12px_30px_-10px_color-mix(in_srgb,var(--color-gold)_80%,transparent)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-10px_color-mix(in_srgb,var(--color-gold)_90%,transparent)]`;
const btnOutline = "inline-flex items-center justify-center gap-2 rounded-full border border-fg/15 bg-surface px-7 py-3.5 text-sm font-semibold text-fg transition hover:border-accent-light hover:text-accent-light";

/* ================= Images: yahan apne direct links daalo =================
   - Remote link:  "https://your-cdn.com/partner-meet.jpg"
   - Local file:   public/images/partner-meet.jpg  →  "/images/partner-meet.jpg"   (hamesha "/" se shuru, "./" nahi) */
const IMAGES = {
  hero: {
    partnerMeet: "/partner-meet.png",
    villa: "https://www.smartcitypk.com/assets/uploads/villas_5e621fbc1d250.png",
    trip: "https://media.istockphoto.com/id/1185384608/photo/young-men-planning-vacation-trip-and-searching-information-or-booking-an-hotel-on-a-smart.jpg?s=612x612&w=0&k=20&c=sGRTVMIVeSWExTAvB6p7IblQWIEPLm7PwQj_hUO8reU=",
    plot: "https://workians.com/media/blogs/1779712314_1402_dholera.png",
  },
  /* 10 tiers — level 1 se 10 tak, reward ki photo */
  tiers: [
    "/starter.png",
    "https://www.skywaytour.com/media/gallery/2024-01-01-07-06-27-ExperienceMaldivesbeforeitdisappears03.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6emyAcY5AUGQ1jNkmtpNqYrww37cGmatN4d5n7wNeUMVqyhcp9GPNFtQ-&s=10",
    "https://imagecdn.99acres.com/media1/39364/18/787298782M-1783052974799.webp",
    "https://5.imimg.com/data5/XK/ZX/FO/SELLER-80740800/dholera-metro-city-amenities-7-jpg.jpg",
    "https://cdn.blox.xyz/projects-2x/av-group-av-smart-city-elevation-1704952272.webp",
    "https://rei.wlimg.com/proj_images/project53748/proj_img-53748-66612_7.jpg",
    "https://cdn.blox.xyz/projects-2x/av-group-av-smart-city-elevation-1704952302.webp",
    "https://mirrikh.com/wp-content/uploads/2024/10/dholera-smart-city-plot-price-2.jpg",
    "https://www.ethereuminfracon.com/assets/image/projects/project_hero_main_png_1775711651738.png",
  ],
  commitment: {
    registry: "/registry.png",
    agreement: "/commit-agreement.png",
    buyback: "/buypack.png",
  },
  vision: {
    main: "https://marvel-b1-cdn.bc0a.com/f00000000227455/www.mvpind.com/wp-content/uploads/2017/10/Today%E2%80%99s-Advanced-Composites-Take-Center-Stage-in-Building-Design.jpg",
    small1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2tOO8wS5tazDwent6nuCuyAMoDNDp6h7cur_GIa3AHautttlzR-0loBE&s=10",
    small2: "https://globalcitygurugram.in/wp-content/uploads/2022/03/HOTEL-TOWERS-PEDASTRIAN-PLAZA-VIEW-scaled.jpg",
  },
  rewards: {
    trips: "https://etimg.etb2bimg.com/thumb/msid-114527719,imgsize-115856,width-1200,height=627,overlay-ettravel,resizemode-75/research-and-statistics/research/holiday-spending-travel-soar-indians-focus-on-unique-gifts-and-reward-programs-finds-amex-survey.jpg",
    plots: "https://dholeraacres.com/wp-content/uploads/2026/06/dholera_plot_prices-1-780x780.jpg",
    villas: "https://klmprojects.in/wp-content/uploads/2026/04/villas.png",
    farmhouses: "https://thefarmstays.com/wp-content/uploads/2026/04/the_farmstays_farmhouse_kokapet.jpg",
    cars: "https://autobest.co.in/uploads/blog/075130517030.jpeg",
    villaAbroad: "https://robbreport.com/wp-content/uploads/2017/11/manzu-exterior-deck-5.jpg?w=1000",
    awards: "/award-smart-city.png",
    estates: "https://ajmera.com/wp-content/uploads/2023/11/smart-cities.jpg",
  },
};

/* ================= Data (from the presentation) ================= */

const heroSlides = [
  { img: IMAGES.hero.partnerMeet, label: "Partner meet" },
  { img: IMAGES.hero.villa, label: "Luxury villa reward" },
  { img: IMAGES.hero.trip, label: "International trip" },
  { img: IMAGES.hero.plot, label: "Premium plot" },
];

type Tone = "gold" | "blue" | "purple" | "bronze";
const toneGrad: Record<Tone, string> = { gold: goldGrad, blue: accentGrad, purple: purpleGrad, bronze: bronzeGrad };
const toneText: Record<Tone, string> = { gold: "text-gold", blue: "text-accent-light", purple: "text-[#C4A0F5]", bronze: "text-[#E8B27F]" };
const toneSoft: Record<Tone, string> = { gold: "bg-gold/10", blue: "bg-accent/15", purple: "bg-[#7B3FC4]/20", bronze: "bg-[#B8733A]/20" };
const toneBorder: Record<Tone, string> = { gold: "border-gold/50", blue: "border-accent-light/35", purple: "border-[#7B3FC4]/35", bronze: "border-[#B8733A]/40" };

/* amounts in lakh */
type Tier = { name: string; group: string; min: number; max: number; pct: number; reward: string; icon: IconType; rewardIcon: IconType; tone: Tone; img: string };
const tiers: Tier[] = [
  { name: "Advisor", group: "Starter", min: 15, max: 30, pct: 3, reward: "Residential programme", icon: FaUserTie, rewardIcon: FaBed, tone: "gold", img: IMAGES.tiers[0] },
  { name: "Channel Partner (Senior)", group: "Starter", min: 30, max: 100, pct: 4, reward: "Couple international trip", icon: FaHandshake, rewardIcon: FaPlane, tone: "blue", img: IMAGES.tiers[1] },
  { name: "Associate Channel Partner", group: "Growth", min: 100, max: 500, pct: 5, reward: "₹10 lakh plot", icon: FaStar, rewardIcon: FaMapLocationDot, tone: "gold", img: IMAGES.tiers[2] },
  { name: "Senior Executive Channel Partner", group: "Growth", min: 500, max: 1000, pct: 6, reward: "₹25 lakh plot", icon: FaGem, rewardIcon: FaMapLocationDot, tone: "purple", img: IMAGES.tiers[3] },
  { name: "Elite Channel Partner", group: "Leader", min: 1000, max: 2500, pct: 7, reward: "₹50 lakh plot", icon: FaCrown, rewardIcon: FaMapLocationDot, tone: "gold", img: IMAGES.tiers[4] },
  { name: "Premium Channel Partner", group: "Leader", min: 2500, max: 7500, pct: 8, reward: "₹1 crore villa", icon: FaGem, rewardIcon: FaHouseChimney, tone: "blue", img: IMAGES.tiers[5] },
  { name: "Strategic Channel Partner", group: "Leader", min: 7500, max: 15000, pct: 10, reward: "₹2 crore farmhouse + Audi", icon: FaHandshake, rewardIcon: FaCarSide, tone: "purple", img: IMAGES.tiers[6] },
  { name: "National Channel Partner", group: "Legend", min: 15000, max: 30000, pct: 15, reward: "₹5 crore villa + E-Class Mercedes", icon: FaStar, rewardIcon: FaCarSide, tone: "bronze", img: IMAGES.tiers[7] },
  { name: "Master Channel Partner", group: "Legend", min: 30000, max: 50000, pct: 20, reward: "Family villa in Dubai (₹20 crore) + Defender", icon: FaCrown, rewardIcon: FaHouseChimney, tone: "gold", img: IMAGES.tiers[8] },
  { name: "Super Channel Partner", group: "Legend", min: 50000, max: 100000, pct: 25, reward: "Luxury estate + super car", icon: FaGem, rewardIcon: FaTrophy, tone: "blue", img: IMAGES.tiers[9] },
];

const steps: { icon: IconType; title: string; text: string }[] = [
  { icon: FaUserPlus, title: "Register", text: "Sign up as a partner and complete a short onboarding with our sales team." },
  { icon: FaUsers, title: "Guide buyers", text: "Bring investors, arrange site visits and help them choose the right plot." },
  { icon: FaHandHoldingDollar, title: "Earn commission", text: "Earn a percentage of your total sales, as per your partner agreement." },
  { icon: FaTrophy, title: "Unlock rewards", text: "Move up the tiers to unlock trips, plots, villas and cars." },
];

const commitment: { icon: IconType; title: string; sub: string; text: string; img: string; tone: "gold" | "blue" }[] = [
  { icon: FaLandmark, title: "Registry", sub: "In your name", text: "You receive the legal property registry in your name, for complete ownership and peace of mind.", img: IMAGES.commitment.registry, tone: "gold" },
  { icon: FaFileSignature, title: "Agreement", sub: "For your security", text: "A formal agreement clearly sets out every term and condition for a transparent, hassle-free investment.", img: IMAGES.commitment.agreement, tone: "blue" },
  { icon: FaShieldHalved, title: "25-month buyback", sub: "Policy", text: "A 25-month buyback option, on the exact terms written in your signed agreement.", img: IMAGES.commitment.buyback, tone: "gold" },
];

const vision: [string, string][] = [
  ["Trust", "before transactions"],
  ["Value", "before volume"],
  ["Quality", "before speed"],
  ["Transparency", "in every commitment"],
  ["Professionalism", "in every interaction"],
  ["Customer relationships", "for the long term"],
  ["Teamwork", "over individual success"],
  ["Leadership", "through action, not position"],
];

const rewardsGallery = [
  { img: IMAGES.rewards.trips, label: "International trips" },
  { img: IMAGES.rewards.plots, label: "Premium plots" },
  { img: IMAGES.rewards.villas, label: "Luxury villas" },
  { img: IMAGES.rewards.farmhouses, label: "Farmhouses" },
  { img: IMAGES.rewards.cars, label: "Luxury cars" },
  { img: IMAGES.rewards.villaAbroad, label: "Family villa abroad" },
  { img: IMAGES.rewards.awards, label: "Partner awards" },
  { img: IMAGES.rewards.estates, label: "Luxury estates" },
];

const socials: { icon: IconType; label: string }[] = [
  { icon: FaFacebookF, label: "Facebook" }, { icon: FaInstagram, label: "Instagram" }, { icon: FaYoutube, label: "YouTube" }, { icon: FaWhatsapp, label: "WhatsApp" },
];

/* ================= Formatting ================= */
const fmtLakh = (l: number) => (l >= 100 ? `₹${+(l / 100).toFixed(l >= 1000 ? 0 : 2)} Cr` : `₹${Math.round(l)} Lakh`);
const fmtRange = (t: Tier) => `${fmtLakh(t.min)} – ${fmtLakh(t.max)}`;
const fmtRupees = (r: number) => {
  const l = r / 1e5;
  if (l >= 100) return `₹${(l / 100).toFixed(2)} Cr`;
  if (l >= 1) return `₹${l.toFixed(2)} Lakh`;
  return "₹" + Math.round(r).toLocaleString("en-IN");
};

/* ================= Helpers ================= */
function Photo({ src, alt, sizes, priority, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const [ok, setOk] = useState(true);
  useEffect(() => setOk(true), [src]); // link badalne par dobara try kare
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

/** Slides children in (L→R, R→L, T→B, B→T or zoom) when scrolled into view. */
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

function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const [ref, shown] = useInView<HTMLSpanElement>(0.3);
  const [v, setV] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (!shown) return;
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 800);
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

function Heading({ eyebrow, title, text, center = false }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
          <span className={`${goldGrad} h-0.5 w-6 rounded-full`} />
          {eyebrow}
          {center && <span className={`${goldGrad} h-0.5 w-6 rounded-full`} />}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-[2.6rem]">{title}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-fg/65">{text}</p>}
    </div>
  );
}

function Ring({ className }: { className: string }) {
  return <span aria-hidden className={`pointer-events-none absolute rounded-full border-gold ${className}`} />;
}

/* ================= Photo frames ================= */
const houseClipL = "polygon(0% 11%, 26% 11%, 38% 0%, 50% 11%, 100% 0%, 100% 100%, 0% 100%)";
const houseClipR = "polygon(0% 0%, 50% 11%, 62% 0%, 74% 11%, 100% 11%, 100% 100%, 0% 100%)";

/** Photo inside a house-shaped outline with a gradient border. */
function HouseFrame({ src, alt, sizes, tone = "gold", flip = false, className = "", children }: { src: string; alt: string; sizes: string; tone?: Tone; flip?: boolean; className?: string; children?: ReactNode }) {
  const clip = flip ? houseClipR : houseClipL;
  return (
    <div className={`group/frame relative [filter:drop-shadow(0_28px_30px_rgba(0,0,0,.25))] ${className}`}>
      <div className={`h-full w-full p-[6px] ${toneGrad[tone]}`} style={{ clipPath: clip, borderRadius: 26 }}>
        <div className="relative h-full w-full overflow-hidden" style={{ clipPath: clip, borderRadius: 21 }}>
          <div className="absolute inset-0 transition duration-700 ease-out group-hover/frame:scale-110"><Photo src={src} alt={alt} sizes={sizes} /></div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Rounded photo with a gradient border. */
function Frame({ src, alt = "", tone = "gold", className = "", sizes = "400px", children }: { src: string; alt?: string; tone?: Tone; className?: string; sizes?: string; children?: ReactNode }) {
  return (
    <div className={`group/f rounded-2xl p-[5px] shadow-xl ${toneGrad[tone]} ${className}`}>
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <div className="absolute inset-0 transition duration-700 group-hover/f:scale-110"><Photo src={src} alt={alt} sizes={sizes} /></div>
        {children}
      </div>
    </div>
  );
}

/* ================= Hero: text + house photo-frame carousel ================= */
function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % heroSlides.length), 4500);
    return () => clearInterval(t);
  }, [i]);
  const next = (i + 1) % heroSlides.length;
  const next2 = (i + 2) % heroSlides.length;

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--color-surface)_0%,var(--color-page)_65%)] pb-20 pt-28 lg:pt-32">
      <span aria-hidden className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-gold-light/25 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute left-[38%] top-24 hidden h-24 w-[35%] rounded-bl-[2.5rem] border-b border-l border-gold/40 lg:block" />
      <Ring className="left-[5%] top-28 hidden h-4 w-4 border-2 lg:block" />
      <Ring className="left-[44%] top-[70%] hidden h-10 w-10 border-[4px] opacity-60 animate-[float_7s_ease-in-out_infinite] xl:block" />

      <div className={`${container} relative grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]`}>
        {/* text */}
        <div className="text-center lg:text-left">
          <Reveal from="top">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
              <FaCrown className="h-3.5 w-3.5" /> Channel partner program
            </span>
          </Reveal>
          <Reveal from="left" delay={150}>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-fg sm:text-5xl xl:text-6xl">
              Your guidance creates <span className={goldText}>greater value</span>
            </h1>
          </Reveal>
          <Reveal from="left" delay={300}>
            <p className={`${script.className} mt-3 text-3xl text-gold sm:text-4xl`}>Today&apos;s partnership, a bigger tomorrow</p>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-fg/65 lg:mx-0">
              Partner with United Legacy Infra. Earn a commission on every sale you guide, and grow through ten tiers of rewards.
            </p>
          </Reveal>
          <Reveal from="bottom" delay={450}>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a href="#join" className={btnPrimary}>Become a partner <FaArrowRight className="h-3.5 w-3.5" /></a>
              <a href="#tiers" className={btnOutline}>See partner tiers</a>
            </div>
          </Reveal>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: FaMedal, v: "10 tiers", l: "Advisor to Super" },
              { icon: FaPercent, v: "3% – 25%", l: "Commission" },
              { icon: FaGift, v: "Rewards", l: "Trips to villas" },
            ].map((s, n) => (
              <Reveal key={s.v} from="bottom" delay={550 + n * 120}>
                <div className="group h-full rounded-2xl border border-gold/30 bg-surface/90 p-3 text-left shadow-[0_12px_30px_-22px_rgba(0,0,0,.5)] transition hover:-translate-y-1 hover:border-gold">
                  <span className={`${n % 2 ? accentGrad + " text-white" : goldGrad + " text-on-gold"} flex h-9 w-9 items-center justify-center rounded-lg transition group-hover:rotate-12`}><s.icon className="h-4 w-4" /></span>
                  <span className="mt-2 block text-sm font-extrabold text-fg sm:text-base">{s.v}</span>
                  <span className="block text-xs text-fg/55">{s.l}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* house-frame collage carousel */}
        <Reveal from="zoom" delay={200} className="relative mx-auto w-full max-w-xl pb-14 sm:pr-24">
          <Ring className="-top-6 left-[36%] h-7 w-7 border-[3px]" />
          <div className={`relative aspect-square ${goldGrad} p-[6px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.5)]`} style={{ clipPath: houseClipL, borderRadius: 26 }}>
            <div className="relative h-full w-full overflow-hidden" style={{ clipPath: houseClipL, borderRadius: 22 }}>
              {heroSlides.map((s, n) => (
                <div key={s.label} aria-hidden={n !== i} className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${n === i ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
                  <Photo src={s.img} alt={s.label} sizes="(min-width:1024px) 40vw, 90vw" priority={n === 0} />
                </div>
              ))}
              <span key={i} className="absolute bottom-4 right-4 animate-[fadeUp_.7s_ease-out_both] rounded-full bg-surface/90 px-3 py-1 text-xs font-bold text-fg shadow">{heroSlides[i].label}</span>
            </div>
          </div>

          <div className="absolute right-0 top-[14%] hidden w-[34%] sm:block">
            <button onClick={() => setI(next)} aria-label="Show next image" className="relative block aspect-[4/3.3] w-full overflow-hidden rounded-2xl border-[5px] border-accent-light shadow-xl transition hover:-translate-y-1 animate-[float_6s_ease-in-out_infinite]">
              <div key={next} className="absolute inset-0 animate-[fadeUp_.8s_ease-out_both]"><Photo src={heroSlides[next].img} alt="" sizes="200px" /></div>
            </button>
            <button onClick={() => setI(next2)} aria-label="Show image after next" className="relative -ml-8 mt-4 block aspect-[4/3.5] w-[118%] overflow-hidden rounded-2xl border-[5px] border-gold shadow-xl transition hover:-translate-y-1 animate-[float_7s_ease-in-out_1s_infinite]">
              <div key={next2} className="absolute inset-0 animate-[fadeUp_.8s_ease-out_both]"><Photo src={heroSlides[next2].img} alt="" sizes="260px" /></div>
            </button>
          </div>

          <div className={`${goldGrad} absolute -left-2 bottom-16 z-10 rounded-2xl px-5 py-3 text-on-gold shadow-[0_18px_40px_-12px_color-mix(in_srgb,var(--color-gold)_80%,transparent)] sm:-left-8`}>
            <p className="text-sm font-medium">Commission up to</p>
            <p className="text-2xl font-extrabold sm:text-3xl">25%</p>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between sm:right-24">
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className={`${goldGrad} flex h-8 w-8 items-center justify-center rounded-full text-on-gold transition hover:-translate-y-0.5`}><s.icon className="h-3.5 w-3.5" /></a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {heroSlides.map((_, n) => (
                <button key={n} aria-label={`Show slide ${n + 1}`} onClick={() => setI(n)} className={`h-2 rounded-full transition-all duration-300 ${n === i ? "w-7 bg-surface-2" : "w-2 bg-fg/20"}`} />
              ))}
              <button onClick={() => setI(next)} aria-label="Next image" className="group ml-1 flex items-center text-fg">
                <span className="h-px w-6 bg-fg/40 transition-all group-hover:w-10" />
                <FaChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= How it works ================= */
function HowItWorks() {
  return (
    <section className="bg-page py-20 sm:py-24">
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="How the program works" title="Four steps from partner to legend" /></Reveal>
        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden className="absolute left-[12%] right-[12%] top-8 hidden h-0.5 bg-[linear-gradient(90deg,var(--color-gold),var(--color-accent),var(--color-gold))] lg:block" />
          {steps.map((s, n) => (
            <Reveal key={s.title} from={sideFrom(n)} delay={n * 130}>
              <li className="group relative text-center">
                <span className={`relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-page shadow-lg transition duration-500 group-hover:scale-110 group-hover:rotate-12 ${n % 2 ? `${accentGrad} text-white` : `${goldGrad} text-on-gold`}`}><s.icon className="h-6 w-6" /></span>
                <span className="absolute left-1/2 top-0 z-20 flex h-6 w-6 translate-x-4 -translate-y-1 items-center justify-center rounded-full bg-surface-2 text-[10px] font-bold text-gold-light">{n + 1}</span>
                <h3 className="mt-5 text-lg font-bold text-fg">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] text-sm leading-relaxed text-fg/60">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ================= Partner tiers carousel ================= */
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

function TierCard({ t, n }: { t: Tier; n: number }) {
  return (
    <article className={`group relative h-full overflow-hidden rounded-3xl border-2 bg-surface shadow-[0_25px_50px_-30px_rgba(0,0,0,.5)] transition duration-500 hover:-translate-y-2 ${toneBorder[t.tone]}`}>
      <div className="px-4 pt-4">
        <Frame src={t.img} alt={t.reward} tone={t.tone} className="aspect-[16/10.5]" sizes="(min-width:1024px) 33vw, 100vw">
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-bold text-fg shadow">Level {n + 1} · {t.group}</span>
        </Frame>
      </div>
      <div className="relative px-6 pb-6">
        <span className={`relative z-10 -mt-7 ml-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-page text-white shadow-lg transition duration-500 group-hover:rotate-[20deg] ${toneGrad[t.tone]}`}><t.icon className="h-6 w-6" /></span>
        <h3 className="-mt-3 pr-16 text-lg font-extrabold leading-snug text-fg">{t.name}</h3>
        <div className="mt-4 grid grid-cols-[1fr_auto] items-stretch gap-3">
          <div className={`rounded-xl p-3 ${toneSoft[t.tone]}`}>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-fg/55"><FaChartLine className="h-3 w-3" /> Sale</p>
            <p className="mt-0.5 text-sm font-extrabold text-fg">{fmtRange(t)}</p>
          </div>
          <div className={`flex flex-col items-center justify-center rounded-xl px-4 text-fg ${goldGrad}`}>
            <span className="text-2xl font-extrabold leading-none">{t.pct}%</span>
            <span className="text-[10px] font-bold">commission</span>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-2.5 rounded-xl border border-dashed border-fg/15 p-3 text-sm font-bold text-fg">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneSoft[t.tone]} ${toneText[t.tone]}`}><FaGift className="h-4 w-4" /></span>
          {t.reward}
        </p>
      </div>
    </article>
  );
}

function Tiers() {
  const perView = usePerView();
  const maxIndex = Math.max(0, tiers.length - perView);
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
    <section id="tiers" className="relative scroll-mt-20 overflow-hidden bg-page-2 py-20 sm:py-28">
      <span aria-hidden className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className={`${container} relative`}>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Reveal from="left"><Heading eyebrow="Partner tiers" title="Ten levels. Bigger sales, bigger rewards." text="Your commission and rewards grow with your total sales. Every tier is set out in your written partner agreement." /></Reveal>
          <Reveal from="right" className="flex gap-3">
            <button aria-label="Previous tiers" onClick={() => go(index - 1)} className="flex h-12 w-12 items-center justify-center rounded-full border border-fg/15 bg-surface text-fg transition hover:bg-surface-2 hover:text-white"><FaChevronLeft className="h-4 w-4" /></button>
            <button aria-label="Next tiers" onClick={() => go(index + 1)} className={`${goldGrad} flex h-12 w-12 items-center justify-center rounded-full text-on-gold transition hover:brightness-105`}><FaChevronRight className="h-4 w-4" /></button>
          </Reveal>
        </div>

        {/* tier jump chips */}
        <Reveal from="bottom" delay={100} className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
            {tiers.map((t, n) => {
              const on = n >= index && n < index + perView;
              return (
                <button key={t.name} onClick={() => go(Math.min(n, maxIndex))} className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${on ? `${goldGrad} border-transparent text-on-gold shadow` : "border-fg/15 bg-surface text-fg/65 hover:border-accent-light hover:text-accent-light"}`}>
                  <t.icon className="h-3 w-3" />{t.pct}%
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal from="bottom" delay={200}>
          <div
            className="-mx-3 mt-6 overflow-hidden py-4"
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
              {tiers.map((t, n) => (
                <div key={t.name} className="shrink-0 px-3" style={{ width: `${100 / perView}%` }}>
                  <TierCard t={t} n={n} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, n) => (
            <button key={n} aria-label={`Go to slide ${n + 1}`} onClick={() => go(n)} className={`h-2 rounded-full transition-all duration-300 ${n === index ? `${goldGrad} w-8` : "w-2 bg-fg/15"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= Commission calculator + tier ladder ================= */
const MIN_L = 15;
const MAX_L = 100000;
const toLakh = (t: number) => MIN_L * Math.pow(MAX_L / MIN_L, t / 1000);
const toSlider = (l: number) => Math.round((Math.log(l / MIN_L) / Math.log(MAX_L / MIN_L)) * 1000);

function Calculator() {
  const [pos, setPos] = useState(toSlider(150));
  const [ladderRef, shown] = useInView<HTMLDivElement>(0.3);
  const raw = toLakh(pos);
  const lakh = raw >= 100 ? Math.round(raw / 10) * 10 : Math.round(raw);
  const idx = tiers.reduce((acc, t, n) => (lakh >= t.min ? n : acc), 0);
  const tier = tiers[idx];
  const commission = lakh * 1e5 * (tier.pct / 100);
  const nextTier = tiers[idx + 1];

  return (
    <section id="calculator" className="scroll-mt-20 bg-page py-20 sm:py-28">
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="Commission calculator" title="See what your sales can earn" text="Move the slider to your expected total sales and see your tier, commission and reward." /></Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
          <Reveal from="left">
            <div className="h-full overflow-hidden rounded-3xl border border-gold/60 bg-surface shadow-[0_30px_60px_-30px_rgba(0,0,0,.45)]">
              <div className={`${accentGrad} relative flex items-center gap-3 px-6 py-5 text-white`}>
                <span aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full border border-white/20" />
                <span className={`${goldGrad} flex h-11 w-11 items-center justify-center rounded-xl text-on-gold shadow-lg`}><FaCalculator className="h-5 w-5" /></span>
                <span>
                  <span className="block text-lg font-extrabold">Your total sales</span>
                  <span className="block text-xs text-white/70">From ₹15 lakh up to ₹1,000 crore</span>
                </span>
              </div>
              <div className="p-6">
                <p className="text-center text-4xl font-extrabold text-fg sm:text-5xl">{fmtLakh(lakh)}</p>
                <input
                  type="range" min={0} max={1000} value={pos} onChange={(e) => setPos(+e.target.value)}
                  aria-label="Total sales"
                  className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full accent-gold"
                  style={{ background: `linear-gradient(90deg,var(--color-gold) ${pos / 10}%,var(--color-line) ${pos / 10}%)` }}
                />
                <div className="mt-2 flex justify-between text-[11px] text-fg/45"><span>₹15 Lakh</span><span>₹1,000 Cr</span></div>

                <div key={tier.name} className="mt-6 grid animate-[fadeUp_.5s_ease-out_both] gap-3 sm:grid-cols-2">
                  <div className={`rounded-2xl p-4 ${toneSoft[tier.tone]}`}>
                    <p className="flex items-center gap-1.5 text-xs text-fg/55"><FaMedal className="h-3 w-3" /> Your tier</p>
                    <p className="mt-1 flex items-center gap-2 font-extrabold text-fg"><span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${toneGrad[tier.tone]}`}><tier.icon className="h-3.5 w-3.5" /></span>{tier.name}</p>
                  </div>
                  <div className="rounded-2xl bg-gold/10 p-4">
                    <p className="flex items-center gap-1.5 text-xs text-fg/55"><FaPercent className="h-3 w-3" /> Commission rate</p>
                    <p className="mt-1 text-2xl font-extrabold text-gold">{tier.pct}%</p>
                  </div>
                </div>
                <div className="mt-3 rounded-2xl border border-fg/10 bg-page-2 p-4">
                  <p className="flex items-center gap-1.5 text-xs text-fg/55"><FaSackDollar className="h-3 w-3 text-accent-light" /> Estimated commission</p>
                  <p className="mt-1 text-3xl font-extrabold text-fg"><CountUp value={commission} format={fmtRupees} /></p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-fg"><FaGift className="h-4 w-4 text-gold" /> Reward: {tier.reward}</p>
                </div>
                {nextTier && (
                  <p className="mt-4 flex items-center gap-2 text-xs text-fg/60"><FaRocket className="h-3.5 w-3.5 text-accent-light" /> Reach {fmtLakh(nextTier.min)} to become <b className="text-fg">{nextTier.name}</b> ({nextTier.pct}%).</p>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal from="right" delay={150}>
            <div className="flex h-full flex-col rounded-3xl border border-accent-light/20 bg-page-2 p-6">
              <h3 className="flex items-center gap-2 font-extrabold text-fg"><FaChartLine className="h-4 w-4 text-gold" /> Commission ladder</h3>
              <p className="text-sm text-fg/55">Tap a bar to jump to that tier.</p>
              <div ref={ladderRef} className="mt-6 flex min-h-[260px] flex-1 items-end gap-2">
                {tiers.map((t, n) => {
                  const on = n === idx;
                  return (
                    <button key={t.name} onClick={() => setPos(toSlider(t.min))} aria-label={`${t.name}, ${t.pct}%`} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                      <span className={`text-[11px] font-extrabold transition ${on ? "text-gold" : "text-fg/50"}`}>{t.pct}%</span>
                      <span
                        style={{ height: shown ? `${(t.pct / 25) * 100}%` : "0%", transitionDelay: `${n * 70}ms` }}
                        className={`relative w-full rounded-t-lg transition-all duration-700 ease-out ${on ? `${goldGrad} shadow-[0_0_20px_color-mix(in_srgb,var(--color-gold)_60%,transparent)]` : n < idx ? "bg-accent" : "bg-accent/20 group-hover:bg-accent/40"}`}
                      >
                        {on && <span className="absolute -top-8 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-surface-2 text-gold-light"><FaCrown className="h-3 w-3" /></span>}
                      </span>
                      <span className="text-[10px] font-bold text-fg/45">L{n + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal from="bottom"><p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-fg/50">Figures are estimates for illustration. Commission and rewards are paid only as per your written partner agreement.</p></Reveal>
      </div>
    </section>
  );
}

/* ================= Your investment, our commitment ================= */
function Commitment() {
  return (
    <section id="commitment" className="relative scroll-mt-20 overflow-hidden bg-page-2 py-20 sm:py-28">
      <span aria-hidden className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className={`${container} relative`}>
        <Reveal from="top">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.25em] text-gold">A SECURE PROCESS FOR A BRIGHTER TOMORROW</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight text-fg sm:text-5xl">Your investment, <span className={goldText}>our commitment</span></h2>
            <p className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-semibold text-fg/55">
              {["Transparent", "Legal", "Secure", "Future ready"].map((w) => <span key={w} className="flex items-center gap-1.5"><FaCircleCheck className="h-3.5 w-3.5 text-gold" />{w}</span>)}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {commitment.map((c, n) => (
            <Reveal key={c.title} from={(["left", "bottom", "right"] as From[])[n]} delay={n * 150} className="relative">
              <article className={`group relative h-full rounded-3xl border-2 bg-surface p-4 pt-8 shadow-[0_25px_50px_-30px_rgba(0,0,0,.5)] transition duration-500 hover:-translate-y-2 ${c.tone === "gold" ? "border-gold/50 hover:border-gold" : "border-accent-light/30 hover:border-accent-light"}`}>
                <span className="absolute -top-6 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-page bg-surface-2 text-lg font-extrabold text-gold-light shadow-lg">{n + 1}</span>
                <div className="text-center">
                  <h3 className="text-2xl font-extrabold text-fg">{c.title}</h3>
                  <p className="text-xs font-bold tracking-[0.2em] text-gold">{c.sub.toUpperCase()}</p>
                </div>
                <HouseFrame src={c.img} alt={c.title} sizes="(min-width:1024px) 30vw, 100vw" tone={c.tone} flip={n === 1} className="mt-5 aspect-[5/4]">
                  <span className={`absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition duration-500 group-hover:rotate-12 ${c.tone === "gold" ? `${goldGrad} text-on-gold` : `${accentGrad} text-white`}`}><c.icon className="h-5 w-5" /></span>
                </HouseFrame>
                <p className="px-2 pb-2 pt-5 text-center text-sm leading-relaxed text-fg/65">{c.text}</p>
              </article>
              {n < 2 && (
                <span aria-hidden className={`${goldGrad} absolute -right-6 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-on-gold shadow-lg animate-[nudge_1.6s_ease-in-out_infinite] lg:flex`}><FaChevronRight className="h-4 w-4" /></span>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal from="bottom"><p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-fg/50">Buyback terms apply only as written in your signed agreement. Please read it in full and have it reviewed by an independent advocate before making any payment.</p></Reveal>
      </div>
    </section>
  );
}

/* ================= Our vision ================= */
function Vision() {
  return (
    <section id="vision" className="relative scroll-mt-20 overflow-hidden bg-page py-20 sm:py-28">
      <div className={`${container} grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]`}>
        {/* frame collage */}
        <Reveal from="left" className="relative mx-auto w-full max-w-lg pb-10 sm:pr-16">
          <Ring className="-top-5 left-[40%] h-7 w-7 border-[3px]" />
          <HouseFrame src={IMAGES.vision.main} alt="City skyline at dusk" sizes="(min-width:1024px) 40vw, 100vw" tone="gold" className="aspect-[4/4.5]">
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-6 pt-24">
              <p className={`${script.className} text-4xl leading-tight text-gold-light`}>Building today, creating generations.</p>
            </div>
          </HouseFrame>
          <Reveal from="top" delay={400} className="absolute right-0 top-[12%] hidden w-[36%] sm:block">
            <Frame src={IMAGES.vision.small1} tone="blue" className="aspect-[4/3.4] animate-[float_6s_ease-in-out_infinite]" />
          </Reveal>
          <Reveal from="bottom" delay={600} className="absolute bottom-24 right-2 hidden w-[30%] sm:block">
            <Frame src={IMAGES.vision.small2} tone="gold" className="aspect-square animate-[float_7s_ease-in-out_1s_infinite]" />
          </Reveal>
          <div className="absolute -bottom-2 left-6 z-10 flex items-center gap-3 rounded-2xl border border-gold/50 bg-surface px-5 py-3 shadow-xl">
            <span className={`${goldGrad} flex h-10 w-10 items-center justify-center rounded-xl text-on-gold`}><FaAward className="h-5 w-5" /></span>
            <span><span className="block text-sm font-extrabold text-fg">An institution</span><span className="block text-xs text-fg/55">built for tomorrow</span></span>
          </div>
        </Reveal>

        {/* text */}
        <div>
          <Reveal from="right">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-gold"><span className={`${goldGrad} h-0.5 w-6 rounded-full`} />Our vision</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-fg sm:text-[2.6rem]">
              We are not building a company for today. We are building an <span className={goldText}>institution</span> for tomorrow.
            </h2>
            <p className="mt-4 flex items-center gap-2 text-fg/60"><FaQuoteLeft className="h-4 w-4 text-gold" /> Our vision is clear:</p>
          </Reveal>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {vision.map(([k, v], n) => (
              <Reveal key={k} from={n % 2 ? "right" : "left"} delay={n * 80}>
                <li className={`group flex h-full items-center gap-3 rounded-2xl border bg-surface p-3.5 transition duration-300 hover:-translate-y-1 hover:shadow-lg ${n % 2 ? "border-accent-light/25 hover:border-accent-light" : "border-gold/40 hover:border-gold"}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:rotate-12 ${n % 2 ? "bg-accent/15 text-accent-light" : "bg-gold/10 text-gold"}`}><FaCircleCheck className="h-4 w-4" /></span>
                  <span className="text-sm text-fg/65"><b className={`block text-base font-extrabold ${n % 2 ? "text-accent-light" : "text-gold"}`}>{k}</b>{v}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ================= Rewards marquee ================= */
function RewardsMarquee() {
  const Row = ({ reverse }: { reverse?: boolean }) => {
    const items = reverse ? [...rewardsGallery].reverse() : rewardsGallery;
    return (
      <div className="group overflow-hidden">
        <div className={`flex w-max gap-5 group-hover:[animation-play-state:paused] ${reverse ? "animate-[marqueeRev_50s_linear_infinite]" : "animate-[marquee_50s_linear_infinite]"}`}>
          {[...items, ...items].map((r, n) => (
            <Frame key={n} src={r.img} tone={n % 2 ? "blue" : "gold"} className="h-44 w-64 shrink-0 sm:h-52 sm:w-80" sizes="320px">
              <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/85 to-transparent p-4 pt-10 text-sm font-bold text-white"><FaGift className="h-3.5 w-3.5 text-gold-light" />{r.label}</span>
            </Frame>
          ))}
        </div>
      </div>
    );
  };
  return (
    <section className="overflow-hidden bg-page-2 py-20 sm:py-24">
      <div className={container}>
        <Reveal from="top"><Heading center eyebrow="Rewards that match your effort" title="Trips, plots, villas and cars" text="Every tier unlocks a reward on top of your commission." /></Reveal>
      </div>
      <div className="mt-12 space-y-5">
        <Reveal from="left"><Row /></Reveal>
        <Reveal from="right" delay={150}><Row reverse /></Reveal>
      </div>
    </section>
  );
}

/* ================= Page ================= */
export default function VisionPage() {
  return (
    <div className={`${font.className} min-h-screen overflow-x-hidden bg-page text-fg antialiased`}>
      <style>{`
        @keyframes navIn { from { transform: translateY(-100%); opacity: 0; } to { transform: none; opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes marqueeRev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        @keyframes nudge { 0%,100% { transform: translate(0,-50%); } 50% { transform: translate(6px,-50%); } }
        html { scroll-behavior: smooth; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 26px; width: 26px; border-radius: 9999px; background: linear-gradient(135deg,var(--color-gold-light),var(--color-gold-deep)); border: 4px solid var(--color-page); box-shadow: 0 4px 14px rgba(0,0,0,.5); cursor: pointer; }
        input[type=range]::-moz-range-thumb { height: 20px; width: 20px; border-radius: 9999px; background: linear-gradient(135deg,var(--color-gold-light),var(--color-gold-deep)); border: 4px solid var(--color-page); box-shadow: 0 4px 14px rgba(0,0,0,.5); cursor: pointer; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
      `}</style>
      <main>
        <Hero />
        <HowItWorks />
        <Tiers />
        <Calculator />
        <Commitment />
        <Vision />
        <RewardsMarquee />
      </main>
    </div>
  );
}