"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAI = exports.getAIChatFinancialContext = exports.refreshSpendingAnalysis = exports.invalidateSpendingAnalysisCache = exports.getSpendingAnalysis = exports.getFinancialHealthData = exports.getFinancialHealth = exports.analyzeSpending = void 0;
const redis_1 = __importDefault(require("../../config/redis"));
const enums_1 = require("../../generated/prisma/enums");
const aiChatPrompt_1 = require("../../utils/aiChatPrompt");
const aiFinancialContext_1 = require("../../utils/aiFinancialContext");
const cleanAIResponse_1 = require("../../utils/cleanAIResponse");
const financialHealthScore_1 = require("../../utils/financialHealthScore");
const generateAIResponse_1 = require("../../utils/generateAIResponse");
const getCurrentPeriod_1 = require("../../utils/getCurrentPeriod");
const parseAIJson_1 = require("../../utils/parseAIJson");
const budget_repository_1 = require("../budget/budget.repository");
const expense_service_1 = require("../expense/expense.service");
const income_service_1 = require("../income/income.service");
const recurringExpense_repository_1 = require("../recurringExpense/recurringExpense.repository");
const ai_repository_1 = require("./ai.repository");
const aiInsightRepository = new ai_repository_1.AIInsightRepository();
const budgetRepository = new budget_repository_1.BudgetRepository();
const recurringExpenseRepository = new recurringExpense_repository_1.RecurringExpenseRepository();
const analyzeSpending = async (userId) => {
    const [expenseAnalytics, incomeAnalytics] = await Promise.all([
        (0, expense_service_1.getExpenseSummaryAnalyticsService)(userId),
        (0, income_service_1.getIncomeAnalyticsService)(userId),
    ]);
    const financialContext = (0, aiFinancialContext_1.buildAIFinancialContext)(expenseAnalytics, incomeAnalytics);
    const prompt = `
You are a personal finance AI assistant.

Analyze the user's financial data.

Rules:
- Use only the provided financial data.
- Do not invent transactions or numbers.
- Give practical and concise financial insights.
- Identify unusual or high spending.
- Identify major spending categories.
- Analyze savings.
- Mention potential risks.
- Give actionable recommendations.
- Do not provide investment, tax, or legal advice as professional advice.

Financial Data:

${JSON.stringify(financialContext, null, 2)}

Return exactly this structure:

{
  "financialSummary": {
    "monthlyIncome": 0,
    "monthlyExpenses": 0,
    "monthlySavings": 0,
    "savingsRate": 0
  },
  "spendingInsights": [],
  "savingsAnalysis": {
    "monthlySavings": 0,
    "savingsRate": 0,
    "status": "HEALTHY",
    "message": ""
  },
  "risks": [],
  "recommendations": []
}
`;
    const aiResponse = await (0, generateAIResponse_1.generateAIResponse)(prompt);
    const parsedResponse = (0, parseAIJson_1.parseAIJson)(aiResponse);
    return parsedResponse;
};
exports.analyzeSpending = analyzeSpending;
const getFinancialHealth = async (userId) => {
    const financialData = await (0, exports.getFinancialHealthData)(userId);
    const financialHealth = (0, financialHealthScore_1.calculateFinancialHealthScore)(financialData);
    return financialHealth;
};
exports.getFinancialHealth = getFinancialHealth;
const getFinancialHealthData = async (userId) => {
    const [expenseAnalytics, incomeAnalytics, budgetPercentage, recurringExpenses,] = await Promise.all([
        (0, expense_service_1.getExpenseSummaryAnalyticsService)(userId),
        (0, income_service_1.getIncomeAnalyticsService)(userId),
        budgetRepository.currentMonthBudgetUsage(userId),
        recurringExpenseRepository.getRecurringExpenseMonthlyTotal(userId),
    ]);
    const { summary } = expenseAnalytics;
    const { MonthlyIncome } = incomeAnalytics;
    const { monthlyExpense } = summary;
    const budgetUsagePercentage = budgetPercentage.usagePercentage;
    return {
        monthlyIncome: MonthlyIncome,
        monthlyExpenses: monthlyExpense,
        budgetUsagePercentage,
        incomeSourceCount: incomeAnalytics.incomeBySource.length,
        recurringExpenses,
    };
};
exports.getFinancialHealthData = getFinancialHealthData;
const getSpendingAnalysis = async (userId) => {
    const period = (0, getCurrentPeriod_1.getCurrentPeriod)();
    const cacheKey = `ai:spending-analysis:${userId}:${period}`;
    const cacheData = await redis_1.default.get(cacheKey);
    if (cacheData) {
        return { source: "CACHE", data: JSON.parse(cacheData) };
    }
    const existingInsight = await aiInsightRepository.findByUserAndPeriod(userId, period);
    if (existingInsight &&
        existingInsight.expiresAt &&
        existingInsight.expiresAt > new Date()) {
        await redis_1.default.set(cacheKey, JSON.stringify(existingInsight.result), "EX", 60 * 60 * 24);
        return { source: "DATABASE", data: existingInsight.result };
    }
    else {
        const aiResult = await (0, exports.analyzeSpending)(userId);
        await aiInsightRepository.create({
            userId,
            period,
            result: aiResult,
            model: "gemini",
            expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000),
        });
        await redis_1.default.set(cacheKey, JSON.stringify(aiResult), "EX", 60 * 60 * 24);
        return {
            source: "AI",
            data: aiResult,
        };
    }
};
exports.getSpendingAnalysis = getSpendingAnalysis;
const invalidateSpendingAnalysisCache = async (userId) => {
    const period = (0, getCurrentPeriod_1.getCurrentPeriod)();
    const key = `ai:spending-analysis:${userId}:${period}`;
    await redis_1.default.del(key);
};
exports.invalidateSpendingAnalysisCache = invalidateSpendingAnalysisCache;
const refreshSpendingAnalysis = async (userId) => {
    const period = (0, getCurrentPeriod_1.getCurrentPeriod)();
    const cacheKey = `ai:spending-analysis:${userId}${period}`;
    const aiResult = await (0, exports.analyzeSpending)(userId);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    console.log("aiResult", aiResult);
    const existingAIInsight = await aiInsightRepository.findByUserAndPeriod(userId, period);
    if (existingAIInsight) {
        await aiInsightRepository.updateAIInsights(existingAIInsight.id, {
            result: aiResult,
            model: "gemini",
            expiresAt,
        });
    }
    else {
        await aiInsightRepository.create({
            userId,
            period,
            result: aiResult,
            model: "gemini",
            expiresAt,
        });
    }
    await redis_1.default.set(cacheKey, JSON.stringify(aiResult), "EX", 60 * 60 * 24);
    return {
        data: aiResult,
        source: "AI_REFRESH",
    };
};
exports.refreshSpendingAnalysis = refreshSpendingAnalysis;
const getAIChatFinancialContext = async (userId) => {
    const [expenseAnalytics, incomeAnalytics, budgetData, recurringData] = await Promise.all([
        (0, expense_service_1.getExpenseSummaryAnalyticsService)(userId),
        (0, income_service_1.getIncomeAnalyticsService)(userId),
        budgetRepository.currentMonthBudgetUsage(userId),
        recurringExpenseRepository.getRecurringExpenseMonthlyTotal(userId),
    ]);
    const monthlyIncome = Number(incomeAnalytics.MonthlyIncome) || 0;
    const monthlyExpenses = Number(expenseAnalytics.summary.monthlyExpense) || 0;
    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0
        ? Number(((monthlySavings / monthlyIncome) * 100).toFixed(2))
        : 0;
    return {
        income: {
            monthly: monthlyIncome,
            sources: incomeAnalytics.incomeBySource?.map((item) => ({
                source: item.source,
                amount: Number(item.amount),
                percentage: Number(item.percentage),
            })) || [],
        },
        expenses: {
            monthly: monthlyExpenses,
            categories: expenseAnalytics.categoryBreakdown?.map((item) => ({
                name: item.name,
                amount: Number(item.amount),
                percentage: Number(item.percentage),
            })) || [],
            highestExpense: expenseAnalytics.highestExpense
                ? {
                    amount: Number(expenseAnalytics.highestExpense.amount),
                    description: expenseAnalytics.highestExpense.description,
                    category: expenseAnalytics.highestExpense.category,
                }
                : null,
        },
        savings: {
            monthly: monthlySavings,
            rate: savingsRate,
        },
        budget: {
            totalBudget: budgetData.totalBudget,
            totalUsed: budgetData.totalUsed,
            usagePercentage: budgetData.usagePercentage,
        },
        recurring: {
            monthly: recurringData,
        },
    };
};
exports.getAIChatFinancialContext = getAIChatFinancialContext;
const chatWithAI = async (userId, data) => {
    const { history, message } = data;
    const financialContext = await (0, exports.getAIChatFinancialContext)(userId);
    const prompt = (0, aiChatPrompt_1.buildAIChatPrompt)(financialContext, history || [], message);
    const aiResponse = (0, generateAIResponse_1.generateAIResponse)(prompt);
    const parsedResponse = (0, cleanAIResponse_1.cleanAIResponse)(await aiResponse);
    return {
        response: parsedResponse,
        role: enums_1.AIMessageRole.ASSISTANT,
    };
};
exports.chatWithAI = chatWithAI;
