import { IAdminInvitation } from "../../../entities/admins/superAdmin/IAdminInvitation";

export interface IAdminInvitationStore {
    create(token: string, invitation: IAdminInvitation, ttlSeconds: number): Promise<boolean>;
    find(token: string): Promise<IAdminInvitation | null>;
    claim(token: string): Promise<IAdminInvitation | null>;
    restore(token: string, invitation: IAdminInvitation): Promise<void>;
    revoke(token: string): Promise<void>;
}