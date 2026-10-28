import { PERMISSIONS } from "../../../../domain/entities/admins/IAdmin";

export interface InviteAdminInputDTO { inviterId: string; email: string; permissions: PERMISSIONS[] }
export interface InviteAdminOutputDTO { email: string; expiresAt: string; emailStatus: "queued" }
export interface ValidateInvitationOutputDTO { email: string; expiresAt: string }
export interface AcceptInvitationInputDTO { token: string; password: string; confirmPassword: string }
export interface AcceptInvitationOutputDTO { email: string }