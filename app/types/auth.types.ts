/** 1 = West, 2 = East */
export type TeamPosition = 1 | 2;

/** Sirf { status, message } wale responses ke liye */
export interface BasicResponse {
    status: boolean;
    message: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    referal_code: string;
    referal_by: number;
    under_user_id: number;
    team_position: TeamPosition;
    created_at: string;
    updated_at: string;

    /* Login (verify-otp) pe ye bhi aate hain — register pe nahi, isliye optional */
    email_verified_at?: string | null;
    total_investment?: string;
    direct_business?: string;
    left_business?: string;
    right_business?: string;
    total_direct?: number;
    roi_income?: string;
    direct_income?: string;
    level_income?: string;
    total_withdraw?: string;
    /** 0 = inactive, 1 = active (backend se confirm karo) */
    status?: number;
}

/* ---------- Register ---------- */
export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    referal_by: string;
    team_position: TeamPosition;
}

export interface RegisterResponse extends BasicResponse {
    token: string;
    user: AuthUser;
}

/* ---------- Login (step 1: OTP bhejta hai) ---------- */
export interface LoginPayload {
    referal_code: string;
    password: string;
}

export interface LoginResponse extends BasicResponse {
    email: string;
}

/* ---------- Login verify OTP (step 2: token deta hai) ---------- */
export interface VerifyOtpPayload {
    referal_code: string;
    otp: string;
}

export interface VerifyOtpResponse extends BasicResponse {
    token: string;
    user: AuthUser;
}

/* ---------- Forgot password ---------- */
/** Step 1: referral code → OTP email pe */
export interface ForgotPasswordPayload {
    referal_code: string;
}

export interface ForgotPasswordResponse extends BasicResponse {
    /** Backend masked email bhejta hai, jaise "me***@gmail.com" */
    email: string;
}

/** Step 2: OTP check */
export interface VerifyForgotOtpPayload {
    referal_code: string;
    otp: string;
}

/** Step 3: naya password (OTP dobara jaata hai) */
export interface ResetPasswordPayload {
    referal_code: string;
    otp: string;
    password: string;
    password_confirmation: string;
}