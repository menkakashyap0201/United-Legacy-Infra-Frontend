"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { FaChartLine, FaHouse, FaSitemap, FaUser } from "react-icons/fa6";
import { goldGrad } from "@/app/components/auth/ui";

/* Naya tab add karna ho to bas yahan ek line */
const ITEMS: { href: string; label: string; Icon: IconType }[] = [
  { href: "/dashboard", label: "Home", Icon: FaHouse },
  { href: "/profile", label: "Profile", Icon: FaUser },
  { href: "/plc", label: "PLC", Icon: FaSitemap },
  { href: "/investment", label: "Investment", Icon: FaChartLine },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="px-3 pb-3">
      <ul className="grid grid-cols-4 rounded-[1.75rem] border border-[#D4A437]/30 bg-white px-1 pb-2.5 pt-3 shadow-[0_-12px_30px_-14px_rgba(11,29,69,.35)]">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="group flex flex-col items-center gap-1 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#D4A437]/60"
              >
                {/* icon slot — size same rehta hai, taaki saare labels ek line me rahein */}
                <span className="relative h-9 w-9">
                  <span
                    className={`absolute left-1/2 top-1/2 grid -translate-x-1/2 place-items-center rounded-full transition-all duration-300 ease-out ${
                      active
                        ? `${goldGrad} h-14 w-14 -translate-y-[88%] text-[#0B1D45] shadow-[0_12px_24px_-8px_rgba(212,164,55,.95)] ring-[6px] ring-white`
                        : "h-9 w-9 -translate-y-1/2 text-[#0B1D45]/40 group-hover:bg-[#D4A437]/10 group-hover:text-[#A87A12]"
                    }`}
                  >
                    <Icon className={active ? "h-5 w-5" : "h-[18px] w-[18px]"} />
                  </span>
                </span>

                <span
                  className={`text-[11px] transition-colors ${
                    active ? "font-extrabold text-[#0B1D45]" : "font-semibold text-[#0B1D45]/50 group-hover:text-[#A87A12]"
                  }`}
                >
                  {label}
                </span>
                <span aria-hidden className={`h-1 w-1 rounded-full bg-[#D4A437] transition-opacity ${active ? "opacity-100" : "opacity-0"}`} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}