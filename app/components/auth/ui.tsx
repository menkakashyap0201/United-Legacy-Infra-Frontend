"use client";

import { InputHTMLAttributes, KeyboardEvent, ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import { FaCheck, FaChevronDown, FaEye, FaEyeSlash, FaSitemap } from "react-icons/fa6";
import { serif } from "./fonts";

/* ================= Shared styles for /register, /login and /forgot-password ================= */
export const goldGrad = "bg-[linear-gradient(135deg,#F5D06B_0%,#D4A437_55%,#A87A12_100%)]";
export const goldText = "bg-[linear-gradient(135deg,#D4A437,#A87A12)] bg-clip-text text-transparent";
export const btnNavy = "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B1D45] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_-12px_rgba(11,29,69,.7)] transition hover:-translate-y-0.5 hover:bg-[#12296A] disabled:opacity-60";
export const btnOutline = "inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#0B1D45]/20 bg-white/70 px-6 py-3.5 text-sm font-bold text-[#0B1D45] transition hover:border-[#D4A437] hover:text-[#A87A12]";
export const labelCls = "mb-1 block text-[11px] font-bold tracking-[0.12em] text-[#0B1D45]/70";
export const boxCls = "group flex items-center gap-3 rounded-xl border bg-white px-3.5 shadow-[0_1px_0_rgba(11,29,69,.04)] transition focus-within:border-[#D4A437] focus-within:shadow-[0_0_0_4px_rgba(212,164,55,.18)]";
export const linkGold = "font-bold text-[#A87A12] underline-offset-4 hover:underline";

/* ================= Card with centred logo ================= */
export function AuthCard({ top, title, sub, children }: { top?: ReactNode; title: ReactNode; sub?: string; children: ReactNode }) {
  return (
    <div className="relative h-full overflow-hidden rounded-[2.25rem] border border-[#D4A437]/40 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBF0_45%,#F8ECCB_100%)] text-[#0B1D45] shadow-[0_40px_80px_-30px_rgba(212,164,55,.45)]">
      {/* soft decorations */}
      <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D4A437]/15 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#D4A437]/15 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute right-7 top-24 h-3 w-3 rounded-full border-2 border-[#D4A437]/70" />
      <span aria-hidden className="pointer-events-none absolute left-8 top-40 h-5 w-5 animate-[float_6s_ease-in-out_infinite] rounded-full border-2 border-[#D4A437]/50" />

      <div className="no-scrollbar relative h-full overflow-y-auto">
        <div className="flex min-h-full flex-col px-6 pb-7 pt-5 sm:px-9 sm:pt-6">
          {/* optional top row (e.g. back link on login) — keeps the logo centred either way */}
          {top ? <div className="mb-1 flex h-9 items-center">{top}</div> : <div className="h-3" />}

          {/* centred logo */}
          <Link href="/home" className="group mx-auto flex flex-col items-center text-center">
            <span className="relative flex items-center justify-center">
              <span aria-hidden className="absolute h-24 w-24 rounded-full bg-[#D4A437]/20 blur-xl transition group-hover:bg-[#D4A437]/30" />
              {/* <span aria-hidden className="absolute h-[5.5rem] w-[5.5rem] animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-[#D4A437]/60" /> */}
              <Image src="/logo-b.png" alt="United Legacy Infra" width={435} height={233} priority className="relative h-14 w-auto sm:h-16" />
            </span>
            <span className="mt-3 block text-xl font-extrabold tracking-tight text-[#0B1D45]">United Legacy</span>
            <span className="block text-[11px] font-semibold tracking-[0.3em] text-[#A87A12]">INFRA PVT. LTD.</span>
          </Link>

          <div className="mx-auto mt-4 flex w-full items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A437]/50" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[#D4A437]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A437]/50" />
          </div>

          <div className="mt-4 animate-[appFade_.6s_ease-out_both] text-center">
            <h1 className={`${serif.className} text-3xl font-bold leading-tight text-[#0B1D45]`}>{title}</h1>
            {sub && <p className="mx-auto mt-1.5 max-w-xs text-sm text-[#0B1D45]/60">{sub}</p>}
          </div>

          <div className="mt-5 flex flex-1 flex-col animate-[appFade_.7s_ease-out_.1s_both]">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ================= Light input ================= */
type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; icon: IconType; error?: string };

export function Field({ label, icon: I, error, type = "text", id, ...rest }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className={labelCls}>{label}</label>
      <div className={`${boxCls} ${error ? "border-rose-400" : "border-[#0B1D45]/12"}`}>
        <I className="h-4 w-4 shrink-0 text-[#0B1D45]/35 transition group-focus-within:text-[#D4A437]" />
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          className="w-full min-w-0 bg-transparent py-3 text-sm text-[#0B1D45] placeholder:text-[#0B1D45]/35 !outline-none"
          {...rest}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="text-[#0B1D45]/40 transition hover:text-[#A87A12]">
            {show ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

/* ================= Position dropdown (Left / Right) ================= */
export const positions = ["West", "East"] as const;
export type Position = (typeof positions)[number];

export function PositionSelect({ value, onChange, error }: { value: Position | ""; onChange: (v: Position) => void; error?: string }) {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const pick = (p: Position) => { onChange(p); setOpen(false); };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { setOpen(true); setHi(Math.max(0, positions.indexOf(value as Position))); return; }
      setHi((h) => (h + (e.key === "ArrowDown" ? 1 : -1) + positions.length) % positions.length);
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      pick(positions[hi]);
    } else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={wrap} className="relative">
      <p id="position-label" className={labelCls}>PLC</p>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="position-label"
        onClick={() => { setOpen(!open); setHi(Math.max(0, positions.indexOf(value as Position))); }}
        onKeyDown={onKey}
        className={`relative flex w-full items-center gap-3 overflow-hidden rounded-xl border bg-white px-3.5 py-3 text-left text-sm transition ${open ? "border-[#D4A437] shadow-[0_0_0_4px_rgba(212,164,55,.18)]" : error ? "border-rose-400" : "border-[#0B1D45]/12 hover:border-[#0B1D45]/25"}`}
      >
        <FaSitemap className={`h-4 w-4 shrink-0 ${open || value ? "text-[#D4A437]" : "text-[#0B1D45]/35"}`} />
        <span className={`min-w-0 flex-1 truncate whitespace-nowrap ${value ? "text-[#0B1D45]" : "text-[#0B1D45]/35"}`}>{value || "Choose"}</span>
        <FaChevronDown className={`h-3.5 w-3.5 text-[#A87A12] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        <span className={`${goldGrad} absolute inset-x-0 bottom-0 h-[3px] origin-left transition-transform duration-300 ${open ? "scale-x-100" : "scale-x-0"}`} />
      </button>
      <ul
        role="listbox"
        aria-labelledby="position-label"
        className={`absolute inset-x-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-xl border border-[#D4A437]/50 bg-white shadow-[0_20px_40px_-12px_rgba(11,29,69,.35)] transition duration-200 ${open ? "scale-y-100 opacity-100" : "pointer-events-none scale-y-95 opacity-0"}`}
      >
        {positions.map((p, n) => {
          const selected = value === p;
          return (
            <li
              key={p}
              role="option"
              aria-selected={selected}
              onMouseEnter={() => setHi(n)}
              onClick={() => pick(p)}
              className={`flex cursor-pointer items-center gap-2 px-4 py-3 text-sm transition ${n > 0 ? "border-t border-[#0B1D45]/5" : ""} ${selected ? "bg-[#FFF8E6] font-semibold text-[#A87A12]" : hi === n ? "bg-[#0B1D45]/[.04] text-[#0B1D45]" : "text-[#0B1D45]/80"}`}
            >
              {selected && <FaCheck className="h-3 w-3" />}
              {p}
            </li>
          );
        })}
      </ul>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

/* ================= Success block ================= */
export function Success({ title, text, action }: { title: string; text: string; action: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
      <span className="relative flex h-20 w-20 items-center justify-center">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#D4A437]/30" />
        <span className={`${goldGrad} relative flex h-20 w-20 items-center justify-center rounded-full text-[#0B1D45] shadow-[0_0_40px_rgba(212,164,55,.55)]`}><FaCheck className="h-8 w-8" /></span>
      </span>
      <h2 className={`${serif.className} mt-6 text-2xl font-bold text-[#0B1D45]`}>{title}</h2>
      <p className="mt-2 max-w-xs text-sm text-[#0B1D45]/60">{text}</p>
      <div className="mt-7 w-full">{action}</div>
    </div>
  );
}