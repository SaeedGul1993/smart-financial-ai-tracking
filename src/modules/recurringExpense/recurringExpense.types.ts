import {
  PaymentMethod,
  RecurringFrequency,
} from "../../generated/prisma/enums";

export interface CreateRecurringExpenseInput {
  amount: number;
  frequency: RecurringFrequency;
  categoryId: string;
  userId: string;
  startDate: Date;
  nextRunDate: Date;
  description?: string;
  paymentMethod: PaymentMethod;
}
