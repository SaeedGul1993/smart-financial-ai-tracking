import { z } from "zod";
export const updateProfileSchema = z.object({
  name: z.string().optional(),
  currency: z
    .number()
    .positive("Currency must be a positive number")
    .optional(),
  monthlyIncome: z
    .number()
    .positive("Monthly income must be a positive number")
    .optional(),
});
