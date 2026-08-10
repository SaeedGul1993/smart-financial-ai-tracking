import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  getRecurringExpensesService,
  pauseRecurringExpenseService,
  resumeRecurringExpenseService,
} from "./recurringExpense.service";

export const getRecurringExpensesController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const recurringExpenses = await getRecurringExpensesService(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Recurring expenses fetched successfully",
      data: recurringExpenses,
    });
  },
);

export const pauseRecurringExpenseController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { userId } = (req as any).user;
    console.log(id, userId, "id and userId");
    const recurringExpense = await pauseRecurringExpenseService(id, userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Recurring expense paused successfully",
      data: recurringExpense,
    });
  },
);

export const resumeRecurringExpenseController = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const { userId } = (req as any).user;
    const recurringExpense = await resumeRecurringExpenseService(id, userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Recurring expense resumed successfully",
      data: recurringExpense,
    });
  },
);
