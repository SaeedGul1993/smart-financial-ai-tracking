import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createBudgetService,
  deleteBudgetService,
  getBudgetsService,
  updateBudgetService,
} from "./budget.service";

export const createBudgetController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const budget = await createBudgetService(userId, req.body);
    sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Budget created successfully",
      data: budget,
    });
  },
);

export const getBudgetsController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { month, year } = req.query;
    const budgets = await getBudgetsService(
      userId,
      Number(month),
      Number(year),
    );
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Budgets fetched successfully",
      data: budgets,
    });
  },
);

export const updateBudgetController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const budget = await updateBudgetService(req.body.id, userId, req.body);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Budget updated successfully",
      data: budget,
    });
  },
);

export const deleteBudgetController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const budget = await deleteBudgetService(req.body.id, userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Budget deleted successfully",
      data: budget,
    });
  },
);
