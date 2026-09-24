import { MyAccountsResponse } from "@/app/types/account.types";
import { apiRequest, ApiError } from "./client";

/* ================= Account APIs ================= */

/** GET /my-accounts — Bearer token apiRequest khud lagata hai */
export async function getMyAccounts(): Promise<MyAccountsResponse> {
    try {
        return await apiRequest<MyAccountsResponse>("/my-accounts");
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("getMyAccounts():", error);
        throw new ApiError("Could not load your accounts. Please try again.", 0);
    }
}