import { PERMISSIONS } from "../Admin";


export interface InvitePayload {
    email: string;
    role: string;
    permissions: PERMISSIONS[];
    invitedBy: string;
}

export interface IAdminInvitation {
    email: string;
    permissions: PERMISSIONS[];
    invitedBy: string;
    createdAt: string;
    expiresAt: string;
}