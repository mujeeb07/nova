import { Worker, Job } from "bullmq";
import { connection } from "../config/config.queue";
import { ADMIN_INVITE_QUEUE } from "../queues/AdminInviteMailQueue";
import { sendInvitationAdminEmail } from "../services/InviteAdminService";

interface AdminInviteJobData {
    email: string;
    token: string;
}

export const createAdminInviteMailWorker = (adminPortalUrl: string): Worker<AdminInviteJobData> => {
    const worker = new Worker<AdminInviteJobData>(
        ADMIN_INVITE_QUEUE,
        async (job: Job<AdminInviteJobData>) => {
            const { email, token } = job.data;
            const inviteLink = `${adminPortalUrl}/admin/set-password?token=${token}`;
            await sendInvitationAdminEmail(email, inviteLink);
        },
        {
            connection: connection.duplicate(),
            concurrency: 5,
        }
    );

    worker.on("failed", (job, err) => {
        console.error(
            `❌ [AdminInviteWorker] Attempt ${job?.attemptsMade} failed for ${job?.data.email}:`,
            err.message
        );
    });

    return worker;
};
