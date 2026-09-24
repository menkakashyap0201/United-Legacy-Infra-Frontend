import { clearAuth, getToken } from "@/app/lib/auth/token";

const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
const NETWORK_ERROR = "Unable to reach the server. Check your internet connection.";

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(message: string, status: number, errors?: Record<string, string[]>) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}

type ApiRequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    /** false = token mat bhejo (register / login ke liye) */
    auth?: boolean;
};

/** Laravel backend call — body diya to POST, warna GET. Token localStorage se apne aap lagta hai. */
export async function apiRequest<T>(
    path: string,
    { method, body, headers, auth = true }: ApiRequestOptions = {}
): Promise<T> {
    const token = auth ? getToken() : null;

    let res: Response;
    try {
        res = await fetch(`${BASE_URL}${path}`, {
            method: method ?? (body !== undefined ? "POST" : "GET"),
            headers: {
                Accept: "application/json",
                ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        // internet off, server down, ya CORS block
        console.error(`apiRequest(${path}):`, error);
        throw new ApiError(NETWORK_ERROR, 0);
    }

    const data = await res.json().catch(() => ({}));

    // token expire / invalid → logout kar do
    if (res.status === 401 && auth) clearAuth();

    if (!res.ok || data?.status === false) {
        throw new ApiError(
            data?.message ?? `Request failed (${res.status}). Please try again.`,
            res.status,
            data?.errors
        );
    }

    return data as T;
}