import { Queue } from "bullmq";
import redis from "../config/redis";

export const budgetAlertQueue = new Queue("budget-alert-queue", {
  connection: redis,
});
