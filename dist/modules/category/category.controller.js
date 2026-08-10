"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryController = exports.updateCategoryController = exports.findAllCategoriesController = exports.createCategoryController = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const category_service_1 = require("./category.service");
const createCategoryController = async (req, res) => {
    const userId = req.user.userId;
    const data = req.body;
    const result = await (0, category_service_1.createCategoryService)(userId, data);
    (0, sendResponse_1.sendResponse)(res, 201, {
        success: true,
        message: "Category created successfully",
        data: result,
    });
};
exports.createCategoryController = createCategoryController;
const findAllCategoriesController = async (req, res) => {
    const userId = req.user.userId;
    const result = await (0, category_service_1.findAllCategoriesService)(userId);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "Categories fetched successfully",
        data: result,
    });
};
exports.findAllCategoriesController = findAllCategoriesController;
const updateCategoryController = async (req, res) => {
    const userId = req.user.userId;
    const categoryId = req.body.id;
    const data = req.body;
    const result = await (0, category_service_1.updateCategoryService)(userId, categoryId, data);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "Category updated successfully",
        data: result,
    });
};
exports.updateCategoryController = updateCategoryController;
const deleteCategoryController = async (req, res) => {
    const userId = req.user.userId;
    const categoryId = req.body.categoryId;
    const result = await (0, category_service_1.deleteCategoryService)(userId, categoryId);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
};
exports.deleteCategoryController = deleteCategoryController;
