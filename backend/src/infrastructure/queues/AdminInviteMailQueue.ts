import { Queue, type ConnectionOptions } from "bullmq";
import { IAdminInviteMailQueue } from "../../application/services/IAdminInviteMailQueue";
import { connection } from "../config/config.queue";
export const ADMIN_INVITE_QUEUE = "admin-invite-mail";
export const MAIL_ATTEMPTS = 5;

export class AdminInviteMailQueue implements IAdminInviteMailQueue {
    private readonly _queue: Queue;

    constructor() {
        this._queue = new Queue(ADMIN_INVITE_QUEUE, {
            connection,
            defaultJobOptions: {
                attempts: MAIL_ATTEMPTS,
                backoff: { type: "exponential", delay: 10_000 },
                removeOnComplete: true,
                removeOnFail: { age: 3600 },
            },
        });
    }

    async enqueue(payload: { email: string; token: string }): Promise<void> {
        await this._queue.add("send-invite", payload);
    }
}