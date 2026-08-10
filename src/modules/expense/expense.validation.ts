import { z } from "zod";
import {
  PaymentMethod,
  RecurringFrequency,
} from "../../generated/prisma/enums";

export const createExpenseSchema = z.object({
  amount: z.number().min(1),
  date: z.string().datetime().default(new Date().toISOString()),
  paymentMethod: z.nativeEnum(PaymentMethod),
  receiptUrl: z.string().optional(),
  categoryId: z.string().min(1),
  userId: z.string().min(1),
  description: z.string().optional(),
  isRecurring: z.boolean().optional(),
  frequency: z.nativeEnum(RecurringFrequency).optional(),
});

export const updateExpenseSchema = z.object({
  id: z.string().min(1),
  amount: z.number().min(1).optional(),
  date: z.date().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  receiptUrl: z.string().optional(),
  categoryId: z.string().min(1).optional(),
  userId: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const deleteExpenseSchema = z.object({
  expenseId: z.string().min(1),
});

export const expenseFilterSchema = z.object({
  page: z.string().min(1).default("1"),
  limit: z.string().min(1).default("10"),
  categoryId: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});
