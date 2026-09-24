import { ReactNode } from "react";
import AuthGuard from "@/app/components/auth/AuthGuard";
import AppHeader from "@/app/components/InnerPages/layout/AppHeader";
import BottomNav from "@/app/components/InnerPages/layout/BottomNav";
import AppScrollArea from "@/app/components/InnerPages/layout/AppScrollArea";
import SplitFrame from "@/app/components/InnerPages/layout/SplitFrame";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Dashboard — United Legacy Infra",
};

/*
  Same design as (auth): left card + right showcase (desktop).
  Card ke andar: header (upar) + page content (scroll) + bottom navbar (neeche).
  Pages sirf apna content dete hain — AuthCard / header / nav nahi lagana.
*/
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SplitFrame>
      <div className="relative flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-[#D4A437]/40 bg-[linear-gradient(180deg,#FFFFFF_0%,#FFFBF0_45%,#F8ECCB_100%)] text-[#0B1D45] shadow-[0_40px_80px_-30px_rgba(212,164,55,.45)]">
        {/* soft decorations */}
        <span aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D4A437]/15 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#D4A437]/15 blur-3xl" />
        <span aria-hidden className="pointer-events-none absolute right-7 top-28 h-3 w-3 rounded-full border-2 border-[#D4A437]/70" />
        <span aria-hidden className="pointer-events-none absolute left-8 top-48 h-5 w-5 animate-[float_6s_ease-in-out_infinite] rounded-full border-2 border-[#D4A437]/50" />

        {/* header */}
        <div className="relative z-20 shrink-0">
          <AppHeader />
        </div>

        {/* page content */}
        <AppScrollArea>
          <AuthGuard>{children}</AuthGuard>
        </AppScrollArea>

        {/* bottom navbar */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#F8ECCB] via-[#F8ECCB]/85 to-transparent pb-[env(safe-area-inset-bottom)] pt-8">
          <BottomNav />
        </div>
      </div>
    </SplitFrame>
  );
}