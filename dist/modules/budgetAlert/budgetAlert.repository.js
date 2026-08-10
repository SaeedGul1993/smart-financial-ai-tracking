"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetAlertRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
const monthlyRange_1 = require("../../utils/monthlyRange");
class BudgetAlertRepository {
    async create(data) {
        return await database_1.default.budgetAlert.create({
            data: {
                ...data,
                type: data.type,
            },
        });
    }
    async update(alertId, data) {
        return await database_1.default.budgetAlert.update({
            where: { id: alertId },
            data: { ...data },
        });
    }
    async findRecentAlert(budgetId, type) {
        return await database_1.default.budgetAlert.findFirst({
            where: { budgetId, type },
            orderBy: { createdAt: "desc" },
        });
    }
    async findRecentAlertForNotifications(budgetId, type, limit = 2) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - limit);
        return await database_1.default.budgetAlert.findFirst({
            where: { budgetId, type, createdAt: { gte: dateLimit } },
            orderBy: { createdAt: "desc" },
        });
    }
    async findById(budgetAlertId) {
        return await database_1.default.budgetAlert.findFirst({
            where: { id: budgetAlertId },
            orderBy: { createdAt: "desc" },
            include: { user: true, budget: { include: { category: true } } },
        });
    }
    async findBudgetByCategoryAndUser(categoryId, userId) {
        return await database_1.default.budget.findFirst({
            where: { categoryId, userId },
            include: { category: true },
        });
    }
    async getSpentAmount(userId, month, year, categoryId) {
        const { start, end } = (0, monthlyRange_1.getMonthlyRange)(month, year);
        const spent = await database_1.default.expense.aggregate({
            _sum: { amount: true },
            where: { userId, date: { gte: start, lte: end }, categoryId },
        });
        return Number(spent._sum.amount) || 0;
    }
    async getSpentAmountByCategory(categoryId, userId, month, year) {
        const { start, end } = (0, monthlyRange_1.getMonthlyRange)(month, year);
        const spent = await database_1.default.expense.aggregate({
            _sum: { amount: true },
            where: { userId, categoryId, date: { gte: start, lte: end } },
        });
        return Number(spent._sum.amount) || 0;
    }
    async markEmailSent(budgetAlertId) {
        return await database_1.default.budgetAlert.update({
            where: { id: budgetAlertId },
            data: { emailSent: true, emailSentAt: new Date() },
        });
    }
    async findAlert(budgetId, type) {
        return database_1.default.budgetAlert.findFirst({
            where: {
                budgetId,
                type,
            },
        });
    }
    async canSendReminder(alertId) {
        const alert = await database_1.default.budgetAlert.findUnique({
            where: {
                id: alertId,
            },
        });
        if (!alert?.lastReminderSentAt) {
            return true;
        }
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return alert.lastReminderSentAt <= twoDaysAgo;
    }
}
exports.BudgetAlertRepository = BudgetAlertRepository;
