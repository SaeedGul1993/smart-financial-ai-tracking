import {
  BudgetAlertType,
  NotificationType,
} from "../../generated/prisma/enums";

export interface createNotificationInputs {
  userId: string;
  title: string;
  message: string;
  budgetType: BudgetAlertType;
  type: NotificationType;
}
