import { Router } from "express";
import {
  createCategoryController,
  findAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from "./category.controller";
import { validationPipe } from "../../middleware/validation.middleware";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "./category.validation";
import { authMiddleware } from "../../middleware/auth.middleware";

const categoryRoutes = Router();

categoryRoutes.post(
  "/create",
  validationPipe(createCategorySchema),
  authMiddleware,
  createCategoryController,
);
categoryRoutes.get(
  "/all-categories",
  authMiddleware,
  findAllCategoriesController,
);
categoryRoutes.patch(
  "/update",
  validationPipe(updateCategorySchema),
  authMiddleware,
  updateCategoryController,
);
categoryRoutes.delete(
  "/delete",
  validationPipe(deleteCategorySchema),
  authMiddleware,
  deleteCategoryController,
);

export default categoryRoutes;
