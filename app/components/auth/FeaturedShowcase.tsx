"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaLocationDot, FaFileSignature, FaFileContract, FaStamp, FaMapLocationDot, FaIndianRupeeSign, FaCarSide } from "react-icons/fa6";
import { serif } from "./fonts";
import { inr, plots } from "./plots";

const goldText = "bg-[linear-gradient(135deg,#F5D06B,#D4A437_60%,#A87A12)] bg-clip-text text-transparent";

function Photo({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#2a1f06,#050807)]">
      {ok && <Image src={src} alt={alt} fill sizes="65vw" unoptimized onError={() => setOk(false)} className="object-cover" />}
    </div>
  );
}

const stats = [
  { icon: FaIndianRupeeSign, value: "₹6.5 L", label: "Plots start from", text: "Fractional options from 50 sq yd, full plots from 100 sq yd." },
  { icon: FaStamp, value: "100%", label: "Registry in your name", text: "The sale deed is registered to you on full payment." },
  { icon: FaCarSide, value: "Free", label: "Site visit", text: "See the land and every document before you pay any token." },
];

const trust = [
  { icon: FaFileSignature, text: "Clear title" },
  { icon: FaFileContract, text: "Written agreement" },
  { icon: FaStamp, text: "Registry in your name" },
  { icon: FaMapLocationDot, text: "Free site visit" },
];

/* padding that shrinks with viewport height */
const pad = "p-[clamp(1.25rem,3.5vh,2.25rem)]";
const padX = "px-[clamp(1.25rem,3.5vh,2.25rem)]";

/* ================= Desktop right side: hero photo card + three stat cards ================= */
export function FeaturedShowcase() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % plots.length), 6000);
    return () => clearInterval(t);
  }, []);
  const p = plots[i];

  return (
    <section aria-label="United Legacy Infra plots" className="flex h-full min-h-0 flex-col gap-[clamp(0.75rem,1.8vh,1rem)]">
      {/* hero card — no min-h-0, so it never shrinks below its content */}
      <div className="relative isolate flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-[#D4A437]/25">
        {plots.map((pl, n) => (
          <div key={pl.size} aria-hidden={n !== i} className={`absolute inset-0 -z-20 transition-opacity duration-[1400ms] ${n === i ? "opacity-100" : "opacity-0"}`}>
            <div key={n === i ? `on-${i}` : "off"} className={`absolute inset-0 ${n === i ? "animate-[showZoom_10s_ease-out_both]" : ""}`}>
              <Photo src={pl.img} alt={`${pl.size} plot`} />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(5,8,7,.94)_0%,rgba(5,8,7,.72)_45%,rgba(5,8,7,.35)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#050807]/90 to-transparent" />

        {/* top row */}
        <div className={`flex items-start justify-between gap-4 ${pad}`}>
          <span className="rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur">Verified plots for sale</span>
          <Link href="/home" className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm font-semibold text-white/85 backdrop-blur transition hover:border-[#D4A437] hover:text-[#F5D06B]">
            <FaArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>

        {/* headline */}
        <div className={padX}>
          <h2 className={`${serif.className} max-w-2xl text-[clamp(2.5rem,8vh,4rem)] font-bold leading-[1.05] text-white`}>
            Own land, <br />build your <span className={goldText}>legacy.</span>
          </h2>
          <p className="mt-[clamp(0.75rem,2vh,1.25rem)] max-w-xl text-base leading-relaxed text-white/80 [@media(max-height:600px)]:hidden">
            Every plot comes with a clear title, a written agreement, the registry in your name and a free site visit before you pay any token.
          </p>

          <ul className="mt-[clamp(1rem,3vh,2rem)] flex max-w-2xl flex-wrap gap-2.5 [@media(max-height:680px)]:hidden">
            {trust.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 rounded-full border border-[#D4A437]/30 bg-black/35 px-3.5 py-1.5 text-sm font-semibold text-white/85 backdrop-blur">
                <Icon className="h-3.5 w-3.5 text-[#D4A437]" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* price block */}
        <div className={`mt-auto flex items-end justify-between gap-4 ${pad}`}>
          <div className="flex gap-1.5">
            {plots.map((_, n) => (
              <button key={n} onClick={() => setI(n)} aria-label={`Show plot ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? "w-7 bg-[#D4A437]" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
          <div key={i} className="animate-[appFade_.6s_ease-out_both] text-right">
            <p className={`${serif.className} text-[clamp(1.75rem,4.5vh,2.25rem)] font-bold leading-tight text-white`}>{inr(p.total)}</p>
            <p className="mt-1 flex items-center justify-end gap-1.5 text-base font-semibold text-white/90"><FaLocationDot className="h-3.5 w-3.5 text-[#D4A437]" />{p.area}</p>
            <p className="mt-1 text-sm text-white/60">{p.size} · {p.kind}{p.tag ? ` · ${p.tag}` : ""}</p>
          </div>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid shrink-0 grid-cols-3 gap-[clamp(0.75rem,1.8vh,1rem)]">
        {stats.map(({ icon: Icon, value, label, text }, n) => (
          <div
            key={label}
            style={{ animationDelay: `${300 + n * 120}ms` }}
            className="group relative isolate animate-[appFade_.7s_ease-out_both] overflow-hidden rounded-[1.5rem] border border-[#D4A437]/25 bg-[linear-gradient(160deg,rgba(212,164,55,.14),rgba(14,28,22,.9)_55%,rgba(5,8,7,.95))] p-[clamp(0.875rem,2.2vh,1.25rem)] shadow-[0_10px_30px_-12px_rgba(0,0,0,.6)] transition duration-300 hover:-translate-y-1 hover:border-[#D4A437]/60 hover:shadow-[0_18px_40px_-14px_rgba(212,164,55,.35)]"
          >
            {/* gold top hairline */}
            <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#F5D06B]/80 to-transparent" />
            {/* soft glow in corner */}
            <span className="absolute -right-10 -top-10 -z-10 h-32 w-32 rounded-full bg-[#D4A437]/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
            {/* watermark icon */}
            <Icon className="absolute -bottom-3 -right-2 -z-10 h-20 w-20 text-[#D4A437]/[0.07] transition duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:text-[#D4A437]/[0.12]" />
            {/* shine sweep on hover */}
            <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-[450%]" />

            <div className="flex items-center justify-between gap-3">
              <p className={`${serif.className} text-[clamp(1.5rem,3.6vh,1.875rem)] font-bold leading-tight ${n === 0 ? goldText : "text-white"}`}>{value}</p>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#D4A437]/40 bg-[linear-gradient(135deg,rgba(245,208,107,.25),rgba(168,122,18,.1))] shadow-[inset_0_1px_0_rgba(255,255,255,.15)] transition duration-300 group-hover:scale-110 group-hover:border-[#F5D06B]">
                <Icon className="h-4 w-4 text-[#F5D06B]" />
              </span>
            </div>
            <p className="mt-1 text-sm font-bold tracking-wide text-[#F5D06B]">{label}</p>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60 [@media(max-height:640px)]:hidden">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}