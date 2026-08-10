import { HTTP_STATUS } from "../../constants/httpStatus";
import { AppError } from "../../errors/appError";
import { getBudgetStatus } from "../../utils/budgetStatus";
import { BudgetAlertRepository } from "../budgetAlert/budgetAlert.repository";
import { BudgetRepository } from "./budget.repository";
import { createBudgetInput, updateBudgetInput } from "./budget.types";

const budgetRepository = new BudgetRepository();
const budgetAlertRepository = new BudgetAlertRepository();

export const createBudgetService = async (
  userId: string,
  data: createBudgetInput,
) => {
  const { categoryId } = data;
  const category = await budgetRepository.findUserCategory(userId, categoryId);
  if (!category)
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Category not found");
  return await budgetRepository.create(userId, data);
};

export const getBudgetsService = async (
  userId: string,
  month: number,
  year: number,
) => {
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
      status: getBudgetStatus(percentage),
    };
  });
};

export const updateBudgetService = async (
  id: string,
  userId: string,
  data: updateBudgetInput,
) => {
  const budget = await budgetRepository.findById(id, userId);
  if (!budget) throw new AppError(HTTP_STATUS.NOT_FOUND, "Budget not found");
  return await budgetRepository.update(id, data);
};

export const deleteBudgetService = async (id: string, userId: string) => {
  const budget = await budgetRepository.findById(id, userId);
  if (!budget) throw new AppError(HTTP_STATUS.NOT_FOUND, "Budget not found");
  return await budgetRepository.delete(id, userId);
};

export const getBudgetsNeedingReminderService = async () => {
  const budgets = await budgetRepository.findActiveBudgets();
  const result = [];
  for (let budget of budgets) {
    const spent = await budgetAlertRepository.getSpentAmountByCategory(
      budget.category.id,
      budget.user.id,
      budget.month,
      budget.year,
    );
    const usage = Number(spent) / Number(budget.amount);
    if (usage >= 0.9) {
      result.push({
        budget,
        spent,
        usage,
        percentage: Math.round(
          (Number(spent) / Number(budget.amount)) * 100,
        ).toFixed(2),
      });
    }
  }
  return result;
};
