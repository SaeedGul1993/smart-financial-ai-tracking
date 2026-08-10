import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  chatWithAI,
  getFinancialHealth,
  getSpendingAnalysis,
  refreshSpendingAnalysis,
} from "./ai.service";

export const analyzeSpendingController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const response = await getSpendingAnalysis(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Spending analysis completed",
      data: response,
    });
  },
);

export const getFinancialHealthController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const response = await getFinancialHealth(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Financial health analysis completed",
      data: response,
    });
  },
);

export const refreshSpendingAnalysisController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const response = await refreshSpendingAnalysis(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Refresh Spending analysis Fetched.",
      data: response,
    });
  },
);

export const chatWithAIController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await chatWithAI(userId, req.body);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "AI response generated successfully",
      data: result,
    });
  },
);
