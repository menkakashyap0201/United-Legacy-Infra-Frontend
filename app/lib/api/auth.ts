import {
    LoginPayload, LoginResponse,
    RegisterPayload, RegisterResponse,
    VerifyOtpPayload, VerifyOtpResponse,
} from "@/app/types/auth.types";
import { clearAuth, saveAuth } from "@/app/lib/auth/token";
import { apiRequest, ApiError } from "./client";

/* ================= Auth APIs — sab yahin ================= */

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
        const data = await apiRequest<RegisterResponse>("/register", { body: payload, auth: false });
        saveAuth(data.token, data.user);
        return data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("register():", error);
        throw new ApiError("Registration failed. Please try again.", 0);
    }
}

/** Step 1: referral code + password → registered email pe OTP */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
    try {
        return await apiRequest<LoginResponse>("/login", { body: payload, auth: false });
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("login():", error);
        throw new ApiError("Login failed. Please try again.", 0);
    }
}

/** Step 2: referral code + OTP → token + user save */
export async function verifyOtp(payload: VerifyOtpPayload, remember = true): Promise<VerifyOtpResponse> {
    try {
        const data = await apiRequest<VerifyOtpResponse>("/verify-otp", { body: payload, auth: false });
        saveAuth(data.token, data.user, remember);
        return data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("verifyOtp():", error);
        throw new ApiError("OTP verification failed. Please try again.", 0);
    }
}

export function logout(): void {
    clearAuth();
}