import { Worker, type ConnectionOptions } from "bullmq";
import { ADMIN_INVITE_QUEUE, MAIL_ATTEMPTS } from "../queues/AdminInviteMailQueue";
import { IAdminInvitationStore } from "../../domain/repositories/admin/superAdmin/IAdminInvitationStore";
import { INVITE_CONFIG } from "../../config/invite_config";
import { logger } from "../logger/logger";
import { connection } from "../config/config.queue";
export type SendMail = (to: string, subject: string, html: string) => Promise<void>;

export function startAdminInviteWorker(
    store: IAdminInvitationStore,
    sendMail: SendMail
) {
    const worker = new Worker<{ email: string; token: string }>(
        ADMIN_INVITE_QUEUE,
        async (job) => {
            const { email, token } = job.data;

            // Expired, revoked or already accepted: nothing to send.
            if (!(await store.find(token))) return;

            const link = `${INVITE_CONFIG.FRONTEND_URL}${INVITE_CONFIG.ACCEPT_PATH}?token=${encodeURIComponent(token)}`;
            await sendMail(
                email,
                "You've been invited to Nova Admin",
                `<p>You have been invited to join Nova as an admin.</p>
                 <p><a href="${link}">Accept invitation and set your password</a></p>
                 <p>This link expires 2 days after it was issued and can be used once.</p>`
            );
        },
        { connection, concurrency: 5 }
    );

    worker.on("failed", async (job, err) => {
        if (!job) return;
        // Never log job.data: it holds the token.
        logger.warn({ jobId: job.id, attempt: job.attemptsMade, reason: err.message }, "Invite email attempt failed");
        if (job.attemptsMade >= MAIL_ATTEMPTS) {
            await store.revoke(job.data.token).catch(() => undefined);
            logger.error({ jobId: job.id }, "Invite email failed permanently; invitation revoked");
        }
    });

    return worker;
}