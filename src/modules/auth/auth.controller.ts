import { Request, Response } from "express";
import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
  updateFcmTokenService,
} from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

export const registerController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await registerService(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result,
    });
  },
);

export const loginController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await loginService(req.body);
    sendResponse(res, 200, {
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  },
);

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await refreshTokenService(req.body);
    sendResponse(res, 200, {
      success: true,
      message: "Refresh token generated successfully",
      data: result,
    });
  },
);

export const logoutController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await logoutService(req.body);
    sendResponse(res, 200, {
      success: true,
      message: "Logout successful",
      data: result,
    });
  },
);

export const updateFcmTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await updateFcmTokenService(userId, req.body.fcmToken);
    sendResponse(res, 200, {
      success: true,
      message: "Fcm Token Updated successful",
      data: result,
    });
  },
);
