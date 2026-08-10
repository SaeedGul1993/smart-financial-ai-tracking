import { HTTP_STATUS } from "../../constants/httpStatus";
import { AppError } from "../../errors/appError";
import { CategoryRepository, CreateCategoryDto } from "./category.repository";
const categoryRepository = new CategoryRepository();

export const createCategoryService = async (
  userId: string,
  data: CreateCategoryDto,
) => {
  const existingCategory = await categoryRepository.findDuplicateCategory(
    data.slug,
    data.name,
  );
  if (existingCategory)
    throw new AppError(HTTP_STATUS.CONFLICT, "Category already exists");

  return await categoryRepository.create({ ...data, isDefault: false, userId });
};

export const findAllCategoriesService = async (userId: string) => {
  return await categoryRepository.findAll(userId);
};

export const updateCategoryService = async (
  userId: string,
  categoryId: string,
  data: Partial<CreateCategoryDto>,
) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category)
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Category not found");
  if (category.isDefault)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "You are not authorized to update the default category",
    );
  if (category.userId !== userId)
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to update this category",
    );

  return await categoryRepository.update(categoryId, {
    ...data,
    isDefault: false,
    slug: data.name?.toLowerCase(),
  });
};

export const deleteCategoryService = async (
  userId: string,
  categoryId: string,
) => {
  const category = await categoryRepository.findById(categoryId);
  if (!category)
    throw new AppError(HTTP_STATUS.NOT_FOUND, "Category not found");
  if (category.isDefault)
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      "You are not authorized to delete the default category",
    );
  if (category.userId !== userId)
    throw new AppError(
      HTTP_STATUS.FORBIDDEN,
      "You are not authorized to delete this category",
    );

  return await categoryRepository.delete(categoryId);
};
