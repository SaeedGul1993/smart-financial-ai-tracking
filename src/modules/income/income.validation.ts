import { z } from "zod";
import { IncomeSource } from "../../generated/prisma/enums";

export const createIncomeSchema = z.object({
  amount: z.number().positive(),
  date: z.string().datetime().default(new Date().toISOString()),
  description: z.string().min(1),
  source: z.nativeEnum(IncomeSource),
});

export const updateIncomeSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().positive().optional(),
  date: z.string().datetime().default(new Date().toISOString()).optional(),
  description: z.string().min(1).optional(),
  source: z.nativeEnum(IncomeSource).optional(),
});

export const deleteIncomeSchema = z.object({
  id: z.string().uuid().min(1, "Income ID is required"),
});
