export interface AdminInviteMailPayload {
    email: string;
    token: string;
}

export interface IAdminInviteMailQueue {
    enqueue(payload: AdminInviteMailPayload): Promise<void>;
}