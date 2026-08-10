import prisma from "../../config/database";
import { BudgetAlertType } from "../../generated/prisma/enums";
import { getMonthlyRange } from "../../utils/monthlyRange";
import {
  createBudgetAlertInput,
  updateBudgetAlertInput,
} from "./budgetAlert.types";

export class BudgetAlertRepository {
  async create(data: createBudgetAlertInput) {
    return await prisma.budgetAlert.create({
      data: {
        ...data,
        type: data.type as BudgetAlertType,
      },
    });
  }

  async update(alertId: string, data: updateBudgetAlertInput) {
    return await prisma.budgetAlert.update({
      where: { id: alertId },
      data: { ...data },
    });
  }

  async findRecentAlert(budgetId: string, type: BudgetAlertType) {
    return await prisma.budgetAlert.findFirst({
      where: { budgetId, type },
      orderBy: { createdAt: "desc" },
    });
  }

  async findRecentAlertForNotifications(
    budgetId: string,
    type: BudgetAlertType,
    limit: number = 2,
  ) {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - limit);

    return await prisma.budgetAlert.findFirst({
      where: { budgetId, type, createdAt: { gte: dateLimit } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(budgetAlertId: string) {
    return await prisma.budgetAlert.findFirst({
      where: { id: budgetAlertId },
      orderBy: { createdAt: "desc" },
      include: { user: true, budget: { include: { category: true } } },
    });
  }

  async findBudgetByCategoryAndUser(categoryId: string, userId: string) {
    return await prisma.budget.findFirst({
      where: { categoryId, userId },
      include: { category: true },
    });
  }

  async getSpentAmount(
    userId: string,
    month: number,
    year: number,
    categoryId: string,
  ) {
    const { start, end } = getMonthlyRange(month, year);
    const spent = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId, date: { gte: start, lte: end }, categoryId },
    });

    return Number(spent._sum.amount) || 0;
  }

  async getSpentAmountByCategory(
    categoryId: string,
    userId: string,
    month: number,
    year: number,
  ) {
    const { start, end } = getMonthlyRange(month, year);
    const spent = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId, categoryId, date: { gte: start, lte: end } },
    });

    return Number(spent._sum.amount) || 0;
  }

  async markEmailSent(budgetAlertId: string) {
    return await prisma.budgetAlert.update({
      where: { id: budgetAlertId },
      data: { emailSent: true, emailSentAt: new Date() },
    });
  }

  async findAlert(budgetId: string, type: BudgetAlertType) {
    return prisma.budgetAlert.findFirst({
      where: {
        budgetId,
        type,
      },
    });
  }
  async canSendReminder(alertId: string) {
    const alert = await prisma.budgetAlert.findUnique({
      where: {
        id: alertId,
      },
    });

    if (!alert?.lastReminderSentAt) {
      return true;
    }

    const twoDaysAgo = new Date();

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return alert.lastReminderSentAt <= twoDaysAgo;
  }
}
