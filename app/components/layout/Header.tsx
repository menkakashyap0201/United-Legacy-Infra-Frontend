"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/app/components/layout/Logo";
import { btnPrimary, container, goldGrad } from "@/app/components/layout/theme";
import { navLinks } from "@/app/components/layout/nav";

/* outline button for Login, sits next to the gold Register button */
const btnLogin =
  "inline-flex items-center justify-center rounded-full border border-[#0B1D45]/15 bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1D45] transition hover:border-[#D4A12A] hover:text-[#A87A12]";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // close the mobile menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    // same gap from top, left and right
    <header className="fixed inset-x-3 top-3 z-50 animate-[navIn_.7s_ease-out_both] sm:inset-x-4 sm:top-4">
      {/* full-width bordered card — border on all four sides */}
      <div className="w-full rounded-2xl border border-[#D4A12A]/40 bg-white/90 shadow-[0_8px_30px_-12px_rgba(11,29,69,.25)] backdrop-blur-xl">
        {/* content lines up with the page, same as before */}
        <nav className={`${container} flex items-center justify-between gap-4 py-3 sm:py-4`}>
          <Logo />

          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-[#0B1D45]/10 bg-white/70 p-1 backdrop-blur">
              {navLinks.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${active ? `${goldGrad} text-[#0B1D45] shadow-md` : "text-[#0F172A]/70 hover:bg-[#EEF3FF] hover:text-[#0B1D45]"}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
            {/* <Link href="/login" className={btnLogin}>Login</Link> */}
            <Link href="/register" className={`${btnPrimary} !px-5 !py-2.5`}>Register</Link>
          </div>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B1D45]/15 bg-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-0.5 w-5 bg-[#0B1D45] transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-0.5 w-5 bg-[#0B1D45] transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </nav>

        {/* mobile menu — stays inside the same bordered card */}
        <div className={`overflow-hidden transition-all duration-300 md:hidden ${open ? "max-h-96" : "max-h-0"}`}>
          <div className={`${container} flex flex-col gap-2 border-t border-[#0B1D45]/10 py-3`}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-4 py-3 text-lg font-semibold transition ${isActive(l.href) ? "bg-[#FFF8E6] text-[#A87A12]" : "text-[#0B1D45]"}`}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {/* <Link href="/login" className={btnLogin}>Login</Link> */}
              <Link href="/register" className={btnPrimary}>Register</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}