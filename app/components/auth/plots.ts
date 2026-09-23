/* Shared plot data for the register page panels (same numbers as the portfolio page) */
export const PLAN_MONTHS = 25;
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const pic = (seed: string) => `https://picsum.photos/seed/${seed}/1200/700`;

export type PlotKind = "Full plot" | "Fractional";
export type Plot = { size: string; sq: number; kind: PlotKind; total: number; monthly: number; tag?: string; area: string; img: string };

export const plots: Plot[] = [
  { size: "100 sq yd", sq: 100, kind: "Full plot", total: 1250000, monthly: 24500, tag: "Popular", area: "Prime residential location", img: pic("rg-plot-100") },
  { size: "200 sq yd", sq: 200, kind: "Full plot", total: 2500000, monthly: 49000, tag: "Best value", area: "Near main highway", img: pic("rg-plot-200") },
  { size: "125 sq yd", sq: 125, kind: "Full plot", total: 1562500, monthly: 30625, area: "Planned residential layout", img: pic("rg-plot-125") },
  { size: "50 sq yd", sq: 50, kind: "Fractional", total: 650000, monthly: 12740, tag: "Low entry", area: "Fractional option", img: pic("rg-plot-50") },
  { size: "62.5 sq yd", sq: 62.5, kind: "Fractional", total: 812500, monthly: 15925, area: "Fractional option", img: pic("rg-plot-62") },
];

export const plotBySq = (sq: number) => plots.find((p) => p.sq === sq)!;
