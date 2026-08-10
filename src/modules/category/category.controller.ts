import { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import {
  createCategoryService,
  deleteCategoryService,
  findAllCategoriesService,
  updateCategoryService,
} from "./category.service";

export const createCategoryController = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const data = req.body;
  const result = await createCategoryService(userId, data);
  sendResponse(res, 201, {
    success: true,
    message: "Category created successfully",
    data: result,
  });
};

export const findAllCategoriesController = async (
  req: Request,
  res: Response,
) => {
  const userId = (req as any).user.userId;
  const result = await findAllCategoriesService(userId);
  sendResponse(res, 200, {
    success: true,
    message: "Categories fetched successfully",
    data: result,
  });
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const categoryId = req.body.id;
  const data = req.body;
  const result = await updateCategoryService(userId, categoryId, data);
  sendResponse(res, 200, {
    success: true,
    message: "Category updated successfully",
    data: result,
  });
};

export const deleteCategoryController = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const categoryId = req.body.categoryId;
  const result = await deleteCategoryService(userId, categoryId);
  sendResponse(res, 200, {
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
};
