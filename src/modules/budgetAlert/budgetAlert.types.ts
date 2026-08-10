export interface createBudgetAlertInput {
  userId: string;
  budgetId: string;
  type: string;
  percentage: number;
  message: string;
  emailSent?: boolean;
  emailSentAt?: Date;
  pushSent?: boolean;
  pushSentAt: Date;
  lastReminderSentAt?: Date;
}
export interface updateBudgetAlertInput {
  emailSent?: boolean;
  emailSentAt?: Date;
  pushSent?: boolean;
  pushSentAt?: Date;
  lastReminderSentAt?: Date;
}
