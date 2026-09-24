"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { FaUser, FaLock, FaArrowLeft, FaArrowRight, FaRightToBracket, FaShieldHalved, FaSpinner, FaKey } from "react-icons/fa6";
import { AuthCard, Field, Success, btnNavy, btnOutline, goldText, linkGold } from "@/app/components/auth/ui";
import { login, verifyOtp } from "@/app/lib/api/auth";
import { ApiError } from "@/app/lib/api/client";
import { AuthUser } from "@/app/types/auth.types";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type Errors = { user?: string; pass?: string; otp?: string };

/* menkakashyap0201@gmail.com → me**************@gmail.com */
const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
};

export default function LoginPage() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [referral, setReferral] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [user, setUser] = useState<AuthUser | null>(null);

  // resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  /* backend error → sahi field ke neeche, warna upar red box me */
  const handleError = (error: unknown, field?: "pass" | "otp") => {
    if (!(error instanceof ApiError)) {
      setServerError("Something went wrong. Please try again.");
      return;
    }
    const bag = error.errors ?? {};
    const fe: Errors = {};
    if (bag.referal_code?.[0]) fe.user = bag.referal_code[0];
    if (bag.password?.[0]) fe.pass = bag.password[0];
    if (bag.otp?.[0]) fe.otp = bag.otp[0];

    // "Incorrect password" jaisa message → password field ke neeche
    if (!Object.keys(fe).length && field) {
      const match = field === "pass" ? /password/i : /otp|code/i;
      if (match.test(error.message)) fe[field] = error.message;
    }

    if (Object.keys(fe).length) setErrors(fe);
    else setServerError(error.message);
  };

  const sendOtp = async () => {
    const res = await login({ referal_code: referral.trim().toUpperCase(), password: pass });
    setEmail(res.email);
    setInfo(res.message);
    setResendIn(RESEND_SECONDS);
  };

  /* ===== Step 1: referral code + password ===== */
  const submitLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const err: Errors = {};
    if (!referral.trim()) err.user = "Enter your referral code.";
    if (!pass) err.pass = "Enter your password.";
    setErrors(err);
    setServerError("");
    if (Object.keys(err).length) return;

    setLoading(true);
    try {
      await sendOtp();
      setOtp("");
      setStep("otp");
    } catch (error) {
      handleError(error, "pass");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Step 2: OTP ===== */
  const submitOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (otp.length !== OTP_LENGTH) {
      setErrors({ otp: `Enter the ${OTP_LENGTH}-digit code.` });
      return;
    }
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const res = await verifyOtp({ referal_code: referral.trim().toUpperCase(), otp }, remember);
      setUser(res.user);
    } catch (error) {
      handleError(error, "otp");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resendIn > 0 || loading) return;
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      await sendOtp();
      setOtp("");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = () => {
    setStep("login");
    setOtp("");
    setInfo("");
    setErrors({});
    setServerError("");
  };

  const errorBox = serverError && (
    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>
  );

  /* ===== Done ===== */
  if (user) {
    return (
      <AuthCard title={<>Welcome back, <span className={goldText}>{user.name.trim().split(" ")[0]}</span></>}>
        <Success
          title="You're logged in"
          text="Your plots, documents and earnings are ready."
          action={<Link href="/profile" className={btnNavy}>Go to dashboard <FaArrowRight className="h-3.5 w-3.5" /></Link>}
        />
      </AuthCard>
    );
  }

  /* ===== OTP screen ===== */
  if (step === "otp") {
    return (
      <AuthCard title={<>Verify <span className={goldText}>OTP</span></>} sub={`We sent a ${OTP_LENGTH}-digit code to ${maskEmail(email)}.`}>
        <form onSubmit={submitOtp} noValidate className="grid gap-3">
          {info && !serverError && (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>
          )}

          <Field
            id="otp"
            label="OTP CODE"
            icon={FaKey}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={`Enter ${OTP_LENGTH}-digit code`}
            maxLength={OTP_LENGTH}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
              if (errors.otp) setErrors({});
              if (serverError) setServerError("");
            }}
            error={errors.otp}
          />

          {errorBox}

          <button type="submit" disabled={loading} aria-busy={loading} className={`${btnNavy} mt-2 disabled:cursor-not-allowed disabled:opacity-70`}>
            {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaShieldHalved className="h-3.5 w-3.5" />}
            {loading ? "Verifying…" : "Verify and login"}
          </button>

          <p className="text-center text-sm text-[#0B1D45]/60">
            Didn&apos;t get the code?{" "}
            {resendIn > 0 ? (
              <span className="text-[#0B1D45]/45">Resend in {resendIn}s</span>
            ) : (
              <button type="button" onClick={resend} disabled={loading} className={linkGold}>Resend OTP</button>
            )}
          </p>

          <button type="button" onClick={backToLogin} className="mx-auto flex items-center gap-1.5 text-sm text-[#0B1D45]/60 transition hover:text-[#0B1D45]">
            <FaArrowLeft className="h-3 w-3" /> Change referral code
          </button>
        </form>
      </AuthCard>
    );
  }

  /* ===== Login screen ===== */
  return (
    <AuthCard title={<>Welcome <span className={goldText}>back</span></>} sub="Login to see your plots, documents and earnings.">
      <form onSubmit={submitLogin} noValidate className="flex flex-1 flex-col">
        <div className="grid gap-3">
          <Field
            id="user"
            label="REFERRAL CODE"
            icon={FaUser}
            placeholder="ULI2409260002"
            autoComplete="username"
            autoCapitalize="characters"
            value={referral}
            onChange={(e) => {
              setReferral(e.target.value.toUpperCase());
              if (errors.user) setErrors((x) => ({ ...x, user: undefined }));
              if (serverError) setServerError("");
            }}
            error={errors.user}
          />
          <Field
            id="pass"
            label="PASSWORD"
            icon={FaLock}
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              if (errors.pass) setErrors((x) => ({ ...x, pass: undefined }));
              if (serverError) setServerError("");
            }}
            error={errors.pass}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-[#0B1D45]/70">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#D4A437]" />
              Remember me
            </label>
            <Link href="/forgot-password" className={linkGold}>Forgot password?</Link>
          </div>

          {errorBox}

          <button type="submit" disabled={loading} aria-busy={loading} className={`${btnNavy} mt-2 disabled:cursor-not-allowed disabled:opacity-70`}>
            {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaRightToBracket className="h-3.5 w-3.5" />}
            {loading ? "Sending OTP…" : "Login"}
          </button>
        </div>

        <div className="mt-auto pt-6">
          <div className="mb-4 flex items-center gap-3 text-xs text-[#0B1D45]/45">
            <span className="h-px flex-1 bg-[#0B1D45]/10" />New to United Legacy?<span className="h-px flex-1 bg-[#0B1D45]/10" />
          </div>
          <Link href="/register" className={btnOutline}>Create an account</Link>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#0B1D45]/50"><FaShieldHalved className="h-3 w-3 text-[#D4A437]" /> Secure login · Registry in your name</p>
        </div>
      </form>
    </AuthCard>
  );
}