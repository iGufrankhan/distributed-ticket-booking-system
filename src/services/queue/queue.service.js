import Queue from "bull";
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USERNAME } from "../../../utils/constant.js";

export const paymentQueue = new Queue("payment-queue", {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000, // 5 seconds
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

paymentQueue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

paymentQueue.on('failed', (job, err) => {
  console.log(`❌ Job ${job.id} failed:`, err.message);
});

console.log('Payment queue initialized');
