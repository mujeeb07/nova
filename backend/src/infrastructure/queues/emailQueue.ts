import { Queue } from "bullmq";
import { connection } from "../config/config.queue";

export interface IEmailJobData {
  email: string;
  otp: string;
}

export const emailQueue = new Queue<IEmailJobData>('email-queue', { connection });

export const queueEmail = async (data: IEmailJobData) => {
  await emailQueue.add('send-email', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  });
};
