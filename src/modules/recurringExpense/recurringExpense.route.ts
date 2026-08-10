import { Router } from "express";
import {
  getRecurringExpensesController,
  pauseRecurringExpenseController,
  resumeRecurringExpenseController,
} from "./recurringExpense.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const recurringExpenseRoutes = Router();

recurringExpenseRoutes.get(
  "/all-recurring-expenses",
  authMiddleware,
  getRecurringExpensesController,
);

recurringExpenseRoutes.patch(
  "/pause-recurring-expense/:id",
  authMiddleware,
  pauseRecurringExpenseController,
);

recurringExpenseRoutes.patch(
  "/resume-recurring-expense/:id",
  authMiddleware,
  resumeRecurringExpenseController,
);

export default recurringExpenseRoutes;
