"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Card ke andar scroll hone wala hissa — page badalte hi upar scroll kar deta hai */
export default function AppScrollArea({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <main ref={ref} className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto">
      {/* key → har naye page pe halka fade-in */}
      <div key={pathname} className="flex min-h-full animate-[appFade_.5s_ease-out_both] flex-col px-6 pb-32 pt-5 sm:px-9">
        {children}
      </div>
    </main>
  );
}