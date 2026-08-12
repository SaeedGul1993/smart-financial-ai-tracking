import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validationPipe } from "../../middleware/validation.middleware";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  updateFcmTokenController,
} from "./auth.controller";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
  updateFcmTokenSchema,
} from "./auth.validation";
import { authRateLimiter } from "../../middleware/rateLimiter";

const authRoutes = Router();

authRoutes.post(
  "/register",
  authRateLimiter,
  validationPipe(registerSchema),
  registerController,
);

authRoutes.post(
  "/login",
  authRateLimiter,
  validationPipe(loginSchema),
  loginController,
);

authRoutes.post(
  "/refresh-token",
  validationPipe(refreshTokenSchema),
  refreshTokenController,
);

authRoutes.post("/logout", validationPipe(logoutSchema), logoutController);
authRoutes.patch(
  "/update-fcm-token",
  authMiddleware,
  validationPipe(updateFcmTokenSchema),
  updateFcmTokenController,
);

export default authRoutes;
