import { z } from "zod";

export const createBudgetSchema = z.object({
  categoryId: z.string().uuid(),
  amount: z.number().positive().min(0),
  month: z.number().positive().min(1).max(12),
  year: z.number().positive().min(2000).max(2099),
});

export const updateBudgetSchema = z.object({
  id: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  amount: z.number().positive().min(0).optional(),
  month: z.number().positive().min(1).max(12).optional(),
  year: z.number().positive().min(2000).max(2099).optional(),
});

export const deleteBudgetSchema = z.object({
  id: z.string().uuid(),
});
