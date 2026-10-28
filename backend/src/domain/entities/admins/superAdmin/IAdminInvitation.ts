import { PERMISSIONS } from "../IAdmin"

export interface IAdminInvitation {
    email: string;
    permissions: PERMISSIONS[];
    invitedBy: string;
    createdAt: string;
    expiresAt: string;
}