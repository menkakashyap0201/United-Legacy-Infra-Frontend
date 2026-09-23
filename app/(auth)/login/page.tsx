"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { FaUser, FaLock, FaArrowLeft, FaArrowRight, FaRightToBracket, FaShieldHalved } from "react-icons/fa6";
import { AuthCard, Field, Success, btnNavy, btnOutline, goldText, linkGold } from "@/app/components/auth/ui";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ user?: string; pass?: string }>({});
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!user.trim()) err.user = "Enter your email or phone.";
    if (pass.length < 8) err.pass = "Password must be at least 8 characters.";
    setErrors(err);
    // TODO: call your login API here
    if (!Object.keys(err).length) setDone(true);
  };



  return (
    <AuthCard  title={<>Welcome <span className={goldText}>back</span></>} sub="Login to see your plots, documents and earnings.">
      <form onSubmit={submit} noValidate className="flex flex-1 flex-col">
        <div className="grid gap-3">
          <Field id="user" label="EMAIL OR PHONE" icon={FaUser} placeholder="you@example.com" autoComplete="username" value={user} onChange={(e) => setUser(e.target.value)} error={errors.user} />
          <Field id="pass" label="PASSWORD" icon={FaLock} type="password" placeholder="Your password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} error={errors.pass} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-[#0B1D45]/70">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#D4A437]" />
              Remember me
            </label>
            <Link href="/forgot-password" className={linkGold}>Forgot password?</Link>
          </div>
          <button type="submit" className={`${btnNavy} mt-2`}><FaRightToBracket className="h-3.5 w-3.5" /> Login</button>
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