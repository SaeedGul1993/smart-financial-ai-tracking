import { Router } from "express";
import {
  createExpenseController,
  deleteExpenseController,
  getExpensesController,
  getExpenseSummaryAnalyticsController,
  updateExpenseController,
} from "./expense.controller";
import {
  createExpenseSchema,
  deleteExpenseSchema,
  expenseFilterSchema,
  updateExpenseSchema,
} from "./expense.validation";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validationPipe } from "../../middleware/validation.middleware";

const expenseRoutes = Router();

expenseRoutes.post(
  "/create",
  validationPipe(createExpenseSchema),
  authMiddleware,
  createExpenseController,
);

expenseRoutes.get(
  "/all-expenses",
  validationPipe(expenseFilterSchema),
  authMiddleware,
  getExpensesController,
);

expenseRoutes.patch(
  "/update",
  validationPipe(updateExpenseSchema),
  authMiddleware,
  updateExpenseController,
);

expenseRoutes.delete(
  "/delete",
  validationPipe(deleteExpenseSchema),
  authMiddleware,
  deleteExpenseController,
);

expenseRoutes.get(
  "/summary-analytics",
  authMiddleware,
  getExpenseSummaryAnalyticsController,
);

export default expenseRoutes;
