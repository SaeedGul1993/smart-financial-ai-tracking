"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBudgetAlert = void 0;
const budget_alert_queue_1 = require("../../queues/budget-alert.queue");
const budgetAlert_repository_1 = require("./budgetAlert.repository");
const budgetAlertRepository = new budgetAlert_repository_1.BudgetAlertRepository();
const checkBudgetAlert = async (userId, categoryId) => {
    const budget = await budgetAlertRepository.findBudgetByCategoryAndUser(categoryId, userId);
    if (!budget) {
        return;
    }
    const totalAmount = await budgetAlertRepository.getSpentAmount(userId, budget.month, budget.year, categoryId);
    const percentage = Number(((totalAmount / Number(budget.amount)) * 100).toFixed(2));
    let type = null;
    if (percentage >= 100) {
        type = "EXCEEDED";
    }
    else if (percentage >= 80) {
        type = "WARNING";
    }
    if (!type)
        return null;
    const existingAlert = await budgetAlertRepository.findRecentAlert(budget.id, type);
    if (existingAlert)
        return existingAlert;
    const alert = await budgetAlertRepository.create({
        userId,
        budgetId: budget.id,
        type,
        percentage,
        message: `${budget.category.name} budget is ${type}.`,
        pushSent: false,
        pushSentAt: new Date(),
    });
    await budget_alert_queue_1.budgetAlertQueue.add("budget-alert-job", {
        alertId: alert.id,
    }, { attempts: 3, backoff: { type: "exponential", delay: 5000 } });
    return alert;
};
exports.checkBudgetAlert = checkBudgetAlert;
