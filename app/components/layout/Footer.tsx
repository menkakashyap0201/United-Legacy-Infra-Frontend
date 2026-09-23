import Link from "next/link";
import { Logo } from "@/app/components/layout/Logo";
import { container, goldGrad } from "@/app/components/layout/theme";
import { navLinks } from "./nav";

export function Footer() {
  return (
    // same gap on all four sides, like the header
    <footer className="p-3 sm:p-4">
      {/* full-width bordered card — border on all four sides */}
      <div className="w-full rounded-2xl border border-[#D4A12A]/40 bg-white/90 shadow-[0_-8px_30px_-12px_rgba(11,29,69,.25)] backdrop-blur-xl">
        <div className={`${container} grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_1fr]`}>
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-[#0F172A]/60">Plot sales, documentation, resale and property advisory in India and Dubai, UAE.</p>
            <span className={`${goldGrad} mt-5 block h-1 w-12 rounded-full`} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1D45]">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#0F172A]/65">
              {navLinks.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-[#1E4BB8]">{l.label}</Link></li>)}
              <li><Link href="/home#contact" className="hover:text-[#1E4BB8]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0B1D45]">Get in touch</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#0F172A]/65">
              <li><a href="tel:+910000000000" className="hover:text-[#1E4BB8]">+91 00000 00000</a></li>
              <li><a href="mailto:info@unitedlegacyinfra.com" className="hover:text-[#1E4BB8]">info@unitedlegacyinfra.com</a></li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-[#0F172A]/50">
              Real estate investment carries market risk. Prices, returns and rewards shown are indicative and apply only as per the signed agreement.
              Please do your own due diligence and take independent legal and financial advice before investing.
            </p>
          </div>
        </div>
        <div className={`${container} border-t border-[#0B1D45]/10 py-5 text-center text-xs text-[#0F172A]/45`}>
          © {new Date().getFullYear()} United Legacy Infra Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}