import { Queue, type ConnectionOptions } from "bullmq";
import { AdminInviteMailPayload, IAdminInviteMailQueue } from "../../application/services/IAdminInviteMailQueue";
import { connection as defaultConnection } from "../config/config.queue";

export const ADMIN_INVITE_QUEUE = "admin-invite-mail";
export const MAIL_ATTEMPTS = 5;

export class AdminInviteMailQueue implements IAdminInviteMailQueue {
    private readonly _queue: Queue;

    constructor(redisConnection: ConnectionOptions = defaultConnection) {
        this._queue = new Queue(ADMIN_INVITE_QUEUE, {
            connection: redisConnection,
            defaultJobOptions: {
                attempts: MAIL_ATTEMPTS,
                backoff: { type: "exponential", delay: 10_000},
                removeOnComplete: true,
                removeOnFail: { age: 3600}
            }
        });
    }

    async enqueue(payload: AdminInviteMailPayload): Promise<void> {
        await this._queue.add("send-invite", payload, {
            jobId: `invite-${payload.email}-${Date.now()}`,
        });
    }

    async close(): Promise<void> {
        await this._queue.close()
    }
}