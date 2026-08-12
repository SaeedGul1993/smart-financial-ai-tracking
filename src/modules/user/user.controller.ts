import { catchAsync } from "../../utils/catchAsync";
import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import {
  getUserProfileService,
  updateUserProfileService,
} from "./user.service";
import { HTTP_STATUS } from "../../constants/httpStatus";

export const getUserProfileController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await getUserProfileService(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "User profile fetched successfully",
      data: result,
    });
  },
);

export const updateUserProfileController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const data = req.body;
    const result = await updateUserProfileService(userId, data);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  },
);
