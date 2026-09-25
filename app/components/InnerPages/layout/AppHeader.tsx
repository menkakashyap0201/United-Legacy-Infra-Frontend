"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaWallet } from "react-icons/fa6";
import { goldGrad } from "@/app/components/auth/ui";

/**
 * App header — left: logo, right: profile icon
 * /profile page pe profile icon ki jagah withdraw icon dikhta hai
 */
export default function AppHeader() {
  const pathname = usePathname();
  const onProfile = pathname === "/profile" || pathname.startsWith("/profile/");

  const action = onProfile
    ? { href: "/withdraw", label: "Withdraw", Icon: FaWallet }
    : { href: "/profile", label: "Profile", Icon: FaUser };

  return (
    <header className="relative flex items-center justify-between gap-3 bg-white/75 px-5 py-3 backdrop-blur-md sm:px-7">
      {/* ===== Logo ===== */}
      <Link href="/profile" aria-label="United Legacy — home" className="group flex min-w-0 items-center gap-2.5">
        <span className="relative flex shrink-0 items-center justify-center">
          <span aria-hidden className="absolute h-11 w-11 rounded-full bg-[#D4A437]/20 blur-md transition group-hover:bg-[#D4A437]/35" />
          <Image src="/logo-b.png" alt="" width={435} height={233} priority className="relative h-9 w-auto" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-extrabold tracking-tight text-[#0B1D45]">United Legacy</span>
          <span className="block truncate text-[9px] font-semibold tracking-[0.28em] text-[#A87A12]">INFRA PVT. LTD.</span>
        </span>
      </Link>

      {/* ===== Profile / Withdraw ===== */}
      <Link
        key={action.href}
        href={action.href}
        aria-label={action.label}
        title={action.label}
        className={`${goldGrad} group relative grid h-11 w-11 shrink-0 animate-[appFade_.4s_ease-out_both] place-items-center rounded-full p-[2px] shadow-[0_8px_20px_-8px_rgba(212,164,55,.9)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A437]`}
      >
        <span className="grid h-full w-full place-items-center rounded-full bg-[#0B1D45]">
          <action.Icon className="h-4 w-4 text-[#F5D06B] transition group-hover:scale-110" />
        </span>
      </Link>

      {/* gold hairline */}
      <span aria-hidden className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4A437]/70 to-transparent" />
    </header>
  );
}