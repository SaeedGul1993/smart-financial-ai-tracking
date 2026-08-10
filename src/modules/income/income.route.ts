import { Router } from "express";
import {
  createIncomeController,
  deleteIncomeController,
  getIncomeAnalyticsController,
  getIncomeByIdController,
  getIncomesController,
  updateIncomeController,
} from "./income.controller";
import { validationPipe } from "../../middleware/validation.middleware";
import {
  createIncomeSchema,
  deleteIncomeSchema,
  updateIncomeSchema,
} from "./income.validation";
import { authMiddleware } from "../../middleware/auth.middleware";

const incomeRoutes = Router();

incomeRoutes.post(
  "/create",
  validationPipe(createIncomeSchema),
  authMiddleware,
  createIncomeController,
);

incomeRoutes.get("/all-income", authMiddleware, getIncomesController);

incomeRoutes.get("/income/:id", authMiddleware, getIncomeByIdController);

incomeRoutes.patch(
  "/update-income",
  validationPipe(updateIncomeSchema),
  authMiddleware,
  updateIncomeController,
);

incomeRoutes.delete(
  "/delete-income",
  validationPipe(deleteIncomeSchema),
  authMiddleware,
  deleteIncomeController,
);

incomeRoutes.get(
  "/income-summary",
  authMiddleware,
  getIncomeAnalyticsController,
);
export default incomeRoutes;
