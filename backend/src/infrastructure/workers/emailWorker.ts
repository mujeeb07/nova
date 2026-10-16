import { Worker, Job } from "bullmq";
import { sendOtpEmail } from "../services/otp_service";
import { connection } from "../config/config.queue";


const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    console.log(`Processing email job ${job.id}}`);
    await sendOtpEmail(job.data.email, job.data.otp)
    console.log(`Email job ${job.id} completed successfully.`);
  },
  { connection }
);

emailWorker.on('active', (job: Job) => {
  console.log(`🏃 Job ${job.id} has started processing.`);
});


emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});