"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecurringExpenseRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
const enums_1 = require("../../generated/prisma/enums");
class RecurringExpenseRepository {
    async create(data) {
        return database_1.default.recurringExpense.create({
            data,
        });
    }
    async findDueRecurringExpenses() {
        return database_1.default.recurringExpense.findMany({
            where: {
                isActive: true,
                nextRunDate: {
                    lte: new Date(),
                },
            },
        });
    }
    async updateNextRunDate(id, nextRunDate) {
        return await database_1.default.recurringExpense.update({
            where: { id },
            data: { nextRunDate, isActive: true },
        });
    }
    async findByUser(userId) {
        return await database_1.default.recurringExpense.findMany({
            where: { userId },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async pauseRecurringExpense(id) {
        return await database_1.default.recurringExpense.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async resumeRecurringExpense(id) {
        return await database_1.default.recurringExpense.update({
            where: { id },
            data: { isActive: true },
        });
    }
    async findById(id) {
        const result = await database_1.default.recurringExpense.findUnique({
            where: { id },
        });
        return result;
    }
    async getRecurringExpenseMonthlyTotal(userId) {
        const recurringExpenses = await database_1.default.recurringExpense.findMany({
            where: {
                userId,
                isActive: true,
            },
            select: {
                amount: true,
                frequency: true,
            },
        });
        let monthlyTotal = 0;
        for (const recurringExpense of recurringExpenses) {
            const amount = Number(recurringExpense.amount);
            switch (recurringExpense.frequency) {
                case enums_1.RecurringFrequency.DAILY:
                    monthlyTotal += amount * 30;
                    break;
                case enums_1.RecurringFrequency.WEEKLY:
                    monthlyTotal += amount * 4.33;
                    break;
                case enums_1.RecurringFrequency.MONTHLY:
                    monthlyTotal += amount;
                    break;
                case enums_1.RecurringFrequency.YEARLY:
                    monthlyTotal += amount / 12;
                    break;
                default:
                    break;
            }
        }
        return Number(monthlyTotal.toFixed(2));
    }
}
exports.RecurringExpenseRepository = RecurringExpenseRepository;
