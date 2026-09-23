"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Pages that show without the site header and footer */
const AUTH_ROUTES = ["/register", "/login"];

/** Renders its children (header/footer) everywhere except the auth pages. */
export function HideOnAuth({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) return null;
  return <>{children}</>;
}
