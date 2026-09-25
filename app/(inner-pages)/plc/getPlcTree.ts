import { PlcTreeResponse } from "./Plc.types";
import { getUser } from "@/app/lib/auth/token";
import { buildMockTree } from "./Plc.Mock";
import { ApiError } from "@/app/lib/api/client";

/* ================= PLC (binary tree) APIs ================= */

export async function getPlcTree(): Promise<PlcTreeResponse> {
    try {
        // TODO: backend API mil jaye to sirf ye line rakho aur neeche ka mock hata do:
        // return await apiRequest<PlcTreeResponse>("/plc-tree");

        await new Promise((r) => setTimeout(r, 500)); // demo loading
        return { status: true, message: "Tree fetched", tree: buildMockTree(getUser()) };
    } catch (error) {
        if (error instanceof ApiError) throw error;
        console.error("getPlcTree():", error);
        throw new ApiError("Could not load your team. Please try again.", 0);
    }
}