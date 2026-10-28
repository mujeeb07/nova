export interface IAdminInviteMailQueue {
    enqueue(payload: { email: string; token: string }): Promise<void>;
}