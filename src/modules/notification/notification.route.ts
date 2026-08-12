import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  createNotificationController,
  markedAllAsReadController,
  markedAsReadController,
  unReadNotificationCountController,
} from "./notification.controller";

const notificationRoutes = Router();

notificationRoutes.post(
  "/create",
  authMiddleware,
  createNotificationController,
);

notificationRoutes.patch(
  "/marked-as-read",
  authMiddleware,
  markedAsReadController,
);

notificationRoutes.patch(
  "/marked-all-as-read",
  authMiddleware,
  markedAllAsReadController,
);

notificationRoutes.get(
  "/unread-count",
  authMiddleware,
  unReadNotificationCountController,
);
