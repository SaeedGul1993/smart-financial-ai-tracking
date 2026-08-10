import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import {
  getUserProfileController,
  updateUserProfileController,
} from "./user.controller";
import { validationPipe } from "../../middleware/validation.middleware";
import { updateProfileSchema } from "./user.validation";

const router = Router();

router.get("/profile", authMiddleware, getUserProfileController);
router.patch(
  "/update-profile",
  validationPipe(updateProfileSchema),
  authMiddleware,
  updateUserProfileController,
);

export default router;
