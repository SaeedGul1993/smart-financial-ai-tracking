import prisma from "../../config/database";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { AppError } from "../../errors/appError";
import { getCurrentMonthRange } from "../../utils/monthlyRange";
import { incomeFilters, MonthlyIncomeTrend } from "./income.types";

export class IncomeRepository {
  async create(data: any) {
    return await prisma.income.create({
      data,
    });
  }
  async findAll(userId: string, filters: incomeFilters) {
    const { page, limit, startDate, endDate, search, source } = filters;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {
      userId,
      ...(search && { description: { contains: search, mode: "insensitive" } }),
      ...(source && { source }),
      ...(startDate &&
        endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }),
    };

    const [data, total] = await Promise.all([
      prisma.income.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { date: "desc" },
      }),
      prisma.income.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: string, userId: string) {
    const income = await prisma.income.findFirst({
      where: { id, userId },
    });
    if (!income) throw new AppError(HTTP_STATUS.NOT_FOUND, "Income not found");
    return income;
  }

  async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);
    return await prisma.income.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    return await prisma.income.delete({
      where: { id },
    });
  }

  async getTotalIncome(userId: string) {
    const result = await prisma.income.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    return result._sum.amount;
  }
  async getCurrentMonthIncome(userId: string) {
    const { start, end } = await getCurrentMonthRange();
    const result = await prisma.income.aggregate({
      where: { userId, date: { gte: start, lte: end } },
      _sum: { amount: true },
    });
    return result._sum.amount;
  }

  async getIncomeBySource(userId: string) {
    const totalIncome = Number(await this.getTotalIncome(userId));
    const groupedIncomes = await prisma.income.groupBy({
      by: ["source"],
      where: { userId },
      _sum: { amount: true },
    });
    return groupedIncomes?.map((item) => ({
      source: item.source,
      amount: item._sum.amount,
      percentage: totalIncome
        ? ((Number(item._sum.amount) / totalIncome) * 100).toFixed(2)
        : 0,
    }));
  }

  async getMonthlyIncomeTrend(userId: string) {
    const result = await prisma.$queryRaw`
  
  SELECT
  
  DATE_TRUNC('month', date) AS month,
  
  SUM(amount) AS total_amount
  
  
  FROM "Income"
  
  
  WHERE "userId" = ${userId}
  
  
  GROUP BY month
  
  
  ORDER BY month ASC
  
  `;
    return (result as unknown as MonthlyIncomeTrend[]).map((item) => ({
      month: new Date(item.month).toLocaleString("en-US", {
        month: "short",
      }),
      amount: Number(item.total_amount),
    }));
  }

  async getHighestIncome(userId: string) {
    return prisma.income.findFirst({
      where: { userId },
      orderBy: { amount: "desc" },
    });
  }

  async getRecentIncomes(userId: string) {
    return prisma.income.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 5,
    });
  }
}
