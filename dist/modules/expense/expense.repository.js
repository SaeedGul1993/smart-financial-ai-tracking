"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
const monthlyRange_1 = require("../../utils/monthlyRange");
class ExpenseRepository {
    async create(data) {
        return await database_1.default.expense.create({
            data,
        });
    }
    async findAll(userId, filters) {
        const { page, limit, categoryId, paymentMethod, startDate, endDate } = filters;
        const skip = ((Number(page) ?? 1) - 1) * (Number(limit) ?? 10);
        const where = {
            userId,
            ...(categoryId && { categoryId }),
            ...(paymentMethod && { paymentMethod }),
            ...(startDate && { date: { gte: startDate } }),
            ...(endDate && { date: { lte: endDate } }),
        };
        return await database_1.default.expense.findMany({
            where: where,
            include: {
                category: true,
            },
            orderBy: {
                date: "desc",
            },
            skip,
            take: Number(limit) ?? 10,
        });
    }
    async findById(id, userId) {
        return await database_1.default.expense.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                category: true,
            },
        });
    }
    async update(id, userId, data) {
        return await database_1.default.expense.update({
            where: {
                id,
                userId,
            },
            data,
        });
    }
    async delete(id, userId) {
        return await database_1.default.expense.delete({
            where: {
                id,
                userId,
            },
        });
    }
    async getTotalExpense(userId) {
        const result = await database_1.default.expense.aggregate({
            where: { userId },
            _sum: {
                amount: true,
            },
        });
        return Number(result._sum.amount ?? 0);
    }
    async getTodayExpense(userId) {
        const { start, end } = await (0, monthlyRange_1.getTodayRange)();
        const result = await database_1.default.expense.aggregate({
            where: { userId, date: { gte: start, lte: end } },
            _sum: {
                amount: true,
            },
        });
        return Number(result._sum.amount ?? 0);
    }
    async getMonthlyExpense(userId) {
        const { start, end } = await (0, monthlyRange_1.getCurrentMonthRange)();
        const result = await database_1.default.expense.aggregate({
            where: {
                userId,
                date: {
                    gte: start,
                    lte: end,
                },
            },
            _sum: {
                amount: true,
            },
        });
        return Number(result._sum.amount ?? 0);
    }
    async getAverageExpense(userId) {
        const result = await database_1.default.expense.aggregate({
            where: { userId },
            _avg: {
                amount: true,
            },
        });
        return Number(result._avg.amount ?? 0);
    }
    async getExpenseCount(userId) {
        return database_1.default.expense.count({ where: { userId } });
    }
    async getCategoryBreakdown(userId) {
        const groupedExpenses = await database_1.default.expense.groupBy({
            by: ["categoryId"],
            where: {
                userId,
            },
            _sum: {
                amount: true,
            },
        });
        const categoryIds = groupedExpenses.map((item) => item.categoryId);
        const categories = await database_1.default.category.findMany({
            where: {
                id: {
                    in: categoryIds,
                },
            },
            select: {
                id: true,
                name: true,
                type: true,
            },
        });
        const expenseMap = new Map(groupedExpenses.map((item) => [
            item.categoryId,
            Number(item._sum.amount ?? 0),
        ]));
        const totalExpense = await this.getTotalExpense(userId);
        return categories.map((category) => ({
            ...category,
            amount: expenseMap.get(category.id) ?? 0,
            percentage: Math.round(((expenseMap.get(category.id) ?? 0) / totalExpense) * 100),
        }));
    }
    async getMonthlyExpenseTrend(userId) {
        const data = await database_1.default.$queryRaw `
  
      SELECT
        DATE_TRUNC('month', "date") AS month,
        SUM(amount) AS total_amount
  
      FROM "Expense"
  
      WHERE "userId" = ${userId}
  
      GROUP BY month
  
      ORDER BY month DESC
  
    `;
        return data;
    }
    async getHighestExpense(userId) {
        return database_1.default.expense.findFirst({
            where: { userId },
            orderBy: { amount: "desc" },
            include: {
                category: true,
            },
        });
    }
    async getRecentExpenses(userId) {
        return database_1.default.expense.findMany({
            where: { userId },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
            include: {
                category: true,
            },
        });
    }
    async findExpenseByRecurringAndDate(recurringExpenseId, date) {
        return database_1.default.expense.findFirst({
            where: {
                recurringExpenseId,
                date,
            },
        });
    }
}
exports.ExpenseRepository = ExpenseRepository;
