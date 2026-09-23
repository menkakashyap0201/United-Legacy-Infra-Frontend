"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaLocationDot } from "react-icons/fa6";
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
  { value: "₹6.5 L", label: "Plots start from", text: "Fractional options from 50 sq yd, full plots from 100 sq yd." },
  { value: "100%", label: "Registry in your name", text: "The sale deed is registered to you on full payment." },
  { value: "Free", label: "Site visit", text: "See the land and every document before you pay any token." },
];

/* ================= Desktop right side: hero photo card + three stat cards ================= */
export function FeaturedShowcase() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % plots.length), 6000);
    return () => clearInterval(t);
  }, []);
  const p = plots[i];

  return (
    <section aria-label="United Legacy Infra plots" className="flex h-full min-h-0 flex-col gap-4">
      {/* hero card */}
      <div className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-[#D4A437]/25">
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
        <div className="flex items-start justify-between gap-4 p-7 xl:p-9">
          <span className="rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur">Verified plots for sale</span>
          <Link href="/home" className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-sm font-semibold text-white/85 backdrop-blur transition hover:border-[#D4A437] hover:text-[#F5D06B]">
            <FaArrowLeft className="h-3 w-3" /> Back to home
          </Link>
        </div>

        {/* headline */}
        <div className="px-7 xl:px-9">
          <h2 className={`${serif.className} max-w-2xl text-5xl font-bold leading-[1.05] text-white xl:text-6xl`}>
            Own land, <br />build your <span className={goldText}>legacy.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80">
            Every plot comes with a clear title, a written agreement, the registry in your name and a free site visit before you pay any token.
          </p>
        </div>

        {/* price block */}
        <div className="mt-auto flex items-end justify-between gap-4 p-7 xl:p-9">
          <div className="flex gap-1.5">
            {plots.map((_, n) => (
              <button key={n} onClick={() => setI(n)} aria-label={`Show plot ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? "w-7 bg-[#D4A437]" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
          <div key={i} className="animate-[appFade_.6s_ease-out_both] text-right">
            <p className={`${serif.className} text-4xl font-bold text-white`}>{inr(p.total)}</p>
            <p className="mt-1 flex items-center justify-end gap-1.5 text-base font-semibold text-white/90"><FaLocationDot className="h-3.5 w-3.5 text-[#D4A437]" />{p.area}</p>
            <p className="mt-1 text-sm text-white/60">{p.size} · {p.kind}{p.tag ? ` · ${p.tag}` : ""}</p>
          </div>
        </div>
      </div>

      {/* stat cards */}
      <div className="grid shrink-0 grid-cols-3 gap-4">
        {stats.map((s, n) => (
          <div
            key={s.label}
            style={{ animationDelay: `${300 + n * 120}ms` }}
            className="animate-[appFade_.7s_ease-out_both] rounded-[1.5rem] border border-[#D4A437]/25 bg-[linear-gradient(160deg,rgba(212,164,55,.12),rgba(14,28,22,.85))] p-5 transition hover:-translate-y-1 hover:border-[#D4A437]/60"
          >
            <p className={`${serif.className} text-3xl font-bold text-white`}>{s.value}</p>
            <p className="mt-1 text-sm font-bold text-[#F5D06B]">{s.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}