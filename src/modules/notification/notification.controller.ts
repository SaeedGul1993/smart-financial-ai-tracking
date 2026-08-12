import { Request, Response } from "express";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createNotificationService,
  markedAllAsReadService,
  markedAsReadService,
  unReadNotificationCountService,
} from "./notification.service";

export const createNotificationController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await createNotificationService(req.body);
    sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Notification created successfully",
      data: result,
    });
  },
);

export const markedAsReadController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await markedAsReadService(userId, req.body.notificationId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Unread Notification marked as read successfully",
      data: result,
    });
  },
);

export const markedAllAsReadController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await markedAllAsReadService(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Unread Notification marked all as read successfully",
      data: result,
    });
  },
);

export const unReadNotificationCountController = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = (req as any).user;
    const result = await unReadNotificationCountService(userId);
    sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Unread Notifications count fetched successfully",
      data: result,
    });
  },
);
