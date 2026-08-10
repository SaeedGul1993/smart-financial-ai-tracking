import "dotenv/config";
import { Worker } from "bullmq";
import redis from "../config/redis";
import { BudgetAlertRepository } from "../modules/budgetAlert/budgetAlert.repository";
import { budgetAlertTemplate } from "../templates/budgetAlertTemplate";
import { EmailService } from "../services/email.service";

const budgetAlertRepository = new BudgetAlertRepository();
const emailService = new EmailService();

const worker = new Worker(
  "budget-alert-queue",
  async (job) => {
    if (job.name === "budget-alert-job") {
      const { alertId } = job.data;
      const alert = await budgetAlertRepository.findById(alertId);
      if (!alert) return;
      if (alert.emailSent) return;
      const html = budgetAlertTemplate({
        categoryName: alert.budget.category.name,
        amount: Number(alert.budget.amount),
        percentage: Number(alert.percentage),
        type: alert.type,
      });
      await emailService.sendEmail(
        alert.user.email,
        `Budget Alert for ${alert.budget.category.name}`,
        html,
      );
      await budgetAlertRepository.markEmailSent(alert.id);
    }
  },
  { connection: redis },
);

worker.on("completed", (job) => {
  console.log(`Budget alert job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.log(`Budget alert job failed: ${job?.id}`);
  console.log(error);
});
