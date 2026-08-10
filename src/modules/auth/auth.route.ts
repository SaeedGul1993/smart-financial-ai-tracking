import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
} from "./auth.controller";
import { validationPipe } from "../../middleware/validation.middleware";
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.validation";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validationPipe(registerSchema),
  registerController,
);

authRoutes.post("/login", validationPipe(loginSchema), loginController);

authRoutes.post(
  "/refresh-token",
  validationPipe(refreshTokenSchema),
  refreshTokenController,
);

authRoutes.post("/logout", validationPipe(logoutSchema), logoutController);

export default authRoutes;
