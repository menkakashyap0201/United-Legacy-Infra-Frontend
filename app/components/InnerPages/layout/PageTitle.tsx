import { ReactNode } from "react";
import { serif } from "@/app/components/auth/fonts";

/** Har app page ka heading — AuthCard ke title jaisa hi look */
export default function PageTitle({ title, sub }: { title: ReactNode; sub?: string }) {
  return (
    <div className="mb-5 text-center">
      <h1 className={`${serif.className} text-3xl font-bold leading-tight text-[#0B1D45]`}>{title}</h1>
      {sub && <p className="mx-auto mt-1.5 max-w-xs text-sm text-[#0B1D45]/60">{sub}</p>}
    </div>
  );
}