import { ReactNode } from "react";
import { FeaturedShowcase } from "@/app/components/auth/FeaturedShowcase";

/*
  Shared frame — (auth) aur (app) dono layouts yahi use karte hain.
  Left: page ka card. Right (desktop only): hero photo + stat cards.
*/
export default function SplitFrame({ children }: { children: ReactNode }) {
  return (
    <main className="relative isolate flex h-dvh w-full items-stretch justify-center gap-5 overflow-hidden bg-[#050807] p-3 text-white sm:p-4 lg:p-5">
      <style>{`
        @keyframes appFade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes showZoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        @keyframes cardIn { from { opacity: 0; transform: translateY(24px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .no-scrollbar { scrollbar-width: none; } .no-scrollbar::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) { main *, main { animation: none !important; transition: none !important; } }
      `}</style>

      <span aria-hidden className="pointer-events-none absolute -left-40 -top-20 -z-10 h-[34rem] w-[34rem] rounded-full bg-[#D4A437]/20 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -right-40 bottom-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#10B981]/10 blur-3xl" />

      {/* left: card */}
      <div className="h-full w-full max-w-[440px] shrink-0 animate-[cardIn_.8s_cubic-bezier(.22,.8,.2,1)_both] lg:w-[30%] lg:min-w-[360px] lg:max-w-[420px]">
        {children}
      </div>

      {/* right: desktop only */}
      <div className="hidden h-full min-w-0 flex-1 animate-[appFade_.9s_ease-out_.15s_both] lg:block">
        <FeaturedShowcase />
      </div>
    </main>
  );
}