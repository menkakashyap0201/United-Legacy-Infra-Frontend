import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "United Legacy Infra Pvt. Ltd.",
  description:
    "Land and real estate in Dholera SIR, India's first greenfield smart city — United Legacy Infra Pvt. Ltd.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}