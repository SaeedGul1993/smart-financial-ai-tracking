import { IncomeSource } from "../../generated/prisma/enums";

export interface createIncomeInput {
  amount: number;
  date: string;
  description: string;
  source: IncomeSource;
  userId: string;
}

export interface updateIncomeInput {
  id: string;
  amount?: number;
  date?: string;
  description?: string;
  source?: IncomeSource;
}

export interface incomeFilters {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  source?: IncomeSource;
}

export type MonthlyIncomeTrend = {
  month: string;
  total_amount: number;
};
