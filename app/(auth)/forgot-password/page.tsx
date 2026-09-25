"use client";

import { FormEvent, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaGift, FaKey, FaLock, FaPaperPlane, FaShieldHalved, FaSpinner } from "react-icons/fa6";
import { AuthCard, Field, Success, btnNavy, goldText, linkGold } from "@/app/components/auth/ui";
import { forgotPassword, resetPassword, verifyForgotOtp } from "@/app/lib/api/auth";
import { ApiError } from "@/app/lib/api/client";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

type Step = "code" | "otp" | "reset" | "done";
type Errors = { code?: string; otp?: string; password?: string; confirm?: string };

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("code");
  const [code, setCode] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [info, setInfo] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const referal_code = code.trim().toUpperCase();

  const clearMessages = () => {
    setErrors({});
    setServerError("");
  };

  /* backend error → sahi field ke neeche, warna red box me */
  const handleError = (error: unknown, field?: keyof Errors) => {
    if (!(error instanceof ApiError)) {
      setServerError("Something went wrong. Please try again.");
      return;
    }
    const bag = error.errors ?? {};
    const fe: Errors = {};
    if (bag.referal_code?.[0]) fe.code = bag.referal_code[0];
    if (bag.otp?.[0]) fe.otp = bag.otp[0];
    if (bag.password?.[0]) fe.password = bag.password[0];
    if (bag.password_confirmation?.[0]) fe.confirm = bag.password_confirmation[0];
    if (!Object.keys(fe).length && field && error.status !== 0) fe[field] = error.message;

    if (Object.keys(fe).length) setErrors(fe);
    else setServerError(error.message);
  };

  /* OTP bhejo (step 1 + resend dono) */
  const sendOtp = async () => {
    const res = await forgotPassword({ referal_code });
    setMaskedEmail(res.email);
    setInfo(res.message);
    setResendIn(RESEND_SECONDS);
  };

  /* ===== Step 1: referral code ===== */
  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    clearMessages();
    if (!referal_code) return setErrors({ code: "Enter your referral code." });

    setLoading(true);
    try {
      await sendOtp();
      setOtp("");
      setStep("otp");
    } catch (error) {
      handleError(error, "code"); // "No account found with this referal code"
    } finally {
      setLoading(false);
    }
  };

  /* ===== Step 2: OTP ===== */
  const submitOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    clearMessages();
    if (otp.length !== OTP_LENGTH) return setErrors({ otp: `Enter the ${OTP_LENGTH}-digit code.` });

    setLoading(true);
    try {
      await verifyForgotOtp({ referal_code, otp });
      setInfo("");
      setStep("reset");
    } catch (error) {
      handleError(error, "otp"); // "Invalid OTP"
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resendIn > 0 || loading) return;
    clearMessages();
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

  /* ===== Step 3: new password ===== */
  const confirmMismatch = confirm.length > 0 && confirm !== password && (confirm.length >= password.length || !password.startsWith(confirm));

  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    clearMessages();

    const err: Errors = {};
    if (password.length < 8) err.password = "Use at least 8 characters.";
    if (!confirm) err.confirm = "Confirm your new password.";
    else if (confirm !== password) err.confirm = "Passwords do not match.";
    if (Object.keys(err).length) return setErrors(err);

    setLoading(true);
    try {
      await resetPassword({ referal_code, otp, password, password_confirmation: confirm });
      setStep("done");
    } catch (error) {
      // "Invalid OTP" / "OTP expired" → wapas OTP step pe, naya OTP mangwao
      if (error instanceof ApiError && !error.errors && /otp/i.test(error.message)) {
        setOtp("");
        setResendIn(0);
        setStep("otp");
        setErrors({ otp: `${error.message}. Please request a new code.` });
      } else {
        handleError(error, "password");
      }
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    clearMessages();
    setInfo("");
    setOtp("");
    setStep("code");
  };

  const errorBox = serverError && (
    <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</p>
  );

  const submitBtn = (label: string, busy: string, Icon: typeof FaPaperPlane) => (
    <button type="submit" disabled={loading} aria-busy={loading} className={`${btnNavy} mt-1 disabled:cursor-not-allowed disabled:opacity-70`}>
      {loading ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <Icon className="h-3.5 w-3.5" />}
      {loading ? busy : label}
    </button>
  );

  /* ===== Step indicator (1 — 2 — 3) ===== */
  const stepIndex = { code: 0, otp: 1, reset: 2, done: 3 }[step];
  const progress = step !== "done" && (
    <ol className="mb-5 flex items-center justify-center gap-2" aria-label={`Step ${stepIndex + 1} of 3`}>
      {["Code", "OTP", "Password"].map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold transition ${i <= stepIndex ? "bg-[#0B1D45] text-[#F5D06B]" : "bg-[#0B1D45]/10 text-[#0B1D45]/40"}`}>{i + 1}</span>
          <span className={`text-[11px] font-bold tracking-wide ${i === stepIndex ? "text-[#0B1D45]" : "text-[#0B1D45]/40"}`}>{label}</span>
          {i < 2 && <span className={`h-px w-5 ${i < stepIndex ? "bg-[#D4A437]" : "bg-[#0B1D45]/15"}`} />}
        </li>
      ))}
    </ol>
  );

  const titles: Record<Step, { title: ReactNode; sub?: string }> = {
    code: { title: <>Reset your <span className={goldText}>password</span></>, sub: "Enter your referral code and we'll send an OTP to your registered email." },
    otp: { title: <>Verify <span className={goldText}>OTP</span></>, sub: `Enter the ${OTP_LENGTH}-digit code sent to ${maskedEmail || "your email"}.` },
    reset: { title: <>Set new <span className={goldText}>password</span></>, sub: "Choose a strong password you'll remember." },
    done: { title: <>All <span className={goldText}>set</span></> },
  };

  return (
    <AuthCard title={titles[step].title} sub={titles[step].sub}>
      <div className="flex flex-1 flex-col">
        {progress}

        {/* ===== Step 1 ===== */}
        {step === "code" && (
          <form onSubmit={submitCode} noValidate className="grid gap-3">
            <Field
              id="code"
              label="REFERRAL CODE"
              icon={FaGift}
              placeholder="ULI2409260002"
              autoComplete="username"
              autoCapitalize="characters"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); clearMessages(); }}
              error={errors.code}
            />
            {errorBox}
            {submitBtn("Send OTP", "Sending OTP…", FaPaperPlane)}
          </form>
        )}

        {/* ===== Step 2 ===== */}
        {step === "otp" && (
          <form onSubmit={submitOtp} noValidate className="grid gap-3">
            {info && !serverError && !errors.otp && (
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
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH)); clearMessages(); }}
              error={errors.otp}
            />
            {errorBox}
            {submitBtn("Verify OTP", "Verifying…", FaShieldHalved)}

            <p className="text-center text-sm text-[#0B1D45]/60">
              Didn&apos;t get the code?{" "}
              {resendIn > 0 ? (
                <span className="text-[#0B1D45]/45">Resend in {resendIn}s</span>
              ) : (
                <button type="button" onClick={resend} disabled={loading} className={linkGold}>Resend OTP</button>
              )}
            </p>
            <button type="button" onClick={goBack} className="mx-auto flex items-center gap-1.5 text-sm text-[#0B1D45]/60 transition hover:text-[#0B1D45]">
              <FaArrowLeft className="h-3 w-3" /> Change referral code
            </button>
          </form>
        )}

        {/* ===== Step 3 ===== */}
        {step === "reset" && (
          <form onSubmit={submitReset} noValidate className="grid gap-3">
            <Field
              id="password"
              label="NEW PASSWORD"
              icon={FaLock}
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearMessages(); }}
              error={errors.password}
            />
            <div>
              <Field
                id="confirm"
                label="CONFIRM PASSWORD"
                icon={FaLock}
                type="password"
                placeholder="Type it again"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); clearMessages(); }}
                error={errors.confirm ?? (confirmMismatch ? "Passwords do not match." : undefined)}
              />
              {confirm && confirm === password && !errors.confirm && (
                <p className="mt-1 text-xs text-emerald-600">Passwords match.</p>
              )}
            </div>
            {errorBox}
            {submitBtn("Reset password", "Saving…", FaShieldHalved)}
          </form>
        )}

        {/* ===== Done ===== */}
        {step === "done" && (
          <Success
            title="Password updated"
            text="Your password has been reset. Log in with your new password."
            action={<Link href="/login" className={btnNavy}>Go to login <FaArrowRight className="h-3.5 w-3.5" /></Link>}
          />
        )}

        {step !== "done" && (
          <p className="mt-auto pt-6 text-center text-sm text-[#0B1D45]/60">Remembered it? <Link href="/login" className={linkGold}>Login</Link></p>
        )}
      </div>
    </AuthCard>
  );
}