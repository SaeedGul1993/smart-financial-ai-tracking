import { Router } from "express";
import {
  createBudgetController,
  deleteBudgetController,
  getBudgetsController,
  updateBudgetController,
} from "./budget.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validationPipe } from "../../middleware/validation.middleware";
import {
  createBudgetSchema,
  deleteBudgetSchema,
  updateBudgetSchema,
} from "./budget.validation";

const budgetRoutes = Router();

budgetRoutes.post(
  "/create",
  validationPipe(createBudgetSchema),
  authMiddleware,
  createBudgetController,
);

budgetRoutes.get("/all-budgets", authMiddleware, getBudgetsController);

budgetRoutes.patch(
  "/update",
  validationPipe(updateBudgetSchema),
  authMiddleware,
  updateBudgetController,
);

budgetRoutes.delete(
  "/delete",
  validationPipe(deleteBudgetSchema),
  authMiddleware,
  deleteBudgetController,
);

export default budgetRoutes;
