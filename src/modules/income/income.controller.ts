import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createIncomeService,
  deleteIncomeService,
  getIncomeAnalyticsService,
  getIncomeByIdService,
  getIncomesService,
  updateIncomeService,
} from "./income.service";

export const createIncomeController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await createIncomeService({ ...req.body, userId });
    sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Income created successfully",
      data: result,
    });
  },
);

export const getIncomesController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await getIncomesService(userId, req.query);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Income list fetched successfully",
      data: result,
    });
  },
);

export const getIncomeByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await getIncomeByIdService(req.params.id as string, userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Income fetched successfully",
      data: result,
    });
  },
);

export const updateIncomeController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await updateIncomeService(req.body.id, userId, req.body);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Income updated successfully",
      data: result,
    });
  },
);

export const deleteIncomeController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await deleteIncomeService(req.body.id, userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Income deleted successfully",
      data: result,
    });
  },
);

export const getIncomeAnalyticsController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await getIncomeAnalyticsService(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Income analytics fetched successfully",
      data: result,
    });
  },
);
