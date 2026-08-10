import prisma from "../../config/database";
import { RecurringFrequency } from "../../generated/prisma/enums";
import { CreateRecurringExpenseInput } from "./recurringExpense.types";

export class RecurringExpenseRepository {
  async create(data: CreateRecurringExpenseInput) {
    return prisma.recurringExpense.create({
      data,
    });
  }
  async findDueRecurringExpenses() {
    return prisma.recurringExpense.findMany({
      where: {
        isActive: true,
        nextRunDate: {
          lte: new Date(),
        },
      },
    });
  }
  async updateNextRunDate(id: string, nextRunDate: Date) {
    return await prisma.recurringExpense.update({
      where: { id },
      data: { nextRunDate, isActive: true },
    });
  }
  async findByUser(userId: string) {
    return await prisma.recurringExpense.findMany({
      where: { userId },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async pauseRecurringExpense(id: string) {
    return await prisma.recurringExpense.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async resumeRecurringExpense(id: string) {
    return await prisma.recurringExpense.update({
      where: { id },
      data: { isActive: true },
    });
  }

  async findById(id: string) {
    const result = await prisma.recurringExpense.findUnique({
      where: { id },
    });
    return result;
  }

  async getRecurringExpenseMonthlyTotal(userId: string) {
    const recurringExpenses = await prisma.recurringExpense.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        amount: true,
        frequency: true,
      },
    });

    let monthlyTotal = 0;

    for (const recurringExpense of recurringExpenses) {
      const amount = Number(recurringExpense.amount);

      switch (recurringExpense.frequency) {
        case RecurringFrequency.DAILY:
          monthlyTotal += amount * 30;
          break;

        case RecurringFrequency.WEEKLY:
          monthlyTotal += amount * 4.33;
          break;

        case RecurringFrequency.MONTHLY:
          monthlyTotal += amount;
          break;

        case RecurringFrequency.YEARLY:
          monthlyTotal += amount / 12;
          break;

        default:
          break;
      }
    }

    return Number(monthlyTotal.toFixed(2));
  }
}
