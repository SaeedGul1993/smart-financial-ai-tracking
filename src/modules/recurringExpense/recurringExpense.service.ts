import { HTTP_STATUS } from "../../constants/httpStatus";
import { AppError } from "../../errors/appError";
import { calculateNextRunDate } from "../../utils/nextRunDate";
import { RecurringExpenseRepository } from "./recurringExpense.repository";
import { CreateRecurringExpenseInput } from "./recurringExpense.types";

const recurringExpenseRepository = new RecurringExpenseRepository();

export const createRecurringExpenseService = async (
  input: CreateRecurringExpenseInput,
) => {
  return await recurringExpenseRepository.create(input);
};

export const getRecurringExpensesService = async (userId: string) => {
  return await recurringExpenseRepository.findByUser(userId);
};

export const pauseRecurringExpenseService = async (
  id: string,
  userId: string,
) => {
  const recurringExpense = await recurringExpenseRepository.findById(id);
  console.log(recurringExpense, "recurringExpense");
  if (!recurringExpense)
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Recurring expense not found");
  if (recurringExpense.userId !== userId)
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to pause this recurring expense",
    );
  if (!recurringExpense.isActive)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Recurring expense is already inActive",
    );
  return await recurringExpenseRepository.pauseRecurringExpense(id);
};

export const resumeRecurringExpenseService = async (
  id: string,
  userId: string,
) => {
  const recurringExpense = await recurringExpenseRepository.findById(id);
  if (!recurringExpense)
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Recurring expense not found");
  if (recurringExpense.userId !== userId)
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to resume this recurring expense",
    );
  if (recurringExpense.isActive)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "Recurring expense is already active",
    );
  let nextRunDate = new Date(recurringExpense.nextRunDate);
  const today = new Date();
  if (nextRunDate <= today) {
    while (nextRunDate <= today) {
      nextRunDate = calculateNextRunDate(
        nextRunDate,
        recurringExpense.frequency,
      );
    }
  }
  const updatedNextRunDate = recurringExpenseRepository.updateNextRunDate(
    id,
    nextRunDate,
  );

  return updatedNextRunDate;
};
