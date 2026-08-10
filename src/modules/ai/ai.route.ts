import { Router } from "express";
import {
  analyzeSpendingController,
  chatWithAIController,
  getFinancialHealthController,
  refreshSpendingAnalysisController,
} from "./ai.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validationPipe } from "../../middleware/validation.middleware";
import { aiChatSchema } from "./ai.validation";

const aiRoutes = Router();

aiRoutes.get("/analyze-spending", authMiddleware, analyzeSpendingController);
aiRoutes.get(
  "/get-financial-health",
  authMiddleware,
  getFinancialHealthController,
);
aiRoutes.post(
  "/refresh-spending-analyze",
  authMiddleware,
  refreshSpendingAnalysisController,
);

aiRoutes.post(
  "/ai-chat",
  authMiddleware,
  validationPipe(aiChatSchema),
  chatWithAIController,
);

export default aiRoutes;
