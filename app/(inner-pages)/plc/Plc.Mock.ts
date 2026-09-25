/**
 * DEMO DATA — backend ki PLC/tree API aane tak.
 * API mil jaye to ye file delete kar dena (app/lib/api/plc.ts me bas ek line badalni hai).
 */
import { AuthUser, TeamPosition } from "@/app/types/auth.types";
import { TreeMember } from "./Plc.types";

const NAMES = [
    "Rohit Sharma", "Priya Verma", "Aman Gill", "Simran Kaur", "Vikas Yadav", "Neha Singh",
    "Arjun Mehta", "Pooja Rani", "Karan Malhotra", "Anjali Gupta", "Deepak Kumar", "Ritu Bansal",
    "Manpreet Sandhu", "Sahil Arora", "Kavya Nair", "Harpreet Kaur", "Nikhil Jain", "Sneha Kapoor",
    "Gurpreet Singh", "Tanvi Joshi",
];

export function buildMockTree(user: AuthUser | null): TreeMember {
    let seed = 11;
    const rand = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let id = 100;

    const make = (depth: number, pos: TeamPosition): TreeMember | null => {
        // level 1 hamesha bhara, neeche dheere-dheere khaali
        if (depth > 5 || (depth > 1 && rand() > 0.9 - depth * 0.12)) return null;
        id++;
        return {
            id,
            name: NAMES[id % NAMES.length],
            referal_code: `ULI240926${String(id).padStart(4, "0")}`,
            status: rand() > 0.4 ? 1 : 0,
            team_position: pos,
            created_at: new Date(2026, 8, 1 + Math.floor(rand() * 24)).toISOString(),
            west: make(depth + 1, 1),
            east: make(depth + 1, 2),
        };
    };

    return {
        id: user?.id ?? 1,
        name: user?.name ?? "You",
        referal_code: user?.referal_code ?? "ULI0000000000",
        status: user?.status ?? 0,
        team_position: user?.team_position ?? 1,
        created_at: user?.created_at ?? new Date().toISOString(),
        west: make(1, 1),
        east: make(1, 2),
    };
}