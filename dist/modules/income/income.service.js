"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomeAnalyticsService = exports.deleteIncomeService = exports.updateIncomeService = exports.getIncomeByIdService = exports.getIncomesService = exports.createIncomeService = void 0;
const ai_service_1 = require("../ai/ai.service");
const income_repository_1 = require("./income.repository");
const incomeRepository = new income_repository_1.IncomeRepository();
const createIncomeService = async (data) => {
    const result = await incomeRepository.create(data);
    await (0, ai_service_1.invalidateSpendingAnalysisCache)(data?.userId);
    return result;
};
exports.createIncomeService = createIncomeService;
const getIncomesService = async (userId, filters) => {
    const data = await incomeRepository.findAll(userId, filters);
    return {
        list: data.data,
        total: data.total,
        page: Number(filters.page),
        totalPages: Math.ceil(data.total / Number(filters.limit)),
    };
};
exports.getIncomesService = getIncomesService;
const getIncomeByIdService = async (id, userId) => {
    return await incomeRepository.findById(id, userId);
};
exports.getIncomeByIdService = getIncomeByIdService;
const updateIncomeService = async (id, userId, data) => {
    return await incomeRepository.update(id, userId, data);
};
exports.updateIncomeService = updateIncomeService;
const deleteIncomeService = async (id, userId) => {
    return await incomeRepository.delete(id, userId);
};
exports.deleteIncomeService = deleteIncomeService;
const getIncomeAnalyticsService = async (userId) => {
    const [totalIncome, currentMonthIncome, incomeBySource, monthlyIncomeTrend, highestIncome, recentIncomes,] = await Promise.all([
        incomeRepository.getTotalIncome(userId),
        incomeRepository.getCurrentMonthIncome(userId),
        incomeRepository.getIncomeBySource(userId),
        incomeRepository.getMonthlyIncomeTrend(userId),
        incomeRepository.getHighestIncome(userId),
        incomeRepository.getRecentIncomes(userId),
    ]);
    return {
        totalIncome: Number(totalIncome),
        MonthlyIncome: Number(currentMonthIncome),
        incomeBySource: incomeBySource,
        MonthlyIncomeTrend: monthlyIncomeTrend,
        highestIncome: highestIncome,
        recentIncomes: recentIncomes,
    };
};
exports.getIncomeAnalyticsService = getIncomeAnalyticsService;
