"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBudgetReminderService = void 0;
const enums_1 = require("../generated/prisma/enums");
const budget_service_1 = require("../modules/budget/budget.service");
const budgetAlert_repository_1 = require("../modules/budgetAlert/budgetAlert.repository");
const budget_alert_queue_1 = require("../queues/budget-alert.queue");
const budgetAlertRepository = new budgetAlert_repository_1.BudgetAlertRepository();
const processBudgetReminderService = async () => {
    const needReminderBudgets = await (0, budget_service_1.getBudgetsNeedingReminderService)();
    for (let needReminderBudget of needReminderBudgets) {
        const { budget, percentage } = needReminderBudget;
        let type = null;
        if (Number(percentage) >= 100) {
            type = enums_1.BudgetAlertType.EXCEEDED;
        }
        else if (Number(percentage) >= 90) {
            type = enums_1.BudgetAlertType.WARNING;
        }
        else {
            continue;
        }
        const existingAlert = await budgetAlertRepository.findAlert(budget.id, type);
        let alert = null;
        if (existingAlert) {
            const canSendReminder = await budgetAlertRepository.canSendReminder(existingAlert.id);
            if (!canSendReminder)
                continue;
            alert = await budgetAlertRepository.update(existingAlert.id, {
                lastReminderSentAt: new Date(),
            });
        }
        else {
            alert = await budgetAlertRepository.create({
                userId: budget.user.id,
                budgetId: budget.id,
                type,
                percentage: Number(percentage),
                message: `${budget.category.name} budget is ${type}.`,
                pushSentAt: new Date(),
                pushSent: false,
            });
        }
        await budget_alert_queue_1.budgetAlertQueue.add("budget-alert-job", {
            alertId: alert.id,
        }, { attempts: 3, backoff: { type: "exponential", delay: 5000 } });
    }
};
exports.processBudgetReminderService = processBudgetReminderService;
