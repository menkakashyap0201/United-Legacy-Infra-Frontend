import { TeamPosition } from "@/app/types/auth.types";

/** Binary tree ka ek member — west = left leg, east = right leg */
export interface TreeMember {
    id: number;
    name: string;
    referal_code: string;
    /** 0 = inactive, 1 = active */
    status: number;
    team_position: TeamPosition;
    created_at: string;
    west: TreeMember | null;
    east: TreeMember | null;
}

export interface PlcTreeResponse {
    status: boolean;
    message: string;
    tree: TreeMember;
}