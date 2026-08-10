import prisma from "../../config/database";
import {
  currentMonthRage,
  getCurrentMonthRange,
  getMonthlyRange,
} from "../../utils/monthlyRange";
import { createBudgetInput, updateBudgetInput } from "./budget.types";

export class BudgetRepository {
  async create(userId: string, data: createBudgetInput) {
    await this.findUserCategory(userId, data.categoryId);
    return await prisma.budget.create({
      data: { ...data, userId },
    });
  }

  async findUserCategory(userId: string, categoryId: string) {
    return await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [
          {
            userId: null,
          },

          {
            userId: userId,
          },
        ],
      },
    });
  }

  async findMany(userId: string, month: number, year: number) {
    return await prisma.budget.findMany({
      where: { userId, month, year },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getSpentAmount(userId: string, month: number, year: number) {
    const { start, end } = getMonthlyRange(month, year);
    const expenseSummary = await prisma.expense.groupBy({
      by: ["categoryId"],
      _sum: { amount: true },
      where: {
        userId,
        date: { gte: start, lte: end },
      },
    });
    return expenseSummary;
  }

  async findById(id: string, userId: string) {
    return await prisma.budget.findFirst({
      where: { id, userId },
    });
  }
  async update(id: string, data: updateBudgetInput) {
    return await prisma.budget.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return await prisma.budget.delete({
      where: { id, userId },
    });
  }

  async findActiveBudgets() {
    return await prisma.budget.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }

  async currentMonthBudgetUsage(userId: string) {
    const { month, year, start, end } = currentMonthRage();
    const budgets = await prisma.budget.findMany({
      where: {
        userId,
        month,
        year,
      },
    });
    if (!budgets.length) {
      return {
        totalLimit: 0,
        totalUsed: 0,
        usagePercentage: 0,
      };
    }
    const totalBudgets = budgets.reduce(
      (sum: any, budget: any) => sum + Number(budget.amount),
      0,
    );

    const expenses = await prisma.expense.aggregate({
      where: {
        userId,
        categoryId: {
          in: budgets.map((budget) => budget.categoryId),
        },
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const totalUsed = Number(expenses._sum.amount) || 0;

    const usagePercentage =
      totalBudgets > 0
        ? Number(((totalUsed / totalBudgets) * 100).toFixed(2))
        : 0;

    return {
      totalBudget: totalBudgets,
      totalUsed,
      usagePercentage,
    };
  }
}
