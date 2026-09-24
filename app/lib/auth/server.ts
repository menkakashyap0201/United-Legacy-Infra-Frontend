// lib/auth/server.ts
import "server-only";
import { cookies } from "next/headers";
import { AuthUser } from "@/app/types/auth.types";
import { TOKEN_COOKIE, USER_COOKIE } from "./constants";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function getServerToken(): Promise<string | null> {
    const store = await cookies();
    return store.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getServerUser(): Promise<AuthUser | null> {
    const store = await cookies();
    const raw = store.get(USER_COOKIE)?.value;
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export async function isAuthenticatedServer(): Promise<boolean> {
    return (await getServerToken()) !== null;
}

// Sirf Route Handlers / Server Actions me
export async function setAuthCookies(token: string, user: AuthUser): Promise<void> {
    const store = await cookies();
    store.set(TOKEN_COOKIE, token, cookieOptions);
    store.set(USER_COOKIE, JSON.stringify(user), cookieOptions);
}

export async function clearAuthCookies(): Promise<void> {
    const store = await cookies();
    store.delete(TOKEN_COOKIE);
    store.delete(USER_COOKIE);
}