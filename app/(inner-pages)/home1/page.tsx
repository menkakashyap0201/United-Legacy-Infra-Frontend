"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FaArrowRight, FaArrowTrendUp, FaChartLine, FaCheck, FaCoins, FaGift, FaShareNodes, FaSitemap,
  FaUser, FaUsers, FaWallet, FaClockRotateLeft, FaAward, FaChevronDown,
} from "react-icons/fa6";
import { goldGrad, goldText, labelCls } from "@/app/components/auth/ui";
import { CP_RANKS, DIRECT_INCOME, ROI_PERCENT, getCpRank, shortRupees } from "@/app/(inner-pages)/plc/Plan";
import CopyButton, { copyText } from "@/app/components/auth/CopyButton";
import { getUser } from "@/app/lib/auth/token";
import { AuthUser } from "@/app/types/auth.types";

/* ================= Helpers ================= */
const num = (v?: string | number) => Number(v ?? 0) || 0;
const rupees = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

/* DEMO activity — API aane pe hata dena */
const ACTIVITY = [
  { icon: FaCoins, title: "ROI credited", sub: "Premium Plot · Sep 2026", amount: "+₹1,000", tone: "text-emerald-600" },
  { icon: FaUsers, title: "New direct joined", sub: "Rohit Sharma · West", amount: "", tone: "" },
  { icon: FaWallet, title: "Withdrawal approved", sub: "UPI · 20 Sep 2026", amount: "−₹1,500", tone: "text-[#0B1D45]" },
];

const ACTIONS: { href: string; label: string; Icon: IconType }[] = [
  { href: "/investment", label: "Invest", Icon: FaChartLine },
  { href: "/withdraw", label: "Withdraw", Icon: FaWallet },
  { href: "/plc", label: "My team", Icon: FaSitemap },
  { href: "/profile", label: "Profile", Icon: FaUser },
];

