"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaEnvelope, FaLock, FaGift, FaShieldHalved, FaRotate, FaUserPlus, FaArrowRight } from "react-icons/fa6";
import { AuthCard, Field, PositionSelect, Position, Success, boxCls, btnNavy, goldText, labelCls, linkGold } from "@/app/components/auth/ui";

/* ================= Captcha ================= */
const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I
const makeCaptcha = () => Array.from({ length: 5 }, () => CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]).join("");

type RegForm = { name: string; email: string; position: Position | ""; password: string; confirm: string; referral: string; captcha: string };
type RegErrors = Partial<Record<keyof RegForm, string>>;

export default function RegisterPage() {
  const [form, setForm] = useState<RegForm>({ name: "", email: "", position: "", password: "", confirm: "", referral: "", captcha: "" });
  const [errors, setErrors] = useState<RegErrors>({});
  const [code, setCode] = useState("");
  const [spin, setSpin] = useState(0);
  const [done, setDone] = useState(false);

  const set = <K extends keyof RegForm>(k: K, v: RegForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const refresh = useCallback(() => {
    setCode(makeCaptcha());
    setSpin((s) => s + 1);
    setForm((f) => ({ ...f, captcha: "" }));
  }, []);

  // first captcha is made in the browser; ?ref=CODE fills the referral field
  useEffect(() => {
    refresh();
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) setForm((f) => ({ ...f, referral: ref }));
  }, [refresh]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: RegErrors = {};
    if (form.name.trim().length < 2) err.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) err.email = "Enter a valid email address.";
    if (!form.position) err.position = "Choose West or East.";
    if (!form.referral.trim()) err.referral = "Referral code is required.";
    if (form.password.length < 8) err.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) err.confirm = "Passwords do not match.";
    if (form.captcha.trim().toUpperCase() !== code) err.captcha = "Captcha does not match. Try again.";
    setErrors(err);
    if (Object.keys(err).length) { if (err.captcha) refresh(); return; }
    // TODO: send `form` to your register API here (also verify the captcha on the server)
    setDone(true);
  };

  if (done) {
    return (
      <AuthCard title={<>Welcome, <span className={goldText}>{form.name.trim().split(" ")[0]}</span></>}>
        <Success
          title="Account created"
          text="Your account is ready. Login to start building your land legacy."
          action={<Link href="/login" className={btnNavy}>Continue to login <FaArrowRight className="h-3.5 w-3.5" /></Link>}
        />
      </AuthCard>
    );
  }

  return (
    <AuthCard title={<>Create your <span className={goldText}>account</span></>} sub="Join United Legacy Infra — it takes less than a minute.">
      <form onSubmit={submit} noValidate className="grid gap-3">
        <Field id="name" label="FULL NAME" icon={FaUser} placeholder="Your full name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        <Field id="email" label="EMAIL ADDRESS" icon={FaEnvelope} type="email" inputMode="email" placeholder="Your email address" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
        <div className="grid gap-3 sm:grid-cols-2">
          <PositionSelect value={form.position} onChange={(v) => set("position", v)} error={errors.position} />
        <Field id="referral" label="REFERRAL CODE" icon={FaGift} placeholder="Enter referral" autoCapitalize="characters" required value={form.referral} onChange={(e) => set("referral", e.target.value)} error={errors.referral} />        </div>
        <Field id="password" label="PASSWORD" icon={FaLock} type="password" placeholder="Create a password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} />
        <Field id="confirm" label="CONFIRM PASSWORD" icon={FaLock} type="password" placeholder="Confirm your password" autoComplete="new-password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} error={errors.confirm} />

        <div>
          <label htmlFor="captcha" className={labelCls}>CAPTCHA VERIFICATION</label>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <div className={`${boxCls} ${errors.captcha ? "border-rose-400" : "border-[#0B1D45]/12"}`}>
              <FaShieldHalved className="h-4 w-4 shrink-0 text-[#0B1D45]/35 transition group-focus-within:text-[#D4A437]" />
              <input
                id="captcha"
                value={form.captcha}
                onChange={(e) => set("captcha", e.target.value.toUpperCase())}
                placeholder="Type the code"
                autoComplete="off"
                maxLength={5}
                className="w-full min-w-0 bg-transparent py-3 text-sm font-semibold tracking-[0.25em] text-[#0B1D45] placeholder:font-normal placeholder:tracking-normal placeholder:text-[#0B1D45]/35 !outline-none"
              />
            </div>
            <button
              type="button"
              onClick={refresh}
              aria-label={`Captcha code ${code.split("").join(" ")}. Tap for a new code`}
              className="relative flex items-center gap-2 overflow-hidden rounded-xl border border-[#D4A437]/60 bg-[#FFF8E6] px-3.5 transition hover:border-[#D4A437]"
            >
              <span aria-hidden className="pointer-events-none absolute inset-x-2 top-1/2 h-px -rotate-6 bg-[#D4A437]/50" />
              <FaRotate key={spin} className="relative h-3 w-3 animate-[spin_.6s_ease-out_1] text-[#A87A12]" />
              <span className="relative select-none font-mono text-base font-extrabold tracking-[0.2em] text-[#A87A12]">
                {(code || "·····").split("").map((c, n) => (
                  <span key={n} className="inline-block" style={{ transform: `rotate(${[-8, 6, -4, 9, -6][n]}deg) translateY(${[1, -2, 2, -1, 1][n]}px)` }}>{c}</span>
                ))}
              </span>
            </button>
          </div>
          {errors.captcha && <p className="mt-1 text-xs text-rose-600">{errors.captcha}</p>}
        </div>

        <button type="submit" className={`${btnNavy} mt-2`}><FaUserPlus className="h-3.5 w-3.5" /> Create account</button>
        <p className="text-center text-sm text-[#0B1D45]/60">Already have an account? <Link href="/login" className={linkGold}>Login</Link></p>
      </form>
    </AuthCard>
  );
}