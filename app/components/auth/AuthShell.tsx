"use client";

import { InputHTMLAttributes, ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { IconType } from "react-icons";
import { FaCircleCheck, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Logo } from "@/app/components/layout/Logo";

/* ================= Fixed black & gold colours (same look as the Dholera sections) ================= */
export const goldGrad = "bg-[linear-gradient(135deg,#F5D06B_0%,#D4A437_55%,#A87A12_100%)]";
export const goldText = "bg-[linear-gradient(135deg,#F5D06B,#D4A437_60%,#A87A12)] bg-clip-text text-transparent";
export const btnGold = `${goldGrad} inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-black shadow-[0_12px_30px_-10px_rgba(212,164,55,.8)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-10px_rgba(212,164,55,.9)] disabled:pointer-events-none disabled:opacity-60`;
export const btnDark = "inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#D4A437] hover:text-[#F5D06B]";

/* Dummy images — replace with your own photos later */
const pic = (seed: string) => `https://picsum.photos/seed/${seed}/900/1000`;


/* ================= Small helpers ================= */
function Photo({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="absolute inset-0 bg-[linear-gradient(135deg,#1a1a1a_0%,#0d0d0d_100%)]">
      {ok && <Image src={src} alt={alt} fill sizes="(min-width:1024px) 40vw, 90vw" unoptimized onError={() => setOk(false)} className="object-cover" />}
    </div>
  );
}

type From = "left" | "right" | "top" | "bottom";
const hidden: Record<From, string> = {
  left: "-translate-x-16 opacity-0",
  right: "translate-x-16 opacity-0",
  top: "-translate-y-12 opacity-0",
  bottom: "translate-y-12 opacity-0",
};

/** Slides in from a side once mounted. */
export function SlideIn({ children, from = "bottom", delay = 0, className = "" }: { children: ReactNode; from?: From; delay?: number; className?: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), 30);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ transitionDelay: `${delay}ms` }} className={`transition-all duration-[900ms] ease-[cubic-bezier(.22,.8,.2,1)] ${on ? "translate-x-0 translate-y-0 opacity-100" : hidden[from]} ${className}`}>
      {children}
    </div>
  );
}

/* ================= Form field ================= */
type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; icon: IconType; error?: string };

export function Field({ label, icon: I, error, type = "text", id, ...rest }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className="mb-1 block sm:mb-1.5 text-xs font-bold tracking-[0.12em] text-white/70">{label}</label>
      <div className={`group flex items-center gap-3 rounded-xl border bg-black/40 px-4 transition focus-within:border-[#D4A437] focus-within:shadow-[0_0_0_4px_rgba(212,164,55,.15)] ${error ? "border-rose-400/70" : "border-white/10"}`}>
        <I className="h-4 w-4 shrink-0 text-white/40 transition group-focus-within:text-[#D4A437]" />
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/35 !outline-none sm:py-3.5"
          {...rest}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="text-white/45 transition hover:text-[#F5D06B]">
            {show ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p id={`${id}-err`} className="mt-1.5 text-xs text-rose-300">{error}</p>}
    </div>
  );
}

