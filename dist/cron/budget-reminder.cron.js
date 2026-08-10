"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBudgetReminderCron = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const budget_reminder_service_1 = require("../services/budget-reminder.service");
const startBudgetReminderCron = () => {
    // Morning 9 AM
    node_cron_1.default.schedule("0 9 * * *", async () => {
        await (0, budget_reminder_service_1.processBudgetReminderService)();
    }, {
        timezone: "Asia/Karachi",
    });
    // Night 11 PM
    node_cron_1.default.schedule("0 23 * * *", async () => {
        await (0, budget_reminder_service_1.processBudgetReminderService)();
    }, {
        timezone: "Asia/Karachi",
    });
};
exports.startBudgetReminderCron = startBudgetReminderCron;
