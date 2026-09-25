"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  FaCalendarCheck, FaChartLine, FaCircleInfo, FaCoins, FaIndianRupeeSign, FaLandmark,
  FaPaperPlane, FaPercent, FaReceipt, FaRotateRight, FaSpinner,
} from "react-icons/fa6";
import { Field, Success, btnNavy, goldGrad, goldText, labelCls } from "@/app/components/auth/ui";
import PageTitle from "@/app/components/InnerPages/layout/PageTitle";
import { getUser } from "@/app/lib/auth/token";
import { AuthUser } from "@/app/types/auth.types";
import {
  ADMIN_CHARGE_PERCENT, ROI_PERCENT, ROI_SCHEDULE, nextRoiDate, ordinal, roiSlotFor, rupees, shortRupees,
} from "@/app/(inner-pages)/plc/Plan";

const QUICK_AMOUNTS = [100000, 500000, 1000000, 5000000];

/* DEMO — "my investments" API aane pe hata dena */
type MyInvestment = { id: string; amount: number; start: string };
const MY_INVESTMENTS: MyInvestment[] = [{ id: "INV2041", amount: 500000, start: "2026-09-14T00:00:00Z" }];

const num = (v?: string | number) => Number(v ?? 0) || 0;
const formatDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function InvestmentPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [today, setToday] = useState<Date | null>(null);
  const [investments, setInvestments] = useState<MyInvestment[]>(MY_INVESTMENTS);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<MyInvestment | null>(null);

  // date + localStorage sirf browser me (hydration safe)
  useEffect(() => {
    setUser(getUser());
    setToday(new Date());
  }, []);

  const amt = num(amount);
  const monthly = (amt * ROI_PERCENT) / 100;
  const yearly = monthly * 12;
  const adminCharge = (amt * ADMIN_CHARGE_PERCENT) / 100;
  const payable = amt + adminCharge;

  const todaySlot = today ? roiSlotFor(today) : null;
  const invested = num(user?.total_investment) || investments.reduce((s, i) => s + i.amount, 0);
  const roiEarned = num(user?.roi_income);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!amt) return setError("Enter an amount.");
    setError("");

    setLoading(true);
    try {
      /* TODO: backend API aane pe:
         await apiRequest("/invest", { body: { amount: amt } });
      */
      await new Promise((r) => setTimeout(r, 800)); // demo
      const inv: MyInvestment = { id: `INV${Date.now().toString().slice(-4)}`, amount: amt, start: new Date().toISOString() };
      setInvestments((list) => [inv, ...list]);
      setDone(inv);
      setAmount("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={<>Grow your <span className={goldText}>legacy</span></>} sub={`Invest in land and earn ${ROI_PERCENT}% ROI every month.`} />

      <div className="grid gap-5">
        {/* ================= Summary ================= */}
        <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(145deg,#0B1D45_0%,#12296A_60%,#0B1D45_100%)] p-5 text-white shadow-[0_24px_40px_-20px_rgba(11,29,69,.9)]">
          <span aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4A437]/25 blur-2xl" />
          <span aria-hidden className={`${goldGrad} absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full text-[#0B1D45] shadow-[0_0_20px_rgba(212,164,55,.6)]`}>
            <FaLandmark className="h-4 w-4" />
          </span>
          <p className="relative text-[10px] font-extrabold tracking-[0.22em] text-[#F5D06B]">TOTAL INVESTED</p>
          <p className="relative mt-1 text-3xl font-extrabold tracking-tight">{rupees(invested)}</p>
          <div className="relative mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-white/[.06] px-3 py-2">
              <p className="text-[9px] font-bold tracking-[0.15em] text-white/50">MONTHLY ROI</p>
              <p className="mt-0.5 truncate text-lg font-bold text-[#F5D06B]">{rupees((invested * ROI_PERCENT) / 100)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[.06] px-3 py-2">
              <p className="text-[9px] font-bold tracking-[0.15em] text-white/50">ROI EARNED</p>
              <p className="mt-0.5 truncate text-lg font-bold text-[#F5D06B]">{rupees(roiEarned)}</p>
            </div>
          </div>
        </section>

        {/* ================= Plan ================= */}
        <section className="rounded-2xl border border-[#D4A437]/35 bg-white/80 p-4">
          <div className="flex items-center gap-3">
            <span className={`${goldGrad} grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-[#0B1D45] shadow-[0_10px_24px_-10px_rgba(212,164,55,.9)]`}>
              <span className="text-center leading-none">
                <span className="block text-xl font-extrabold">{ROI_PERCENT}%</span>
                <span className="block text-[8px] font-extrabold tracking-wider">MONTHLY</span>
              </span>
            </span>
            <div className="min-w-0">
              <p className="text-base font-extrabold text-[#0B1D45]">Land ROI plan</p>
              <p className="text-xs text-[#0B1D45]/55">{ROI_PERCENT}% ROI every month · {ADMIN_CHARGE_PERCENT}% admin charge on every sale</p>
            </div>
          </div>

          {/* ROI date schedule */}
          <p className={`${labelCls} mt-4 flex items-center gap-1.5`}><FaCalendarCheck className="h-3 w-3" /> WHEN YOU GET ROI</p>
          <div className="overflow-hidden rounded-xl border border-[#0B1D45]/10 bg-white">
            <div className="grid grid-cols-2 bg-[#0B1D45] px-3.5 py-2 text-[10px] font-extrabold tracking-[0.15em] text-[#F5D06B]">
              <span>INVESTED ON</span>
              <span className="text-right">ROI CREDITED ON</span>
            </div>
            {ROI_SCHEDULE.map((s) => {
              const isToday = todaySlot?.from === s.from;
              return (
                <div key={s.from} className={`grid grid-cols-2 items-center border-t border-[#0B1D45]/5 px-3.5 py-2.5 text-sm ${isToday ? "bg-[#FFF8E6]" : ""}`}>
                  <span className="font-semibold text-[#0B1D45]">
                    {ordinal(s.from)} – {ordinal(s.to)}
                    {isToday && <span className={`${goldGrad} ml-2 rounded-full px-1.5 py-0.5 align-middle text-[9px] font-extrabold text-[#0B1D45]`}>TODAY</span>}
                  </span>
                  <span className="text-right font-bold text-[#A87A12]">{ordinal(s.payDay)} of every month</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= Calculator + invest ================= */}
        <section className="rounded-2xl border border-[#D4A437]/35 bg-white/80 p-4">
          {done ? (
            <Success
              title="Investment requested"
              text={`Your ${rupees(done.amount)} request is received (ID ${done.id}). ROI will be credited on the ${ordinal(roiSlotFor(new Date(done.start)).payDay)} of every month.`}
              action={<button type="button" onClick={() => setDone(null)} className={btnNavy}><FaRotateRight className="h-3.5 w-3.5" /> Invest again</button>}
            />
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-3">
              <p className={labelCls}>ROI CALCULATOR</p>

              <Field
                id="amount"
                label="AMOUNT"
                icon={FaIndianRupeeSign}
                inputMode="numeric"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => { setAmount(e.target.value.replace(/\D/g, "")); setError(""); }}
                error={error}
              />
              <div className="-mt-1 flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => { setAmount(String(q)); setError(""); }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${amt === q ? "border-[#D4A437] bg-[#FFF8E6] text-[#A87A12]" : "border-[#0B1D45]/12 bg-white text-[#0B1D45]/70 hover:border-[#D4A437]"}`}
                  >
                    {shortRupees(q)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "MONTHLY", value: rupees(monthly), Icon: FaCoins },
                  { label: "YEARLY", value: rupees(yearly), Icon: FaChartLine },
                  { label: "RATE", value: `${ROI_PERCENT}%`, Icon: FaPercent },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="rounded-xl bg-[#FFF8E6] px-2 py-2.5">
                    <Icon className="mx-auto h-3 w-3 text-[#D4A437]" />
                    <p className="mt-1 truncate text-sm font-extrabold text-[#0B1D45]">{value}</p>
                    <p className="text-[9px] font-bold tracking-[0.15em] text-[#A87A12]">{label}</p>
                  </div>
                ))}
              </div>

              {amt > 0 && (
                <div className="grid gap-1.5 rounded-xl border border-[#0B1D45]/8 bg-white px-3.5 py-3 text-sm">
                  <div className="flex justify-between text-[#0B1D45]/65"><span>Investment</span><span className="font-semibold text-[#0B1D45]">{rupees(amt)}</span></div>
                  <div className="flex justify-between text-[#0B1D45]/65">
                    <span className="flex items-center gap-1.5"><FaReceipt className="h-3 w-3 text-[#D4A437]" /> Admin charge ({ADMIN_CHARGE_PERCENT}%)</span>
                    <span className="font-semibold text-[#0B1D45]">+{rupees(adminCharge)}</span>
                  </div>
                  <div className="mt-1 flex justify-between border-t border-[#D4A437]/30 pt-2 font-bold text-[#0B1D45]"><span>Total payable</span><span className="text-[#A87A12]">{rupees(payable)}</span></div>
                </div>
              )}

              {todaySlot && (
                <div className={`${goldGrad} flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-[#0B1D45]`}>
                  <span className="text-xs font-bold">Invest today → ROI every month on</span>
                  <span className="shrink-0 text-lg font-extrabold">{ordinal(todaySlot.payDay)}</span>
                </div>
              )}

              <button type="submit" disabled={loading} aria-busy={loading} className={`${btnNavy} mt-1 disabled:cursor-not-allowed disabled:opacity-70`}>
                {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaPaperPlane className="h-3.5 w-3.5" />}
                {loading ? "Submitting…" : amt ? `Invest ${rupees(amt)}` : "Invest now"}
              </button>
              <p className="flex items-start gap-2 text-xs text-[#0B1D45]/55">
                <FaCircleInfo className="mt-0.5 h-3 w-3 shrink-0 text-[#D4A437]" />
                ROI is calculated on the investment amount. A {ADMIN_CHARGE_PERCENT}% admin charge applies on every sale.
              </p>
            </form>
          )}
        </section>

        {/* ================= My investments ================= */}
        <section>
          <p className={`${labelCls} flex items-center gap-1.5`}><FaChartLine className="h-3 w-3" /> MY INVESTMENTS</p>
          {investments.length ? (
            <ul className="grid gap-2">
              {investments.map((inv) => {
                const start = new Date(inv.start);
                const payDay = roiSlotFor(start).payDay;
                return (
                  <li key={inv.id} className="flex items-center gap-3 rounded-2xl border border-[#0B1D45]/8 bg-white p-3.5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#0B1D45] text-[#F5D06B]">
                      <FaLandmark className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-[#0B1D45]">{rupees(inv.amount)}</p>
                      <p className="truncate text-xs text-[#0B1D45]/50">
                        Invested {formatDate(start)} · ROI on {ordinal(payDay)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-extrabold text-[#A87A12]">+{rupees((inv.amount * ROI_PERCENT) / 100)}</p>
                      {today && <p className="text-[10px] font-semibold text-[#0B1D45]/45">Next {formatDate(nextRoiDate(start, today))}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-[#0B1D45]/15 bg-white/60 px-4 py-5 text-center text-sm text-[#0B1D45]/60">No investments yet.</p>
          )}
        </section>
      </div>
    </>
  );
}