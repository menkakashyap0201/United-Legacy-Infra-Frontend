/**
 * United Legacy Infra — company plan (business rules)
 * Saare pages yahi se padhte hain. Plan badle to sirf ye file badlo.
 */

const LAKH = 1e5;
const CRORE = 1e7;

/* ================= ROI ================= */
/** Monthly ROI % */
export const ROI_PERCENT = 2;

/** Investment kis date ko hua → ROI har mahine kis date ko milega */
export const ROI_SCHEDULE = [
    { from: 1, to: 10, payDay: 15 },
    { from: 11, to: 20, payDay: 25 },
    { from: 21, to: 31, payDay: 5 },
] as const;

export type RoiSlot = (typeof ROI_SCHEDULE)[number];

/** Is date pe invest kiya to kaunsa slot */
export function roiSlotFor(date: Date): RoiSlot {
    const d = date.getDate();
    return ROI_SCHEDULE.find((s) => d >= s.from && d <= s.to) ?? ROI_SCHEDULE[2];
}

/** Agli ROI date (aaj ke baad wali) */
export function nextRoiDate(investedOn: Date, today = new Date()): Date {
    const { payDay } = roiSlotFor(investedOn);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let next = new Date(today.getFullYear(), today.getMonth(), payDay);
    if (next < startOfToday) next = new Date(today.getFullYear(), today.getMonth() + 1, payDay);
    // investment ke pehle koi ROI nahi
    const investDay = new Date(investedOn.getFullYear(), investedOn.getMonth(), investedOn.getDate());
    while (next <= investDay) next = new Date(next.getFullYear(), next.getMonth() + 1, payDay);
    return next;
}

export const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

/* ================= Admin charge ================= */
/** Har sale (investment) pe admin charge % */
export const ADMIN_CHARGE_PERCENT = 3;

/* ================= Direct income ================= */
/** Old PPT ke hisaab se 3% – 25% (titles applicable nahi) */
export const DIRECT_INCOME = { min: 3, max: 25 } as const;

/* ================= Channel Partner (C.P) commission ================= */
export interface CpRank {
    title: string;
    from: number; // target (₹) — is business se shuru
    to: number;   // target (₹) — yahan tak
    percent: number;
}

export const CP_RANKS: CpRank[] = [
    { title: "Channel Partner", from: 50 * LAKH, to: 1 * CRORE, percent: 0.25 },
    { title: "Sr. Channel Partner", from: 1 * CRORE, to: 2 * CRORE, percent: 0.3 },
    { title: "Associate C.P", from: 2 * CRORE, to: 4 * CRORE, percent: 0.4 },
    { title: "Sr. Executive C.P", from: 4 * CRORE, to: 8 * CRORE, percent: 0.5 },
    { title: "Elite C.P", from: 8 * CRORE, to: 16 * CRORE, percent: 0.6 },
    { title: "Premium C.P", from: 16 * CRORE, to: 32 * CRORE, percent: 0.7 },
    { title: "Strategic C.P", from: 32 * CRORE, to: 64 * CRORE, percent: 0.8 },
    { title: "National C.P", from: 64 * CRORE, to: 128 * CRORE, percent: 0.9 },
    { title: "Master C.P", from: 128 * CRORE, to: 250 * CRORE, percent: 1.0 },
    { title: "Super C.P", from: 250 * CRORE, to: 500 * CRORE, percent: 1.25 },
];

/** Business ke hisaab se current rank, next rank aur progress % */
export function getCpRank(business: number) {
    let index = -1;
    CP_RANKS.forEach((r, i) => { if (business >= r.from) index = i; });

    const current = index >= 0 ? CP_RANKS[index] : null;
    const next = CP_RANKS[index + 1] ?? null;

    let progress = 100;
    if (next) {
        const base = current ? current.from : 0;
        progress = Math.min(100, Math.max(0, ((business - base) / (next.from - base)) * 100));
    }
    return { current, next, index, progress, remaining: next ? Math.max(0, next.from - business) : 0 };
}

/* ================= Money format ================= */
export const rupees = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/** 5000000 → ₹50 L, 25000000 → ₹2.5 Cr */
export function shortRupees(n: number) {
    const trim = (v: number) => String(Number(v.toFixed(2)));
    if (n >= CRORE) return `₹${trim(n / CRORE)} Cr`;
    if (n >= LAKH) return `₹${trim(n / LAKH)} L`;
    return rupees(n);
}