"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processRecurringExpenses = void 0;
const expense_repository_1 = require("../modules/expense/expense.repository");
const expense_service_1 = require("../modules/expense/expense.service");
const recurringExpense_repository_1 = require("../modules/recurringExpense/recurringExpense.repository");
const nextRunDate_1 = require("../utils/nextRunDate");
const recurringExpenseRepository = new recurringExpense_repository_1.RecurringExpenseRepository();
const expenseRepository = new expense_repository_1.ExpenseRepository();
const processRecurringExpenses = async () => {
    const recurringExpenses = await recurringExpenseRepository.findDueRecurringExpenses();
    for (const recurringExpense of recurringExpenses) {
        const validRunDate = (0, nextRunDate_1.getNextValidRunDate)(recurringExpense.nextRunDate, recurringExpense.frequency);
        try {
            const existingExpense = await expenseRepository.findExpenseByRecurringAndDate(recurringExpense.id, validRunDate);
            if (existingExpense) {
                await recurringExpenseRepository.updateNextRunDate(recurringExpense.id, (0, nextRunDate_1.calculateNextRunDate)(validRunDate, recurringExpense.frequency));
                continue;
            }
            const payload = {
                amount: recurringExpense.amount,
                date: validRunDate,
                categoryId: recurringExpense.categoryId,
                userId: recurringExpense.userId,
                recurringExpenseId: recurringExpense.id,
                paymentMethod: recurringExpense.paymentMethod,
                description: recurringExpense.description ?? "",
            };
            await (0, expense_service_1.createExpenseService)(recurringExpense.userId, payload);
            await recurringExpenseRepository.updateNextRunDate(recurringExpense.id, (0, nextRunDate_1.calculateNextRunDate)(validRunDate, recurringExpense.frequency));
            console.log(`Recurring expense processed: ${recurringExpense.id}`);
        }
        catch (error) {
            // Prisma unique constraint
            if (error?.code === "P2002") {
                console.log(`Duplicate recurring expense skipped: ${recurringExpense.id}`);
                continue;
            }
            console.error(`Failed recurring expense: ${recurringExpense.id}`, error);
        }
    }
};
exports.processRecurringExpenses = processRecurringExpenses;
