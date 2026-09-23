import Image from "next/image";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/home" className="flex items-center gap-2.5" aria-label="United Legacy Infra — home">
      <Image src="/logo-b.png" alt="" width={435} height={233} priority className="h-11 w-auto sm:h-12" />
      <span className="leading-tight">
        <span className={`block text-base font-extrabold tracking-tight sm:text-lg ${light ? "text-white" : "text-[#0B1D45]"}`}>United Legacy</span>
        <span className="block text-[11px] font-semibold text-[#A87A12] sm:text-xs">Infra Pvt. Ltd.</span>
      </span>
    </Link>
  );
}
