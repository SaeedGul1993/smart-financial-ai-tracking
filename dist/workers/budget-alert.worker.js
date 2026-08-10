"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("../config/redis"));
const budgetAlert_repository_1 = require("../modules/budgetAlert/budgetAlert.repository");
const budgetAlertTemplate_1 = require("../templates/budgetAlertTemplate");
const email_service_1 = require("../services/email.service");
const budgetAlertRepository = new budgetAlert_repository_1.BudgetAlertRepository();
const emailService = new email_service_1.EmailService();
const worker = new bullmq_1.Worker("budget-alert-queue", async (job) => {
    if (job.name === "budget-alert-job") {
        const { alertId } = job.data;
        const alert = await budgetAlertRepository.findById(alertId);
        if (!alert)
            return;
        if (alert.emailSent)
            return;
        const html = (0, budgetAlertTemplate_1.budgetAlertTemplate)({
            categoryName: alert.budget.category.name,
            amount: Number(alert.budget.amount),
            percentage: Number(alert.percentage),
            type: alert.type,
        });
        await emailService.sendEmail(alert.user.email, `Budget Alert for ${alert.budget.category.name}`, html);
        await budgetAlertRepository.markEmailSent(alert.id);
    }
}, { connection: redis_1.default });
worker.on("completed", (job) => {
    console.log(`Budget alert job completed: ${job.id}`);
});
worker.on("failed", (job, error) => {
    console.log(`Budget alert job failed: ${job?.id}`);
    console.log(error);
});
