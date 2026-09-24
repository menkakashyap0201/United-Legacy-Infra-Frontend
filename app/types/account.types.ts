import { TeamPosition } from "./auth.types";

export interface Account {
    id: number;
    name: string;
    referal_code: string;
    team_position: TeamPosition;
    /** 0 = inactive, 1 = active (backend se confirm karo) */
    status: number;
    is_current: boolean;
    created_at: string;
}

export interface MyAccountsResponse {
    status: boolean;
    message: string;
    current: string;
    accounts: Account[];
}