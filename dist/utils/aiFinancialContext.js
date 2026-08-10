"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAIFinancialContext = void 0;
const buildAIFinancialContext = (expense, income) => {
    const monthlyIncome = Number(income.MonthlyIncome);
    const monthlyExpense = Number(expense.summary.monthlyExpense);
    const monthlySavings = monthlyIncome - monthlyExpense;
    const savingRate = monthlyIncome > 0
        ? Number(((monthlySavings / monthlyIncome) * 100).toFixed(2))
        : 0;
    return {
        income: {
            monthly: monthlyIncome,
            sources: income.incomeBySource.map((item) => ({
                source: item.source,
                amount: Number(item.amount),
                percentage: Number(item.percentage),
            })),
            monthlyTrend: income.MonthlyIncomeTrend.map((item) => ({
                month: item.month,
                amount: Number(item.amount),
            })),
        },
        expenses: {
            monthly: monthlyExpense,
            today: Number(expense.summary.todayExpense),
            averageTransaction: Number(expense.summary.averageExpense.toFixed(2)),
            transactionCount: expense.summary.transactionCount,
            categories: expense.categoryBreakdown.map((item) => ({
                category: item.name,
                amount: Number(item.amount),
                percentage: Number(item.percentage),
            })),
            monthlyTrend: expense.monthlyTrend.map((item) => ({
                month: item.month,
                amount: Number(item.amount),
            })),
            highestExpense: expense.highestExpense
                ? {
                    amount: Number(expense.highestExpense.amount),
                    description: expense.highestExpense.description,
                    category: expense.highestExpense.category,
                    date: expense.highestExpense.date,
                }
                : null,
            recentExpenses: expense.recentExpenses.map((item) => ({
                amount: Number(item.amount),
                description: item.description,
                category: item.category,
                date: item.date,
            })),
        },
        savings: {
            amount: Number(monthlySavings.toFixed(2)),
            rate: savingRate,
        },
    };
};
exports.buildAIFinancialContext = buildAIFinancialContext;
