import { Worker } from "bullmq";
import "dotenv/config";

import redis from "../config/redis";
import { BudgetAlertRepository } from "../modules/budgetAlert/budgetAlert.repository";
import { EmailService } from "../services/email.service";
import { PushNotificationService } from "../services/push-notification.service";
import { budgetAlertTemplate } from "../templates/budgetAlertTemplate";
import { NotificationRepository } from "../modules/notification/notification.repository";
import { NotificationType } from "../generated/prisma/enums";

const budgetAlertRepository = new BudgetAlertRepository();
const emailService = new EmailService();
const pushNotificationService = new PushNotificationService();
const notificationRepository = new NotificationRepository();

// ------------------------------------
// Send Budget Alert Email
// ------------------------------------

const sendBudgetAlertEmail = async (alert: any) => {
  if (alert.emailSent) {
    return;
  }

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

  console.log(`Budget alert email sent: ${alert.id}`);
};

// ------------------------------------
// Send Budget Alert Push Notification
// ------------------------------------

const sendBudgetAlertPushNotification = async (alert: any) => {
  if (alert.pushSent || !alert.user.fcmToken) {
    return;
  }

  const categoryName = alert.budget.category.name;
  const amount = Number(alert.budget.amount).toLocaleString();
  const percentage = Number(alert.percentage);
  const budgetType = alert.type;
  const body = `${categoryName}: ${budgetType} — Rs. ${amount} (${percentage}%)`;
  let notificationPayload = {
    userId: alert.userId,
    title: "Budget Alert",
    message: body,
    type: NotificationType.BUDGET_ALERT,
    budgetType,
  };
  await notificationRepository.create(notificationPayload);
  await pushNotificationService.sendToToken(
    alert.user.fcmToken,
    "Budget Alert",
    body,
  );

  await budgetAlertRepository.markPushSent(alert.id);
};

// ------------------------------------
// Budget Alert Worker
// ------------------------------------

const worker = new Worker(
  "budget-alert-queue",

  async (job) => {
    if (job.name !== "budget-alert-job") {
      return;
    }

    const { alertId } = job.data;

    const alert = await budgetAlertRepository.findById(alertId);

    if (!alert) {
      return;
    }
    // Send Push Notification
    await sendBudgetAlertPushNotification(alert);

    // Send Email
    await sendBudgetAlertEmail(alert);
  },

  {
    connection: redis,
  },
);

// ------------------------------------
// Worker Events
// ------------------------------------

worker.on("completed", (job) => {
  console.log(`Budget alert job completed: ${job.id}`);
});

worker.on("failed", (job, error) => {
  console.error(`Budget alert job failed: ${job?.id}`);
  console.error(error);
});
