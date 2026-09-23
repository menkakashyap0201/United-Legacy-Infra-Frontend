"use client";

import { ReactNode, useEffect, useState } from "react";
import { FaBatteryFull, FaSignal, FaWifi } from "react-icons/fa6";

function useTime() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/**
 * A phone-shaped frame. It always fits the screen:
 * width = the smallest of 400px, 46.6% of the viewport height, or the viewport width minus a small margin.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  const time = useTime();
  return (
    <div className="relative aspect-[9/19.3] w-[min(400px,calc((100dvh-2rem)*0.466),calc(100vw-1.25rem))] shrink-0">
      {/* glow behind the phone */}
      <span aria-hidden className="pointer-events-none absolute -inset-10 -z-10 rounded-[4rem] bg-[#D4A437]/20 blur-3xl" />

      {/* bezel */}
      <div className="h-full w-full rounded-[3.2rem] bg-[linear-gradient(145deg,#F5D06B_0%,#8a6410_18%,#1c1c1c_35%,#0a0a0a_65%,#A87A12_100%)] p-[3px] shadow-[0_50px_100px_-30px_rgba(212,164,55,.55)]">
        <div className="h-full w-full rounded-[3.05rem] bg-[#050505] p-[9px]">
          {/* screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-[#0B0B0B]">
            {/* status bar */}
            <div className="absolute inset-x-0 top-0 z-30 flex h-11 items-center justify-between px-7 pt-1 text-[13px] font-semibold text-white">
              <span>{time ?? "9:41"}</span>
              <span className="flex items-center gap-1.5 text-white/90">
                <FaSignal className="h-3 w-3" /><FaWifi className="h-3 w-3" /><FaBatteryFull className="h-4 w-4" />
              </span>
            </div>
            {/* dynamic island */}
            <span aria-hidden className="absolute left-1/2 top-2.5 z-40 h-[26px] w-[30%] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)]">
              <span className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#1b2a3d] ring-1 ring-white/10" />
            </span>

            {/* app */}
            <div className="absolute inset-x-0 bottom-0 top-11">{children}</div>

            {/* home indicator */}
            <span aria-hidden className="pointer-events-none absolute bottom-2 left-1/2 z-30 h-[5px] w-[34%] -translate-x-1/2 rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </div>
  );
}