import {
  PaymentMethod,
  RecurringFrequency,
} from "../../generated/prisma/enums";

export interface createExpenseInput {
  amount: number;
  date: Date;
  description?: string;
  paymentMethod: PaymentMethod;
  receiptUrl?: string;
  categoryId: string;
  userId: string;
  isRecurring?: boolean;
  frequency?: RecurringFrequency;
  recurringExpenseId?: string;
}

export interface updateExpenseInput {
  amount?: number;
  date?: Date;
  description?: string;
  paymentMethod?: PaymentMethod;
  receiptUrl?: string;
  categoryId?: string;
}

export interface expenseFilter {
  page?: number;
  limit?: number;
  categoryId?: string;
  paymentMethod?: PaymentMethod;
  startDate?: Date;
  endDate?: Date;
}

export interface ExpenseAnalyticsResponse {
  summary: {
    totalExpense: number;

    todayExpense: number;

    monthlyExpense: number;

    averageExpense: number;

    transactionCount: number;
  };

  categoryBreakdown: {
    id: string;

    name: string;

    type: string;

    amount: number;

    percentage: number;
  }[];

  monthlyTrend: {
    month: string;

    amount: number;
  }[];

  highestExpense: {
    id: string;

    amount: number;

    description: string | null;

    date: Date;

    category: string;
  } | null;

  recentExpenses: {
    id: string;

    amount: number;

    description: string | null;

    date: Date;

    category: string;
  }[];
  recurringExpenses: {
    id: string;
    amount: number;
    description: string | null;
    nextRunDate: Date;
    frequency: RecurringFrequency;
    isActive: boolean;
    category: {
      id: string;
      name: string;
      type: string;
    };
  }[];
}
