"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetsNeedingReminderService = exports.deleteBudgetService = exports.updateBudgetService = exports.getBudgetsService = exports.createBudgetService = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const appError_1 = require("../../errors/appError");
const budgetStatus_1 = require("../../utils/budgetStatus");
const budgetAlert_repository_1 = require("../budgetAlert/budgetAlert.repository");
const budget_repository_1 = require("./budget.repository");
const budgetRepository = new budget_repository_1.BudgetRepository();
const budgetAlertRepository = new budgetAlert_repository_1.BudgetAlertRepository();
const createBudgetService = async (userId, data) => {
    const { categoryId } = data;
    const category = await budgetRepository.findUserCategory(userId, categoryId);
    if (!category)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Category not found");
    return await budgetRepository.create(userId, data);
};
exports.createBudgetService = createBudgetService;
const getBudgetsService = async (userId, month, year) => {
    const [budgets, expenseSummary] = await Promise.all([
        budgetRepository.findMany(userId, month, year),
        budgetRepository.getSpentAmount(userId, month, year),
    ]);
    const spentMap = new Map();
    for (const item of expenseSummary) {
        spentMap.set(item.categoryId, item._sum.amount);
    }
    return budgets.map((item) => {
        const { categoryId, amount } = item;
        const spent = spentMap.get(categoryId) ?? 0;
        const remaining = Math.max(Number(amount) - Number(spent), 0);
        const percentage = Math.round((Number(spent) / Number(amount)) * 100);
        return {
            ...item,
            spent,
            remaining,
            percentage,
            status: (0, budgetStatus_1.getBudgetStatus)(percentage),
        };
    });
};
exports.getBudgetsService = getBudgetsService;
const updateBudgetService = async (id, userId, data) => {
    const budget = await budgetRepository.findById(id, userId);
    if (!budget)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Budget not found");
    return await budgetRepository.update(id, data);
};
exports.updateBudgetService = updateBudgetService;
const deleteBudgetService = async (id, userId) => {
    const budget = await budgetRepository.findById(id, userId);
    if (!budget)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Budget not found");
    return await budgetRepository.delete(id, userId);
};
exports.deleteBudgetService = deleteBudgetService;
const getBudgetsNeedingReminderService = async () => {
    const budgets = await budgetRepository.findActiveBudgets();
    const result = [];
    for (let budget of budgets) {
        const spent = await budgetAlertRepository.getSpentAmountByCategory(budget.category.id, budget.user.id, budget.month, budget.year);
        const usage = Number(spent) / Number(budget.amount);
        if (usage >= 0.9) {
            result.push({
                budget,
                spent,
                usage,
                percentage: Math.round((Number(spent) / Number(budget.amount)) * 100).toFixed(2),
            });
        }
    }
    return result;
};
exports.getBudgetsNeedingReminderService = getBudgetsNeedingReminderService;
