"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenseSummaryAnalyticsService = exports.deleteExpenseService = exports.updateExpenseService = exports.getExpensesService = exports.createExpenseService = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const appError_1 = require("../../errors/appError");
const nextRunDate_1 = require("../../utils/nextRunDate");
const ai_service_1 = require("../ai/ai.service");
const budgetAlert_service_1 = require("../budgetAlert/budgetAlert.service");
const category_repository_1 = require("../category/category.repository");
const recurringExpense_repository_1 = require("../recurringExpense/recurringExpense.repository");
const expense_repository_1 = require("./expense.repository");
const expenseRepository = new expense_repository_1.ExpenseRepository();
const categoryRepository = new category_repository_1.CategoryRepository();
const recurringExpenseRepository = new recurringExpense_repository_1.RecurringExpenseRepository();
const createExpenseService = async (userId, data) => {
    const { categoryId, isRecurring, frequency } = data;
    const category = await categoryRepository.findById(categoryId);
    if (!category)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Category not found");
    let recurringExpense;
    if (isRecurring) {
        recurringExpense = await recurringExpenseRepository.create({
            amount: data.amount,
            categoryId,
            userId,
            description: data.description ?? "",
            paymentMethod: data.paymentMethod,
            nextRunDate: (0, nextRunDate_1.calculateNextRunDate)(data.date, frequency),
            startDate: data.date,
            frequency: frequency,
        });
    }
    const expense = await expenseRepository.create({
        amount: data.amount,
        date: data.date,
        description: data.description,
        paymentMethod: data.paymentMethod,
        receiptUrl: data.receiptUrl,
        categoryId,
        userId,
        recurringExpenseId: recurringExpense?.id,
    });
    await (0, budgetAlert_service_1.checkBudgetAlert)(userId, expense.categoryId);
    await (0, ai_service_1.invalidateSpendingAnalysisCache)(userId);
    return expense;
};
exports.createExpenseService = createExpenseService;
const getExpensesService = async (userId, filters) => {
    return await expenseRepository.findAll(userId, filters);
};
exports.getExpensesService = getExpensesService;
const updateExpenseService = async (expenseId, userId, data) => {
    const expense = await expenseRepository.findById(expenseId, userId);
    if (!expense)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "You are not authorized to update this expense");
    return await expenseRepository.update(expenseId, userId, data);
};
exports.updateExpenseService = updateExpenseService;
const deleteExpenseService = async (expenseId, userId) => {
    const expense = await expenseRepository.findById(expenseId, userId);
    if (!expense)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to delete this expense");
    return await expenseRepository.delete(expenseId, userId);
};
exports.deleteExpenseService = deleteExpenseService;
const getExpenseSummaryAnalyticsService = async (userId) => {
    const [totalExpense, todayExpense, monthlyExpense, averageExpense, transactionCount, categoryBreakdown, highestExpense, recentExpenses, recurringExpenses,] = await Promise.all([
        expenseRepository.getTotalExpense(userId),
        expenseRepository.getTodayExpense(userId),
        expenseRepository.getMonthlyExpense(userId),
        expenseRepository.getAverageExpense(userId),
        expenseRepository.getExpenseCount(userId),
        expenseRepository.getCategoryBreakdown(userId),
        expenseRepository.getHighestExpense(userId),
        expenseRepository.getRecentExpenses(userId),
        recurringExpenseRepository.findByUser(userId),
    ]);
    return {
        summary: {
            totalExpense,
            todayExpense,
            monthlyExpense,
            averageExpense,
            transactionCount,
        },
        categoryBreakdown,
        monthlyTrend: await getMonthlyExpenseTrend(userId),
        highestExpense: highestExpense
            ? {
                id: highestExpense.id,
                amount: Number(highestExpense.amount),
                description: highestExpense.description,
                date: highestExpense.date,
                category: highestExpense.category.name,
            }
            : null,
        recentExpenses: recentExpenses
            ? recentExpenses.map((item) => ({
                id: item.id,
                amount: Number(item.amount),
                description: item.description,
                date: item.date,
                category: item.category.name,
            }))
            : [],
        recurringExpenses: recurringExpenses
            ? recurringExpenses.map((item) => ({
                id: item.id,
                amount: Number(item.amount),
                description: item.description,
                nextRunDate: item.nextRunDate,
                frequency: item.frequency,
                isActive: item.isActive,
                category: {
                    id: item.category.id,
                    name: item.category.name,
                    type: item.category.type,
                },
            }))
            : [],
    };
    async function getMonthlyExpenseTrend(userId) {
        const result = await expenseRepository.getMonthlyExpenseTrend(userId);
        return result.map((item) => {
            const date = new Date(item.month);
            return {
                month: date.toLocaleString("en-US", {
                    month: "short",
                }),
                amount: Number(item.total_amount),
            };
        });
    }
};
exports.getExpenseSummaryAnalyticsService = getExpenseSummaryAnalyticsService;
