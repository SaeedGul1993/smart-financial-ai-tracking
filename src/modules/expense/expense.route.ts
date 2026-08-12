import { Router } from "express";
import {
  createExpenseController,
  deleteExpenseController,
  getExpensesController,
  getExpenseSummaryAnalyticsController,
  scanReceiptController,
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
import { upload } from "../../middleware/upload.middleware";
import { receiptScanRateLimiter } from "../../middleware/rateLimiter";

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

expenseRoutes.post(
  "/scan-receipt",
  receiptScanRateLimiter,
  authMiddleware,
  upload.single("receipt"),
  scanReceiptController,
);

export default expenseRoutes;
