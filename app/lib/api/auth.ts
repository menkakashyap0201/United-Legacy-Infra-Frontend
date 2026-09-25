import {
    BasicResponse,
    ForgotPasswordPayload, ForgotPasswordResponse,
    LoginPayload, LoginResponse,
    RegisterPayload, RegisterResponse,
    ResetPasswordPayload,
    VerifyForgotOtpPayload,
    VerifyOtpPayload, VerifyOtpResponse,
} from "@/app/types/auth.types";
import { clearAuth, saveAuth } from "@/app/lib/auth/token";
import { apiRequest, ApiError } from "./client";

/**
 * Har API ka common try/catch:
 *  - ApiError (server ne mana kiya: "Invalid OTP", validation...) → waisa hi aage
 *  - baaki koi bhi error → saaf message wala ApiError
 */
async function safeRequest<T>(name: string, fallback: string, request: () => Promise<T>): Promise<T> {
    try {
        return await request();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error(`${name}():`, error);
        throw new ApiError(fallback, 0);
    }
}

/* ================= Register ================= */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    return safeRequest("register", "Registration failed. Please try again.", async () => {
        const data = await apiRequest<RegisterResponse>("/register", { body: payload, auth: false });
        saveAuth(data.token, data.user);
        return data;
    });
}

/* ================= Login ================= */
/** Step 1: referral code + password → registered email pe OTP */
export function login(payload: LoginPayload): Promise<LoginResponse> {
    return safeRequest("login", "Login failed. Please try again.", () =>
        apiRequest<LoginResponse>("/login", { body: payload, auth: false })
    );
}

/** Step 2: referral code + OTP → token + user save */
export async function verifyOtp(payload: VerifyOtpPayload, remember = true): Promise<VerifyOtpResponse> {
    return safeRequest("verifyOtp", "OTP verification failed. Please try again.", async () => {
        const data = await apiRequest<VerifyOtpResponse>("/verify-otp", { body: payload, auth: false });
        saveAuth(data.token, data.user, remember);
        return data;
    });
}

export function logout(): void {
    clearAuth();
}

/* ================= Forgot password ================= */
/** Step 1: referral code → OTP email pe */
export function forgotPassword(payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> {
    return safeRequest("forgotPassword", "Could not send the OTP. Please try again.", () =>
        apiRequest<ForgotPasswordResponse>("/forgot-password", { body: payload, auth: false })
    );
}

/** Step 2: OTP sahi hai ya nahi */
export function verifyForgotOtp(payload: VerifyForgotOtpPayload): Promise<BasicResponse> {
    return safeRequest("verifyForgotOtp", "OTP verification failed. Please try again.", () =>
        apiRequest<BasicResponse>("/verify-forgot-otp", { body: payload, auth: false })
    );
}

/** Step 3: naya password set */
export function resetPassword(payload: ResetPasswordPayload): Promise<BasicResponse> {
    return safeRequest("resetPassword", "Could not reset your password. Please try again.", () =>
        apiRequest<BasicResponse>("/reset-password", { body: payload, auth: false })
    );
}