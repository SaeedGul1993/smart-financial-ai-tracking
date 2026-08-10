import { invalidateSpendingAnalysisCache } from "../ai/ai.service";
import { IncomeRepository } from "./income.repository";
import { createIncomeInput, incomeFilters } from "./income.types";

const incomeRepository = new IncomeRepository();

export const createIncomeService = async (data: createIncomeInput) => {
  const result = await incomeRepository.create(data);
  await invalidateSpendingAnalysisCache(data?.userId);
  return result;
};

export const getIncomesService = async (
  userId: string,
  filters: incomeFilters,
) => {
  const data = await incomeRepository.findAll(userId, filters);
  return {
    list: data.data,
    total: data.total,
    page: Number(filters.page),
    totalPages: Math.ceil(data.total / Number(filters.limit)),
  };
};

export const getIncomeByIdService = async (id: string, userId: string) => {
  return await incomeRepository.findById(id, userId);
};

export const updateIncomeService = async (
  id: string,
  userId: string,
  data: any,
) => {
  return await incomeRepository.update(id, userId, data);
};

export const deleteIncomeService = async (id: string, userId: string) => {
  return await incomeRepository.delete(id, userId);
};

export const getIncomeAnalyticsService = async (userId: string) => {
  const [
    totalIncome,
    currentMonthIncome,
    incomeBySource,
    monthlyIncomeTrend,
    highestIncome,
    recentIncomes,
  ] = await Promise.all([
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
