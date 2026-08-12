import { HTTP_STATUS } from "../../constants/httpStatus";
import { AppError } from "../../errors/appError";
import {
  PaymentMethod,
  RecurringFrequency,
} from "../../generated/prisma/enums";
import { CloudinaryService } from "../../services/cloudinary.service";
import { ReceiptAIService } from "../../services/receipt-ai.service";
import { calculateNextRunDate } from "../../utils/nextRunDate";
import { invalidateSpendingAnalysisCache } from "../ai/ai.service";
import { checkBudgetAlert } from "../budgetAlert/budgetAlert.service";
import { CategoryRepository } from "../category/category.repository";
import { RecurringExpenseRepository } from "../recurringExpense/recurringExpense.repository";
import { ExpenseRepository } from "./expense.repository";
import {
  createExpenseInput,
  ExpenseAnalyticsResponse,
  expenseFilter,
  updateExpenseInput,
} from "./expense.types";

const expenseRepository = new ExpenseRepository();
const categoryRepository = new CategoryRepository();
const recurringExpenseRepository = new RecurringExpenseRepository();
const receiptAiService = new ReceiptAIService();
const cloudinaryService = new CloudinaryService();

export const createExpenseService = async (
  userId: string,
  data: createExpenseInput,
) => {
  const { categoryId, isRecurring, frequency } = data;
  const category = await categoryRepository.findById(categoryId);
  if (!category)
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Category not found");
  let recurringExpense;
  if (isRecurring) {
    recurringExpense = await recurringExpenseRepository.create({
      amount: data.amount,
      categoryId,
      userId,
      description: data.description ?? "",
      paymentMethod: data.paymentMethod as PaymentMethod,
      nextRunDate: calculateNextRunDate(
        data.date,
        frequency as RecurringFrequency,
      ),
      startDate: data.date,
      frequency: frequency as RecurringFrequency,
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
  await checkBudgetAlert(userId, expense.categoryId);
  await invalidateSpendingAnalysisCache(userId);
  return expense;
};

export const getExpensesService = async (
  userId: string,
  filters: expenseFilter,
) => {
  return await expenseRepository.findAll(userId, filters);
};

export const updateExpenseService = async (
  expenseId: string,
  userId: string,
  data: updateExpenseInput,
) => {
  const expense = await expenseRepository.findById(expenseId, userId);
  if (!expense)
    throw new AppError(
      HTTP_STATUS.NOT_FOUND,
      "You are not authorized to update this expense",
    );
  return await expenseRepository.update(expenseId, userId, data);
};

export const deleteExpenseService = async (
  expenseId: string,
  userId: string,
) => {
  const expense = await expenseRepository.findById(expenseId, userId);
  if (!expense)
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to delete this expense",
    );
  return await expenseRepository.delete(expenseId, userId);
};

export const getExpenseSummaryAnalyticsService = async (
  userId: string,
): Promise<ExpenseAnalyticsResponse> => {
  const [
    totalExpense,
    todayExpense,
    monthlyExpense,
    averageExpense,
    transactionCount,
    categoryBreakdown,
    highestExpense,
    recentExpenses,
    recurringExpenses,
  ] = await Promise.all([
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

  async function getMonthlyExpenseTrend(userId: string) {
    const result: any = await expenseRepository.getMonthlyExpenseTrend(userId);
    return result.map((item: any) => {
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

export const scanReceiptService = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const receiptUrl = await cloudinaryService.uploadPicture(file.buffer);
  const categories = await categoryRepository.findAllByUserId(userId);
  const extracted = await receiptAiService.extractReceipt(
    receiptUrl.secure_url,
    categories,
  );
  let verifyCategoryId = extracted.categoryId;
  if (verifyCategoryId) {
    let check = categories?.some(
      (category) => category.id === verifyCategoryId,
    );
    if (!check) {
      verifyCategoryId = null;
    }
  }
  return {
    ...extracted,
    categoryId: verifyCategoryId,
    receiptUrl: receiptUrl.secure_url,
  };
};
