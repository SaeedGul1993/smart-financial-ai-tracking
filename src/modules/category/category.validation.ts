import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export const updateCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
});

export const deleteCategorySchema = z.object({
  categoryId: z.string().min(1),
});
