/* Theme (from the logo)
   gold #D4A12A · gold-light #F5D06B · gold-deep #A87A12
   royal #1E4BB8 · navy #0B1D45 · ink #0F172A · soft #F7F9FD */
export const goldGrad = "bg-[linear-gradient(135deg,#F5D06B_0%,#D4A12A_55%,#A87A12_100%)]";
export const blueGrad = "bg-[linear-gradient(135deg,#6E9BFF_0%,#1E4BB8_55%,#0B1D45_100%)]";
export const container = "mx-auto w-full max-w-7xl px-5 sm:px-8";
export const btnPrimary = `${goldGrad} inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-[#0B1D45] shadow-[0_12px_30px_-10px_rgba(212,161,42,.8)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-10px_rgba(212,161,42,.9)]`;

/* Card styles — every card has a gold or blue border */
export const cardGold = "rounded-3xl border border-[#D4A12A]/40 bg-white shadow-[0_15px_40px_-28px_rgba(11,29,69,.45)] transition duration-300 hover:-translate-y-1.5 hover:border-[#D4A12A] hover:shadow-[0_25px_50px_-25px_rgba(212,161,42,.55)]";
export const cardBlue = "rounded-3xl border border-[#1E4BB8]/25 bg-white shadow-[0_15px_40px_-28px_rgba(11,29,69,.45)] transition duration-300 hover:-translate-y-1.5 hover:border-[#1E4BB8] hover:shadow-[0_25px_50px_-25px_rgba(30,75,184,.45)]";

/** Dummy images — replace with your own photos later */
export const pic = (seed: string, w: number, h: number) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
