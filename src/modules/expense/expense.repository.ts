import prisma from "../../config/database";
import { getCurrentMonthRange, getTodayRange } from "../../utils/monthlyRange";
import {
  createExpenseInput,
  expenseFilter,
  updateExpenseInput,
} from "./expense.types";

export class ExpenseRepository {
  async create(data: createExpenseInput) {
    return await prisma.expense.create({
      data,
    });
  }

  async findAll(userId: string, filters: expenseFilter) {
    const { page, limit, categoryId, paymentMethod, startDate, endDate } =
      filters;
    const skip = ((Number(page) ?? 1) - 1) * (Number(limit) ?? 10);

    const where = {
      userId,
      ...(categoryId && { categoryId }),
      ...(paymentMethod && { paymentMethod }),
      ...(startDate && { date: { gte: startDate } }),
      ...(endDate && { date: { lte: endDate } }),
    };

    return await prisma.expense.findMany({
      where: where,
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
      skip,
      take: Number(limit) ?? 10,
    });
  }

  async findById(id: string, userId: string) {
    return await prisma.expense.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, userId: string, data: updateExpenseInput) {
    return await prisma.expense.update({
      where: {
        id,
        userId,
      },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return await prisma.expense.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async getTotalExpense(userId: string) {
    const result = await prisma.expense.aggregate({
      where: { userId },
      _sum: {
        amount: true,
      },
    });
    return Number(result._sum.amount ?? 0);
  }

  async getTodayExpense(userId: string) {
    const { start, end } = await getTodayRange();
    const result = await prisma.expense.aggregate({
      where: { userId, date: { gte: start, lte: end } },
      _sum: {
        amount: true,
      },
    });
    return Number(result._sum.amount ?? 0);
  }
  async getMonthlyExpense(userId: string) {
    const { start, end } = await getCurrentMonthRange();
    const result = await prisma.expense.aggregate({
      where: {
        userId,
        date: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        amount: true,
      },
    });
    return Number(result._sum.amount ?? 0);
  }

  async getAverageExpense(userId: string) {
    const result = await prisma.expense.aggregate({
      where: { userId },
      _avg: {
        amount: true,
      },
    });
    return Number(result._avg.amount ?? 0);
  }

  async getExpenseCount(userId: string) {
    return prisma.expense.count({ where: { userId } });
  }

  async getCategoryBreakdown(userId: string) {
    const groupedExpenses = await prisma.expense.groupBy({
      by: ["categoryId"],
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    });
    const categoryIds = groupedExpenses.map((item) => item.categoryId);

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },

      select: {
        id: true,
        name: true,
        type: true,
      },
    });

    const expenseMap = new Map(
      groupedExpenses.map((item) => [
        item.categoryId,
        Number(item._sum.amount ?? 0),
      ]),
    );

    const totalExpense = await this.getTotalExpense(userId);

    return categories.map((category) => ({
      ...category,
      amount: expenseMap.get(category.id) ?? 0,
      percentage: Math.round(
        ((expenseMap.get(category.id) ?? 0) / totalExpense) * 100,
      ),
    }));
  }

  async getMonthlyExpenseTrend(userId: string) {
    const data = await prisma.$queryRaw`
  
      SELECT
        DATE_TRUNC('month', "date") AS month,
        SUM(amount) AS total_amount
  
      FROM "Expense"
  
      WHERE "userId" = ${userId}
  
      GROUP BY month
  
      ORDER BY month DESC
  
    `;

    return data;
  }

  async getHighestExpense(userId: string) {
    return prisma.expense.findFirst({
      where: { userId },
      orderBy: { amount: "desc" },
      include: {
        category: true,
      },
    });
  }

  async getRecentExpenses(userId: string) {
    return prisma.expense.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        category: true,
      },
    });
  }

  async findExpenseByRecurringAndDate(recurringExpenseId: string, date: Date) {
    return prisma.expense.findFirst({
      where: {
        recurringExpenseId,
        date,
      },
    });
  }
}
