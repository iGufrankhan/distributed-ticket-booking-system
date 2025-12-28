import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const paymentQueue = new Queue("payment-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,            // retry 3 times
    backoff: {
      type: "exponential",
      delay: 5000           // 5 sec
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
