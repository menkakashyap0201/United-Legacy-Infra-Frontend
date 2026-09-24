"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  FaUser, FaEnvelope, FaLock, FaGift, FaShieldHalved, FaRotate, FaUserPlus, FaArrowRight, FaSpinner,
  FaRegCopy, FaCheck, FaEye, FaEyeSlash,
} from "react-icons/fa6";
import { AuthCard, Field, PositionSelect, Position, Success, boxCls, btnNavy, goldText, labelCls, linkGold } from "@/app/components/auth/ui";
import { register } from "@/app/lib/api/auth";
import { ApiError } from "@/app/lib/api/client";
import { AuthUser } from "@/app/types/auth.types";

/* ================= Captcha ================= */
const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeCaptcha = () => Array.from({ length: 5 }, () => CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]).join("");

type RegForm = { name: string; email: string; position: Position | ""; password: string; referral: string; captcha: string };
type RegErrors = Partial<Record<keyof RegForm, string>>;

/* backend field → form field */
const FIELD_MAP: Record<string, keyof RegForm> = {
  name: "name",
  email: "email",
  password: "password",
  referal_by: "referral",
  team_position: "position",
};

/* ================= Copy helper ================= */
// navigator.clipboard sirf https / localhost pe chalta hai — baaki jagah fallback
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/* ================= Copy row (label + value + icons) ================= */
function CopyRow({ label, value, secret = false }: { label: string; value: string; secret?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    if (await copyText(value)) setCopied(true);
  };

  const iconBtn =
    "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#A87A12] transition hover:bg-[#D4A437]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4A437]";

  return (
    <div className="rounded-xl border border-[#D4A437]/50 bg-[#FFF8E6] px-3.5 py-2.5 text-left">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#A87A12]">{label}</p>
      <div className="mt-0.5 flex items-center gap-1">
        <span className="min-w-0 flex-1 truncate font-mono text-base font-bold tracking-wider text-[#0B1D45]">
          {secret && !visible ? "•".repeat(Math.min(value.length, 12)) : value}
        </span>

        {secret && (
          <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} className={iconBtn}>
            {visible ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
          </button>
        )}

        <button type="button" onClick={onCopy} aria-label={`Copy ${label.toLowerCase()}`} className={iconBtn}>
          {copied ? <FaCheck className="h-4 w-4 text-emerald-600" /> : <FaRegCopy className="h-4 w-4" />}
        </button>
      </div>
      <p aria-live="polite" className={`text-xs text-emerald-600 transition-opacity ${copied ? "opacity-100" : "h-0 opacity-0"}`}>
        {copied ? "Copied" : ""}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegForm>({ name: "", email: "", position: "", password: "", referral: "", captcha: "" });
  const [errors, setErrors] = useState<RegErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [spin, setSpin] = useState(0);
  const [createdUser, setCreatedUser] = useState<AuthUser | null>(null);

  const set = <K extends keyof RegForm>(k: K, v: RegForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
    if (serverError) setServerError("");
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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const err: RegErrors = {};
    if (form.name.trim().length < 2) err.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) err.email = "Enter a valid email address.";
    if (!form.position) err.position = "Choose West or East.";
    if (!form.referral.trim()) err.referral = "Referral code is required.";
    if (form.password.length < 8) err.password = "Use at least 8 characters.";
    if (form.captcha.trim().toUpperCase() !== code) err.captcha = "Captcha does not match. Try again.";
    setErrors(err);
    if (Object.keys(err).length) { if (err.captcha) refresh(); return; }

    setLoading(true);
    setServerError("");
    try {
      const res = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        referal_by: form.referral.trim().toUpperCase(),
        team_position: String(form.position).toLowerCase() === "east" ? 2 : 1,
      });
      setCreatedUser(res.user); // res.user.referal_code yahan se milega
    } catch (error) {
      if (error instanceof ApiError && error.errors) {
        const fieldErrors: RegErrors = {};
        for (const [key, msgs] of Object.entries(error.errors)) {
          const field = FIELD_MAP[key];
          if (field && msgs?.[0]) fieldErrors[field] = msgs[0];
        }
        setErrors(fieldErrors);
        if (!Object.keys(fieldErrors).length) setServerError(error.message);
      } else {
        setServerError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
      }
      refresh();
    } finally {
      setLoading(false);
    }
  };

  if (createdUser) {
    return (
      <AuthCard title={<>Welcome, <span className={goldText}>{(createdUser.name || form.name).trim().split(" ")[0]}</span></>}>
        <Success
          title="Account created"
          text="Your account is ready. Start building your land legacy."
          action={
            <div className="grid w-full gap-3">
              <CopyRow label="YOUR REFERRAL CODE" value={createdUser.referal_code} />
              <CopyRow label="PASSWORD" value={form.password} secret />
              <p className="text-center text-xs text-[#0B1D45]/60">Save these details. You&apos;ll need your password to log in.</p>
              <Link href="/login" className={`${btnNavy} mt-1`}>Go to Login <FaArrowRight className="h-3.5 w-3.5" /></Link>
            </div>
          }
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
          <Field id="referral" label="REFERRAL CODE" icon={FaGift} placeholder="Enter referral" autoCapitalize="characters" required value={form.referral} onChange={(e) => set("referral", e.target.value)} error={errors.referral} />
        </div>
        <Field id="password" label="PASSWORD" icon={FaLock} type="password" placeholder="Create a password" autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} />

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

        {serverError && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>
        )}

        <button type="submit" disabled={loading} aria-busy={loading} className={`${btnNavy} mt-2 disabled:cursor-not-allowed disabled:opacity-70`}>
          {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaUserPlus className="h-3.5 w-3.5" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-[#0B1D45]/60">Already have an account? <Link href="/login" className={linkGold}>Login</Link></p>
      </form>
    </AuthCard>
  );
}