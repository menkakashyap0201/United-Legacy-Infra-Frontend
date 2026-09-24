/**
 * Token + user storage
 *   remember = true  → localStorage   (browser band karke bhi login rahega)
 *   remember = false → sessionStorage (tab/browser band hote hi logout)
 *
 * import { getToken, getUser, saveAuth, clearAuth, isLoggedIn } from "@/app/lib/auth/token";
 * Sirf browser me chalta hai (client components / useEffect / event handlers).
 */
import { AuthUser } from "@/app/types/auth.types";

const TOKEN_KEY = "uli_token";
const USER_KEY = "uli_user";

const isBrowser = () => typeof window !== "undefined";

function read(key: string): string | null {
    if (!isBrowser()) return null;
    try {
        return localStorage.getItem(key) ?? sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

export function getToken(): string | null {
    return read(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
    const raw = read(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
}

export function saveAuth(token: string, user: AuthUser, remember = true): void {
    if (!isBrowser()) return;
    clearAuth(); // purana token dono jagah se hatao
    try {
        const store = remember ? localStorage : sessionStorage;
        store.setItem(TOKEN_KEY, token);
        store.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("saveAuth():", error);
    }
}

export function clearAuth(): void {
    if (!isBrowser()) return;
    try {
        [localStorage, sessionStorage].forEach((s) => {
            s.removeItem(TOKEN_KEY);
            s.removeItem(USER_KEY);
        });
    } catch {}
}

export function isLoggedIn(): boolean {
    return !!getToken();
}