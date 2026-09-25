"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  FaBuildingColumns, FaCircleInfo, FaClockRotateLeft, FaHashtag, FaIndianRupeeSign, FaMobileScreen,
  FaPaperPlane, FaRotateRight, FaSpinner, FaUser, FaWallet,
} from "react-icons/fa6";
import { Field, Success, btnNavy, goldGrad, goldText, labelCls } from "@/app/components/auth/ui";
import PageTitle from "@/app/components/InnerPages/layout/PageTitle";
import { getUser } from "@/app/lib/auth/token";
import { AuthUser } from "@/app/types/auth.types";

/* ================= Settings (backend ke rules se match karo) ================= */
const MIN_WITHDRAW = 500;     // minimum amount
const CHARGE_PERCENT = 0;     // admin charge % (0 = koi charge nahi)
const QUICK_AMOUNTS = [500, 1000, 2000];

/* ================= Types ================= */
type Method = "bank" | "upi";
type Status = "pending" | "approved" | "rejected";
type WithdrawRequest = { id: string; amount: number; method: Method; to: string; date: string; status: Status; local?: boolean };
type Errors = Partial<Record<"amount" | "holder" | "account" | "ifsc" | "upi", string>>;

/* DEMO history — API aane pe hata dena */
const MOCK_HISTORY: WithdrawRequest[] = [
  { id: "WD1024", amount: 1500, method: "upi", to: "menka@okaxis", date: "2026-09-20T10:30:00Z", status: "approved" },
  { id: "WD1019", amount: 800, method: "bank", to: "XXXXXX4521", date: "2026-09-12T14:05:00Z", status: "rejected" },
];

/* ================= Helpers ================= */
const num = (v?: string | number) => Number(v ?? 0) || 0;
const rupees = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const maskAccount = (acc: string) => (acc.length > 4 ? `•••• ${acc.slice(-4)}` : acc);
const formatDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const STATUS_STYLE: Record<Status, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
};

