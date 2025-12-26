import { Queue } from "bullmq";
import { client } from "../../Config/redisConfig.js";

export const paymentQueue = new Queue("payment-queue", {
  connection: client,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
