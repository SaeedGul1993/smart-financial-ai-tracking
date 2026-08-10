"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
const httpStatus_1 = require("../../constants/httpStatus");
const appError_1 = require("../../errors/appError");
const monthlyRange_1 = require("../../utils/monthlyRange");
class IncomeRepository {
    async create(data) {
        return await database_1.default.income.create({
            data,
        });
    }
    async findAll(userId, filters) {
        const { page, limit, startDate, endDate, search, source } = filters;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {
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
            database_1.default.income.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { date: "desc" },
            }),
            database_1.default.income.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id, userId) {
        const income = await database_1.default.income.findFirst({
            where: { id, userId },
        });
        if (!income)
            throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Income not found");
        return income;
    }
    async update(id, userId, data) {
        await this.findById(id, userId);
        return await database_1.default.income.update({
            where: { id },
            data,
        });
    }
    async delete(id, userId) {
        await this.findById(id, userId);
        return await database_1.default.income.delete({
            where: { id },
        });
    }
    async getTotalIncome(userId) {
        const result = await database_1.default.income.aggregate({
            where: { userId },
            _sum: { amount: true },
        });
        return result._sum.amount;
    }
    async getCurrentMonthIncome(userId) {
        const { start, end } = await (0, monthlyRange_1.getCurrentMonthRange)();
        const result = await database_1.default.income.aggregate({
            where: { userId, date: { gte: start, lte: end } },
            _sum: { amount: true },
        });
        return result._sum.amount;
    }
    async getIncomeBySource(userId) {
        const totalIncome = Number(await this.getTotalIncome(userId));
        const groupedIncomes = await database_1.default.income.groupBy({
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
    async getMonthlyIncomeTrend(userId) {
        const result = await database_1.default.$queryRaw `
  
  SELECT
  
  DATE_TRUNC('month', date) AS month,
  
  SUM(amount) AS total_amount
  
  
  FROM "Income"
  
  
  WHERE "userId" = ${userId}
  
  
  GROUP BY month
  
  
  ORDER BY month ASC
  
  `;
        return result.map((item) => ({
            month: new Date(item.month).toLocaleString("en-US", {
                month: "short",
            }),
            amount: Number(item.total_amount),
        }));
    }
    async getHighestIncome(userId) {
        return database_1.default.income.findFirst({
            where: { userId },
            orderBy: { amount: "desc" },
        });
    }
    async getRecentIncomes(userId) {
        return database_1.default.income.findMany({
            where: { userId },
            orderBy: { date: "desc" },
            take: 5,
        });
    }
}
exports.IncomeRepository = IncomeRepository;
