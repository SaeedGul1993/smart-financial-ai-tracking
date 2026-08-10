import { ExpenseRepository } from "../modules/expense/expense.repository";
import { createExpenseService } from "../modules/expense/expense.service";
import { createExpenseInput } from "../modules/expense/expense.types";
import { RecurringExpenseRepository } from "../modules/recurringExpense/recurringExpense.repository";
import {
  calculateNextRunDate,
  getNextValidRunDate,
} from "../utils/nextRunDate";

const recurringExpenseRepository = new RecurringExpenseRepository();
const expenseRepository = new ExpenseRepository();

export const processRecurringExpenses = async () => {
  const recurringExpenses =
    await recurringExpenseRepository.findDueRecurringExpenses();

  for (const recurringExpense of recurringExpenses) {
    const validRunDate = getNextValidRunDate(
      recurringExpense.nextRunDate,
      recurringExpense.frequency,
    );
    try {
      const existingExpense =
        await expenseRepository.findExpenseByRecurringAndDate(
          recurringExpense.id,
          validRunDate,
        );

      if (existingExpense) {
        await recurringExpenseRepository.updateNextRunDate(
          recurringExpense.id,
          calculateNextRunDate(validRunDate, recurringExpense.frequency),
        );
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

      await createExpenseService(
        recurringExpense.userId,
        payload as createExpenseInput,
      );

      await recurringExpenseRepository.updateNextRunDate(
        recurringExpense.id,
        calculateNextRunDate(validRunDate, recurringExpense.frequency),
      );

      console.log(`Recurring expense processed: ${recurringExpense.id}`);
    } catch (error: any) {
      // Prisma unique constraint
      if (error?.code === "P2002") {
        console.log(
          `Duplicate recurring expense skipped: ${recurringExpense.id}`,
        );

        continue;
      }

      console.error(`Failed recurring expense: ${recurringExpense.id}`, error);
    }
  }
};