export default function WithdrawPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [history, setHistory] = useState<WithdrawRequest[]>(MOCK_HISTORY);

  const [method, setMethod] = useState<Method>("upi");
  const [amount, setAmount] = useState("");
  const [holder, setHolder] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upi, setUpi] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<WithdrawRequest | null>(null);

  // localStorage sirf browser me
  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (u?.name) setHolder(u.name);
  }, []);

  /* ===== Balance ===== */
  const income = { roi: num(user?.roi_income), direct: num(user?.direct_income), level: num(user?.level_income) };
  const withdrawn = num(user?.total_withdraw);
  const pendingNow = history.filter((h) => h.local && h.status === "pending").reduce((s, h) => s + h.amount, 0);
  const available = Math.max(0, income.roi + income.direct + income.level - withdrawn - pendingNow);

  const amt = num(amount);
  const charge = Math.round(amt * CHARGE_PERCENT) / 100;
  const receive = Math.max(0, amt - charge);

  const clear = (k?: keyof Errors) => {
    if (k && errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
    if (serverError) setServerError("");
  };

  /* ===== Submit ===== */
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const err: Errors = {};
    if (!amt) err.amount = "Enter an amount.";
    else if (amt < MIN_WITHDRAW) err.amount = `Minimum withdrawal is ${rupees(MIN_WITHDRAW)}.`;
    else if (amt > available) err.amount = "Amount is more than your available balance.";

    if (method === "bank") {
      if (holder.trim().length < 2) err.holder = "Enter the account holder's name.";
      if (!/^\d{9,18}$/.test(account)) err.account = "Enter a valid account number (9–18 digits).";
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) err.ifsc = "Enter a valid IFSC code, like SBIN0001234.";
    } else if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upi.trim())) {
      err.upi = "Enter a valid UPI ID, like name@okaxis.";
    }

    setErrors(err);
    setServerError("");
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      /* TODO: backend API aane pe:
         await apiRequest("/withdraw", {
           body: method === "bank"
             ? { amount: amt, method, account_holder: holder.trim(), account_number: account, ifsc }
             : { amount: amt, method, upi_id: upi.trim() },
         });
      */
      await new Promise((r) => setTimeout(r, 800)); // demo

      const req: WithdrawRequest = {
        id: `WD${Date.now().toString().slice(-5)}`,
        amount: amt,
        method,
        to: method === "bank" ? account : upi.trim(),
        date: new Date().toISOString(),
        status: "pending",
        local: true,
      };
      setHistory((h) => [req, ...h]);
      setDone(req);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Could not submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDone(null);
    setAmount("");
    setErrors({});
    setServerError("");
  };

  return (
    <>
      <PageTitle title={<>Withdraw <span className={goldText}>funds</span></>} sub="Move your earnings to your bank or UPI." />

      <div className="grid gap-4">
        {/* ================= Balance card ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(145deg,#0B1D45_0%,#12296A_60%,#0B1D45_100%)] p-5 text-white shadow-[0_24px_40px_-20px_rgba(11,29,69,.9)]">
          <span aria-hidden className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#D4A437]/25 blur-2xl" />
          <span aria-hidden className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-[#D4A437]/10 blur-2xl" />
          <span aria-hidden className={`${goldGrad} absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full text-[#0B1D45] shadow-[0_0_20px_rgba(212,164,55,.6)]`}>
            <FaWallet className="h-4 w-4" />
          </span>

          <p className="relative text-[10px] font-extrabold tracking-[0.22em] text-[#F5D06B]">AVAILABLE BALANCE</p>
          <p className="relative mt-1 text-3xl font-extrabold tracking-tight">{rupees(available)}</p>
          <p className="relative mt-0.5 text-xs text-white/55">
            Total withdrawn {rupees(withdrawn)}
            {pendingNow > 0 && <> · {rupees(pendingNow)} pending</>}
          </p>

          <div className="relative mt-4 grid grid-cols-3 gap-2">
            {[
              ["ROI", income.roi],
              ["Direct", income.direct],
              ["Level", income.level],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-xl border border-white/10 bg-white/[.06] px-2.5 py-2">
                <p className="text-[9px] font-bold tracking-[0.15em] text-white/50">{(label as string).toUpperCase()}</p>
                <p className="mt-0.5 truncate text-sm font-bold text-[#F5D06B]">{rupees(value as number)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= Form / Success ================= */}
        <div className="rounded-2xl border border-[#D4A437]/35 bg-white/70 p-4">
          {done ? (
            <Success
              title="Request submitted"
              text={`${rupees(done.amount - Math.round(done.amount * CHARGE_PERCENT) / 100)} will be sent to ${done.method === "bank" ? maskAccount(done.to) : done.to} within 24–48 hours. Request ID ${done.id}.`}
              action={
                <button type="button" onClick={reset} className={btnNavy}>
                  <FaRotateRight className="h-3.5 w-3.5" /> Make another request
                </button>
              }
            />
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-3">
              {/* amount */}
              <Field
                id="amount"
                label="AMOUNT"
                icon={FaIndianRupeeSign}
                inputMode="decimal"
                placeholder={`Min ${rupees(MIN_WITHDRAW)}`}
                value={amount}
                onChange={(e) => { setAmount(e.target.value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1")); clear("amount"); }}
                error={errors.amount}
              />
              <div className="-mt-1 flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => { setAmount(String(q)); clear("amount"); }}
                    className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${amt === q ? "border-[#D4A437] bg-[#FFF8E6] text-[#A87A12]" : "border-[#0B1D45]/12 bg-white text-[#0B1D45]/70 hover:border-[#D4A437]"}`}
                  >
                    {rupees(q)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => { setAmount(String(Math.floor(available))); clear("amount"); }}
                  className={`${goldGrad} rounded-full px-3 py-1.5 text-xs font-extrabold text-[#0B1D45] shadow-[0_6px_14px_-6px_rgba(212,164,55,.9)]`}
                >
                  Max
                </button>
              </div>

              {/* method toggle */}
              <div>
                <p className={labelCls}>SEND TO</p>
                <div role="radiogroup" aria-label="Withdrawal method" className="grid grid-cols-2 gap-1 rounded-xl border border-[#0B1D45]/12 bg-white p-1">
                  {([
                    ["upi", "UPI", FaMobileScreen],
                    ["bank", "Bank account", FaBuildingColumns],
                  ] as const).map(([value, label, Icon]) => {
                    const active = method === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => { setMethod(value); setErrors({}); setServerError(""); }}
                        className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition ${active ? "bg-[#0B1D45] text-[#F5D06B] shadow-[0_8px_18px_-10px_rgba(11,29,69,.9)]" : "text-[#0B1D45]/55 hover:text-[#A87A12]"}`}
                      >
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* method fields */}
              <div key={method} className="grid animate-[appFade_.35s_ease-out_both] gap-3">
                {method === "upi" ? (
                  <Field
                    id="upi"
                    label="UPI ID"
                    icon={FaMobileScreen}
                    placeholder="name@okaxis"
                    autoComplete="off"
                    autoCapitalize="none"
                    value={upi}
                    onChange={(e) => { setUpi(e.target.value.trim()); clear("upi"); }}
                    error={errors.upi}
                  />
                ) : (
                  <>
                    <Field id="holder" label="ACCOUNT HOLDER NAME" icon={FaUser} placeholder="As per bank records" autoComplete="name" value={holder} onChange={(e) => { setHolder(e.target.value); clear("holder"); }} error={errors.holder} />
                    <Field id="account" label="ACCOUNT NUMBER" icon={FaHashtag} inputMode="numeric" placeholder="Your bank account number" autoComplete="off" maxLength={18} value={account} onChange={(e) => { setAccount(e.target.value.replace(/\D/g, "")); clear("account"); }} error={errors.account} />
                    <Field id="ifsc" label="IFSC CODE" icon={FaBuildingColumns} placeholder="SBIN0001234" autoComplete="off" autoCapitalize="characters" maxLength={11} value={ifsc} onChange={(e) => { setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")); clear("ifsc"); }} error={errors.ifsc} />
                  </>
                )}
              </div>

              {/* summary */}
              {amt > 0 && (
                <div className="grid gap-1.5 rounded-xl bg-[#FFF8E6] px-3.5 py-3 text-sm">
                  <div className="flex justify-between text-[#0B1D45]/65"><span>Amount</span><span className="font-semibold text-[#0B1D45]">{rupees(amt)}</span></div>
                  {CHARGE_PERCENT > 0 && (
                    <div className="flex justify-between text-[#0B1D45]/65"><span>Admin charge ({CHARGE_PERCENT}%)</span><span className="font-semibold text-rose-600">−{rupees(charge)}</span></div>
                  )}
                  <div className="mt-1 flex justify-between border-t border-[#D4A437]/30 pt-2 font-bold text-[#0B1D45]"><span>You&apos;ll receive</span><span className="text-[#A87A12]">{rupees(receive)}</span></div>
                </div>
              )}

              {serverError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>}

              <button type="submit" disabled={loading} aria-busy={loading} className={`${btnNavy} mt-1 disabled:cursor-not-allowed disabled:opacity-70`}>
                {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaPaperPlane className="h-3.5 w-3.5" />}
                {loading ? "Submitting…" : "Request withdrawal"}
              </button>

              <p className="flex items-start gap-2 text-xs text-[#0B1D45]/55">
                <FaCircleInfo className="mt-0.5 h-3 w-3 shrink-0 text-[#D4A437]" />
                Minimum {rupees(MIN_WITHDRAW)}. Requests are processed within 24–48 hours.
              </p>
            </form>
          )}
        </div>

        {/* ================= History ================= */}
        <div>
          <p className={`${labelCls} flex items-center gap-1.5`}><FaClockRotateLeft className="h-3 w-3" /> RECENT WITHDRAWALS</p>
          {history.length ? (
            <ul className="grid gap-2">
              {history.map((h) => (
                <li key={h.id} className="flex items-center gap-3 rounded-xl border border-[#0B1D45]/10 bg-white px-3.5 py-3">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${h.method === "bank" ? "bg-[#0B1D45] text-[#F5D06B]" : "border-2 border-[#D4A437] bg-white text-[#A87A12]"}`}>
                    {h.method === "bank" ? <FaBuildingColumns className="h-4 w-4" /> : <FaMobileScreen className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#0B1D45]">{rupees(h.amount)}</p>
                    <p className="truncate text-xs text-[#0B1D45]/50">
                      {formatDate(h.date)} · {h.method === "bank" ? maskAccount(h.to) : h.to}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${STATUS_STYLE[h.status]}`}>{h.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-[#0B1D45]/15 bg-white/60 px-4 py-5 text-center text-sm text-[#0B1D45]/60">No withdrawals yet.</p>
          )}
        </div>
      </div>
    </>
  );
}