/* ================= Page shell: visual panel + form card ================= */
type ShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  panelTitle: string;
  panelPoints: string[];
  badge: { label: string; value: string };
  slides: string[];
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, subtitle, panelTitle, panelPoints, badge, slides, children }: ShellProps) {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    timer.current = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [slides.length]);

  const words = title.split(" ");

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-black px-3 pb-16 pt-28 text-white sm:px-6 sm:pt-32">
      <style>{`
        @keyframes authFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        @keyframes authShine { 0% { transform: translateX(-100%); } 100% { transform: translateX(320%); } }
        @keyframes authFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes authZoom { from { transform: scale(1); } to { transform: scale(1.12); } }
        @media (prefers-reduced-motion: reduce) { .auth-anim, .auth-anim * { animation: none !important; transition: none !important; } }
      `}</style>

      {/* page background: gold + green glows and a faint grid */}
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[.07] [background-image:linear-gradient(#D4A437_1px,transparent_1px),linear-gradient(90deg,#D4A437_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <span aria-hidden className="pointer-events-none absolute -left-40 top-20 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#D4A437]/20 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#1F8A62]/15 blur-3xl" />

      <SlideIn from="bottom" className="auth-anim">
        {/* one card — the border light travels around it */}
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] p-[1.5px] shadow-[0_50px_100px_-40px_rgba(212,164,55,.45)] sm:rounded-[2.5rem]">
          <span aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 animate-[spin_9s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,#F5D06B_50deg,#D4A437_80deg,transparent_140deg,transparent_200deg,#1F8A62_250deg,transparent_310deg)]" />
          <span aria-hidden className="absolute inset-0 bg-[#D4A437]/15" />

          <div className="relative grid overflow-hidden rounded-[calc(2rem-1.5px)] bg-[#0B0B0B] sm:rounded-[calc(2.5rem-1.5px)] lg:grid-cols-[1.05fr_1fr]">
            {/* ---------- visual side: photo melts into the form ---------- */}
            <div className="relative min-h-[260px] overflow-hidden lg:min-h-[640px]">
              {slides.map((s, n) => (
                <div key={s} aria-hidden={n !== i} className={`absolute inset-0 transition-opacity duration-[1400ms] ${n === i ? "opacity-100" : "opacity-0"}`}>
                  <div key={n === i ? `on-${i}` : "off"} className={`absolute inset-0 ${n === i ? "animate-[authZoom_10s_ease-out_both]" : ""}`}>
                    <Photo src={s} alt="" />
                  </div>
                </div>
              ))}
              {/* fades: darken for text, then blend into the form (down on phone, right on desktop) */}
              <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.35)_55%,rgba(0,0,0,.6)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent lg:hidden" />
              <div className="absolute inset-y-0 right-0 hidden w-2/3 bg-gradient-to-l from-[#0B0B0B] via-[#0B0B0B]/60 to-transparent lg:block" />
              <span aria-hidden className="pointer-events-none absolute -left-10 top-1/3 h-56 w-56 rounded-full bg-[#D4A437]/25 blur-3xl" />

              <div className="relative flex h-full flex-col p-6 sm:p-10">
                <SlideIn from="top">
                  <div className="inline-flex rounded-2xl bg-white/95 px-3 py-1.5 shadow-[0_10px_30px_-10px_rgba(212,164,55,.7)] sm:px-4 sm:py-2">
                    <Logo />
                  </div>
                </SlideIn>

                <SlideIn from="left" delay={200} className="mt-6 lg:mt-auto">
                  <h2 className="max-w-sm text-2xl font-extrabold leading-tight sm:text-4xl">
                    {panelTitle.split(" ").slice(0, -2).join(" ")} <span className={goldText}>{panelTitle.split(" ").slice(-2).join(" ")}</span>
                  </h2>
                </SlideIn>

                <ul className="mt-5 hidden space-y-3 sm:block">
                  {panelPoints.map((p, n) => (
                    <SlideIn key={p} from="left" delay={350 + n * 120}>
                      <li className="flex items-center gap-3 text-sm text-white/85">
                        <span className={`${goldGrad} flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-black shadow-[0_0_14px_rgba(212,164,55,.6)]`}><FaCircleCheck className="h-3 w-3" /></span>
                        {p}
                      </li>
                    </SlideIn>
                  ))}
                </ul>

                <div className="mt-8 hidden items-center gap-4 lg:flex">
                  <div className={`${goldGrad} rounded-2xl px-5 py-3 text-black shadow-[0_18px_40px_-12px_rgba(212,164,55,.8)] animate-[authFloat_6s_ease-in-out_infinite]`}>
                    <p className="text-xs font-semibold">{badge.label}</p>
                    <p className="text-2xl font-extrabold">{badge.value}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {slides.map((_, n) => (
                      <button key={n} onClick={() => setI(n)} aria-label={`Show image ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? `${goldGrad} w-7` : "w-1.5 bg-white/40"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ---------- form side ---------- */}
            <div className="relative px-5 pb-8 pt-2 sm:px-10 sm:pb-10 lg:py-12">
              <span aria-hidden className="pointer-events-none absolute right-8 top-8 hidden h-20 w-20 rounded-full border border-dashed border-[#D4A437]/40 animate-[spin_24s_linear_infinite] sm:block" />
              <SlideIn from="right" delay={250}>
                <p className="text-xs font-bold tracking-[0.25em] text-[#D4A437]">{eyebrow.toUpperCase()}</p>
                <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
                  {words.slice(0, -1).join(" ")} <span className={goldText}>{words.slice(-1)}</span>
                </h1>
                <p className="mt-2 text-sm text-white/60">{subtitle}</p>
                <span className="relative mt-5 block h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                  <span className={`${goldGrad} absolute inset-y-0 left-0 w-1/4 animate-[authShine_3s_ease-in-out_infinite]`} />
                </span>
                <div className="relative mt-6">{children}</div>
              </SlideIn>
            </div>
          </div>
        </div>
      </SlideIn>
    </main>
  );
}

export { pic as authPic };
