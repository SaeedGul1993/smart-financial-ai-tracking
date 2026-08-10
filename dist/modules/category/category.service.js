"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryService = exports.updateCategoryService = exports.findAllCategoriesService = exports.createCategoryService = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const appError_1 = require("../../errors/appError");
const category_repository_1 = require("./category.repository");
const categoryRepository = new category_repository_1.CategoryRepository();
const createCategoryService = async (userId, data) => {
    const existingCategory = await categoryRepository.findDuplicateCategory(data.slug, data.name);
    if (existingCategory)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.CONFLICT, "Category already exists");
    return await categoryRepository.create({ ...data, isDefault: false, userId });
};
exports.createCategoryService = createCategoryService;
const findAllCategoriesService = async (userId) => {
    return await categoryRepository.findAll(userId);
};
exports.findAllCategoriesService = findAllCategoriesService;
const updateCategoryService = async (userId, categoryId, data) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Category not found");
    if (category.isDefault)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "You are not authorized to update the default category");
    if (category.userId !== userId)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to update this category");
    return await categoryRepository.update(categoryId, {
        ...data,
        isDefault: false,
        slug: data.name?.toLowerCase(),
    });
};
exports.updateCategoryService = updateCategoryService;
const deleteCategoryService = async (userId, categoryId) => {
    const category = await categoryRepository.findById(categoryId);
    if (!category)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Category not found");
    if (category.isDefault)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "You are not authorized to delete the default category");
    if (category.userId !== userId)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to delete this category");
    return await categoryRepository.delete(categoryId);
};
exports.deleteCategoryService = deleteCategoryService;
