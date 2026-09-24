/* Shared plot data for the register page panels (same numbers as the portfolio page) */
export const PLAN_MONTHS = 25;
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export type PlotKind = "Full plot" | "Fractional";
export type Plot = { size: string; sq: number; kind: PlotKind; total: number; monthly: number; tag?: string; area: string; img: string };

/*
  img: yahan direct image link daalo.
  - Remote link:  "https://your-cdn.com/plots/plot-100.jpg"
  - Local file:   public/plots/plot-100.jpg  →  "/plots/plot-100.jpg"
*/
export const plots: Plot[] = [
  { size: "100 sq yd", sq: 100, kind: "Full plot", total: 1250000, monthly: 24500, tag: "Popular", area: "Prime residential location", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXOzMUZqe0TW0LryLhzUd3lEq3_qoep1nuaiyLjnrqILzbeNvTIrDyhQ&s=10" },
  { size: "200 sq yd", sq: 200, kind: "Full plot", total: 2500000, monthly: 49000, tag: "Best value", area: "Near main highway", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLP3DBHomAGb19FDXF-AUc4U5L_OD97Lo8_ICUM75SGXv4lnjKtRNhPpJy&s=10" },
  { size: "125 sq yd", sq: 125, kind: "Full plot", total: 1562500, monthly: 30625, area: "Planned residential layout", img: "https://cdn.home-designing.com/wp-content/uploads/2020/04/futuristic-architecture.jpg" },
  { size: "50 sq yd", sq: 50, kind: "Fractional", total: 650000, monthly: 12740, tag: "Low entry", area: "Fractional option", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKj3UaspCDyO5T7e1izg5k8O5ZzQ1uJHKgSGw27x6IVi-qq3jFgBSrrDNb&s=10" },
  { size: "62.5 sq yd", sq: 62.5, kind: "Fractional", total: 812500, monthly: 15925, area: "Fractional option", img: "https://c.ndtvimg.com/2025-03/6vpuh25_luxury_295x200_06_March_25.png" },
];

export const plotBySq = (sq: number) => plots.find((p) => p.sq === sq)!;