"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
const monthlyRange_1 = require("../../utils/monthlyRange");
class BudgetRepository {
    async create(userId, data) {
        await this.findUserCategory(userId, data.categoryId);
        return await database_1.default.budget.create({
            data: { ...data, userId },
        });
    }
    async findUserCategory(userId, categoryId) {
        return await database_1.default.category.findFirst({
            where: {
                id: categoryId,
                OR: [
                    {
                        userId: null,
                    },
                    {
                        userId: userId,
                    },
                ],
            },
        });
    }
    async findMany(userId, month, year) {
        return await database_1.default.budget.findMany({
            where: { userId, month, year },
            include: { category: true },
            orderBy: { createdAt: "desc" },
        });
    }
    async getSpentAmount(userId, month, year) {
        const { start, end } = (0, monthlyRange_1.getMonthlyRange)(month, year);
        const expenseSummary = await database_1.default.expense.groupBy({
            by: ["categoryId"],
            _sum: { amount: true },
            where: {
                userId,
                date: { gte: start, lte: end },
            },
        });
        return expenseSummary;
    }
    async findById(id, userId) {
        return await database_1.default.budget.findFirst({
            where: { id, userId },
        });
    }
    async update(id, data) {
        return await database_1.default.budget.update({
            where: { id },
            data,
        });
    }
    async delete(id, userId) {
        return await database_1.default.budget.delete({
            where: { id, userId },
        });
    }
    async findActiveBudgets() {
        return await database_1.default.budget.findMany({
            include: {
                category: true,
                user: true,
            },
        });
    }
    async currentMonthBudgetUsage(userId) {
        const { month, year, start, end } = (0, monthlyRange_1.currentMonthRage)();
        const budgets = await database_1.default.budget.findMany({
            where: {
                userId,
                month,
                year,
            },
        });
        if (!budgets.length) {
            return {
                totalLimit: 0,
                totalUsed: 0,
                usagePercentage: 0,
            };
        }
        const totalBudgets = budgets.reduce((sum, budget) => sum + Number(budget.amount), 0);
        const expenses = await database_1.default.expense.aggregate({
            where: {
                userId,
                categoryId: {
                    in: budgets.map((budget) => budget.categoryId),
                },
                date: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const totalUsed = Number(expenses._sum.amount) || 0;
        const usagePercentage = totalBudgets > 0
            ? Number(((totalUsed / totalBudgets) * 100).toFixed(2))
            : 0;
        return {
            totalBudget: totalBudgets,
            totalUsed,
            usagePercentage,
        };
    }
}
exports.BudgetRepository = BudgetRepository;
