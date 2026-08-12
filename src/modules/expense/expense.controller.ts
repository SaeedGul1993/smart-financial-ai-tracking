import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createExpenseService,
  deleteExpenseService,
  getExpensesService,
  getExpenseSummaryAnalyticsService,
  scanReceiptService,
  updateExpenseService,
} from "./expense.service";
import { AppError } from "../../errors/appError";

export const createExpenseController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await createExpenseService(userId, req.body);
    sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Expense created successfully",
      data: result,
    });
  },
);

export const getExpensesController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await getExpensesService(userId, req.query);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Expenses fetched successfully",
      data: {
        list: result,
        pagination: {
          total: result.length,
          page: Number((req.query as any).page),

          limit: Number((req.query as any).limit),
        },
      },
    });
  },
);

export const updateExpenseController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { id } = req.body;
    const result = await updateExpenseService(id, userId, req.body);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Expense updated successfully",
      data: result,
    });
  },
);

export const deleteExpenseController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const { expenseId } = req.body;
    const result = await deleteExpenseService(expenseId, userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Expense deleted successfully",
      data: result,
    });
  },
);
export const getExpenseSummaryAnalyticsController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await getExpenseSummaryAnalyticsService(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Expense summary analytics fetched successfully",
      data: result,
    });
  },
);

export const scanReceiptController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const file = req.file;
    if (!file)
      throw new AppError(HTTP_STATUS.BAD_REQUEST, "Receipt image is required");
    const result = await scanReceiptService(userId, file);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Receipt scanned successfully",
      data: result,
    });
  },
);
