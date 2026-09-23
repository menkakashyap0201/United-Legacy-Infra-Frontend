"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaEnvelopeOpenText, FaKey, FaPaperPlane } from "react-icons/fa6";
import { AuthCard, Field, btnNavy, btnOutline, goldText, linkGold } from "@/app/components/auth/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Enter a valid email address.");
    setError("");

    setSent(true);
  };

  return (
    <AuthCard
      title={sent ? <>Check your <span className={goldText}>email</span></> : <>Reset your <span className={goldText}>password</span></>}
      sub={sent ? `We sent a reset link to ${email}. It may take a minute to arrive.` : "Enter the email you registered with and we'll send you a reset link."}
    >
      <div className="flex flex-1 flex-col">
        {sent ? (
          <div className="grid gap-3">
            <Link href="/login" className={btnNavy}>Go to login</Link>
            <button onClick={() => setSent(false)} className={btnOutline}>Use a different email</button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-3">
            <Field id="email" label="EMAIL ADDRESS" icon={FaEnvelope} type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
            <button type="submit" className={`${btnNavy} mt-1`}><FaPaperPlane className="h-3.5 w-3.5" /> Send reset link</button>
          </form>
        )}

        <p className="mt-auto pt-6 text-center text-sm text-[#0B1D45]/60">Remembered it? <Link href="/login" className={linkGold}>Login</Link></p>
      </div>
    </AuthCard>
  );
}