export default function HomePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hello, setHello] = useState("Welcome");
  const [origin, setOrigin] = useState("");
  const [shared, setShared] = useState(false);
  const [showRanks, setShowRanks] = useState(false);

  // localStorage / window sirf browser me
  useEffect(() => {
    setUser(getUser());
    setHello(greeting());
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!shared) return;
    const t = setTimeout(() => setShared(false), 1800);
    return () => clearTimeout(t);
  }, [shared]);

  const first = user?.name?.trim().split(/\s+/)[0] ?? "";
  const code = user?.referal_code ?? "";
  const active = user?.status === 1;

  const income = { roi: num(user?.roi_income), direct: num(user?.direct_income), level: num(user?.level_income) };
  const earnings = income.roi + income.direct + income.level;
  const withdrawn = num(user?.total_withdraw);
  const available = Math.max(0, earnings - withdrawn);
  const invested = num(user?.total_investment);
  const west = num(user?.left_business);
  const east = num(user?.right_business);
  const westPct = west + east > 0 ? (west / (west + east)) * 100 : 50;

  // C.P rank — total business (West + East) pe
  const cp = getCpRank(west + east);

  const inviteLink = code && origin ? `${origin}/register?ref=${code}` : "";

  const share = async () => {
    if (!inviteLink) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: "United Legacy Infra", text: `Join me on United Legacy Infra. Use my referral code ${code}.`, url: inviteLink });
        return;
      } catch {
        /* user ne cancel kiya — copy fallback */
      }
    }
    if (await copyText(inviteLink)) setShared(true);
  };

  return (
    <div className="grid gap-5">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(145deg,#0B1D45_0%,#12296A_60%,#0B1D45_100%)] p-5 text-white shadow-[0_24px_40px_-20px_rgba(11,29,69,.9)]">
        <span aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#D4A437]/25 blur-2xl" />
        <span aria-hidden className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-[#D4A437]/10 blur-2xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/60">{hello},</p>
            <p className="truncate text-xl font-extrabold">{first || "Member"}</p>
          </div>
          <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${active ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-amber-400"}`} />
            {active ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="relative mt-5 text-[10px] font-extrabold tracking-[0.22em] text-[#F5D06B]">TOTAL EARNINGS</p>
        <p className="relative mt-1 text-4xl font-extrabold tracking-tight">{rupees(earnings)}</p>
        <p className="relative mt-1 flex items-center gap-1.5 text-xs text-white/60">
          <FaArrowTrendUp className="h-3 w-3 text-emerald-300" /> Available to withdraw {rupees(available)}
        </p>

        <div className="relative mt-5 grid grid-cols-2 gap-2">
          <Link href="/withdraw" className={`${goldGrad} inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-extrabold text-[#0B1D45] shadow-[0_10px_24px_-10px_rgba(212,164,55,.95)] transition hover:-translate-y-0.5`}>
            <FaWallet className="h-3.5 w-3.5" /> Withdraw
          </Link>
          <Link href="/investment" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 py-3 text-sm font-bold text-white transition hover:border-[#D4A437] hover:text-[#F5D06B]">
            <FaChartLine className="h-3.5 w-3.5" /> Invest
          </Link>
        </div>
      </section>

      {/* ================= Quick actions ================= */}
      <nav aria-label="Quick actions" className="grid grid-cols-4 gap-2">
        {ACTIONS.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className="group flex flex-col items-center gap-1.5 rounded-2xl border border-[#0B1D45]/8 bg-white/80 py-3 transition hover:-translate-y-0.5 hover:border-[#D4A437]/60">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FFF8E6] text-[#A87A12] transition group-hover:bg-[#0B1D45] group-hover:text-[#F5D06B]">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold text-[#0B1D45]/75">{label}</span>
          </Link>
        ))}
      </nav>

      {/* ================= Stats ================= */}
      <section className="grid grid-cols-2 gap-3">
        {[
          { label: "INVESTED", value: rupees(invested), Icon: FaChartLine },
          { label: "WITHDRAWN", value: rupees(withdrawn), Icon: FaWallet },
          { label: "DIRECT TEAM", value: String(user?.total_direct ?? 0), Icon: FaUsers },
          { label: "TOTAL BUSINESS", value: rupees(west + east), Icon: FaSitemap },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl border border-[#0B1D45]/8 bg-white p-3.5 shadow-[0_1px_0_rgba(11,29,69,.04)]">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-extrabold tracking-[0.18em] text-[#0B1D45]/45">{label}</p>
              <Icon className="h-3.5 w-3.5 text-[#D4A437]" />
            </div>
            <p className="mt-1.5 truncate text-lg font-extrabold text-[#0B1D45]">{value}</p>
          </div>
        ))}
      </section>

      {/* ================= Income breakdown ================= */}
      <section className="rounded-2xl border border-[#D4A437]/35 bg-white/80 p-4">
        <p className={labelCls}>INCOME BREAKDOWN</p>
        <div className="mt-2 grid gap-3">
          {[
            { label: `ROI income · ${ROI_PERCENT}% monthly`, value: income.roi, bar: "bg-[#0B1D45]" },
            { label: `Direct income · ${DIRECT_INCOME.min}–${DIRECT_INCOME.max}%`, value: income.direct, bar: goldGrad },
            { label: "Level income", value: income.level, bar: "bg-[#A87A12]" },
          ].map(({ label, value, bar }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#0B1D45]/70">{label}</span>
                <span className="font-bold text-[#0B1D45]">{rupees(value)}</span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#0B1D45]/8">
                <div className={`${bar} h-full rounded-full transition-all duration-700`} style={{ width: `${earnings ? Math.max(4, (value / earnings) * 100) : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= West vs East ================= */}
      <section className="rounded-2xl border border-[#0B1D45]/8 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className={labelCls}>WEST vs EAST BUSINESS</p>
          <Link href="/plc" className="flex items-center gap-1 text-xs font-bold text-[#A87A12] hover:underline">
            View tree <FaArrowRight className="h-2.5 w-2.5" />
          </Link>
        </div>
        <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-[#0B1D45]/8">
          <div className="h-full bg-[#0B1D45] transition-all duration-700" style={{ width: `${westPct}%` }} />
          <div className={`${goldGrad} h-full flex-1`} />
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#0B1D45]" /><span className="font-semibold text-[#0B1D45]/60">West</span> <b className="text-[#0B1D45]">{rupees(west)}</b></span>
          <span className="flex items-center gap-1.5"><b className="text-[#0B1D45]">{rupees(east)}</b> <span className="font-semibold text-[#0B1D45]/60">East</span><span className={`${goldGrad} h-2.5 w-2.5 rounded-full`} /></span>
        </div>
      </section>

      {/* ================= Channel Partner rank ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-[#D4A437]/40 bg-white p-4 shadow-[0_14px_30px_-18px_rgba(212,164,55,.7)]">
        <span aria-hidden className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A437]/15 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <span className={`${cp.current ? goldGrad : "bg-[#0B1D45]/8"} grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${cp.current ? "text-[#0B1D45] shadow-[0_10px_24px_-10px_rgba(212,164,55,.9)]" : "text-[#0B1D45]/35"}`}>
            <FaAward className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-extrabold tracking-[0.18em] text-[#0B1D45]/45">CHANNEL PARTNER RANK</p>
            <p className="truncate text-base font-extrabold text-[#0B1D45]">{cp.current?.title ?? "Not ranked yet"}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-extrabold text-[#A87A12]">{cp.current ? `${cp.current.percent}%` : "—"}</p>
            <p className="text-[9px] font-bold tracking-wider text-[#0B1D45]/45">COMMISSION</p>
          </div>
        </div>

        {cp.next ? (
          <>
            <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-[#0B1D45]/8">
              <div className={`${goldGrad} h-full rounded-full transition-all duration-700`} style={{ width: `${Math.max(2, cp.progress)}%` }} />
            </div>
            <p className="relative mt-1.5 text-xs text-[#0B1D45]/60">
              <b className="text-[#0B1D45]">{shortRupees(cp.remaining)}</b> more business to become <b className="text-[#A87A12]">{cp.next.title}</b> ({cp.next.percent}%)
            </p>
          </>
        ) : (
          <p className="relative mt-3 text-xs font-semibold text-emerald-600">You have reached the highest rank.</p>
        )}

        <button
          type="button"
          onClick={() => setShowRanks((v) => !v)}
          aria-expanded={showRanks}
          className="relative mt-3 flex w-full items-center justify-center gap-1.5 text-xs font-bold text-[#A87A12]"
        >
          {showRanks ? "Hide" : "View"} all ranks <FaChevronDown className={`h-2.5 w-2.5 transition-transform ${showRanks ? "rotate-180" : ""}`} />
        </button>

        {showRanks && (
          <div className="relative mt-2 animate-[appFade_.35s_ease-out_both] overflow-hidden rounded-xl border border-[#0B1D45]/10">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-[#0B1D45] px-3 py-2 text-[9px] font-extrabold tracking-[0.15em] text-[#F5D06B]">
              <span>TITLE</span><span>TARGET</span><span className="w-10 text-right">%</span>
            </div>
            {CP_RANKS.map((r, i) => {
              const mine = i === cp.index;
              const reached = i <= cp.index;
              return (
                <div key={r.title} className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-[#0B1D45]/5 px-3 py-2 text-xs ${mine ? "bg-[#FFF8E6]" : "bg-white"}`}>
                  <span className={`flex min-w-0 items-center gap-1.5 font-bold ${reached ? "text-[#0B1D45]" : "text-[#0B1D45]/55"}`}>
                    {reached && <FaCheck className="h-2.5 w-2.5 shrink-0 text-emerald-600" />}
                    <span className="truncate">{r.title}</span>
                  </span>
                  <span className="whitespace-nowrap text-[#0B1D45]/55">{shortRupees(r.from)} – {shortRupees(r.to)}</span>
                  <span className="w-10 text-right font-extrabold text-[#A87A12]">{r.percent}%</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ================= Invite ================= */}
      {code && (
        <section className={`${goldGrad} relative overflow-hidden rounded-3xl p-5 text-[#0B1D45] shadow-[0_20px_40px_-20px_rgba(212,164,55,.9)]`}>
          <span aria-hidden className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
          <FaGift aria-hidden className="absolute bottom-4 right-5 h-16 w-16 text-white/25" />
          <p className="relative text-lg font-extrabold">Invite &amp; earn</p>
          <p className="relative mt-0.5 max-w-[15rem] text-xs text-[#0B1D45]/70">Share your code. Earn direct income when your friends invest.</p>
          <div className="relative mt-3 flex items-center gap-1 rounded-xl bg-white/70 px-3 py-1.5 backdrop-blur">
            <span className="min-w-0 flex-1 truncate font-mono text-sm font-extrabold tracking-wider">{code}</span>
            <CopyButton value={code} label="Copy referral code" />
          </div>
          <button type="button" onClick={share} className="relative mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0B1D45] py-3 text-sm font-bold text-white transition hover:bg-[#12296A]">
            {shared ? <><FaCheck className="h-3.5 w-3.5 text-emerald-300" /> Link copied</> : <><FaShareNodes className="h-3.5 w-3.5" /> Share invite link</>}
          </button>
        </section>
      )}

      {/* ================= Recent activity (demo) ================= */}
      <section>
        <p className={`${labelCls} flex items-center gap-1.5`}><FaClockRotateLeft className="h-3 w-3" /> RECENT ACTIVITY</p>
        <ul className="grid gap-2">
          {ACTIVITY.map(({ icon: Icon, title, sub, amount, tone }) => (
            <li key={title} className="flex items-center gap-3 rounded-xl border border-[#0B1D45]/8 bg-white px-3.5 py-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FFF8E6] text-[#A87A12]"><Icon className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0B1D45]">{title}</p>
                <p className="truncate text-xs text-[#0B1D45]/50">{sub}</p>
              </div>
              {amount && <span className={`shrink-0 text-sm font-extrabold ${tone}`}>{amount}</span>}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-[11px] text-[#0B1D45]/40">
        United Legacy <span className={goldText}>·</span> Registry in your name
      </p>
    </div>
  );
}