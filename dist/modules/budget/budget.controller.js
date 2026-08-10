"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudgetController = exports.updateBudgetController = exports.getBudgetsController = exports.createBudgetController = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const budget_service_1 = require("./budget.service");
exports.createBudgetController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const budget = await (0, budget_service_1.createBudgetService)(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.CREATED, {
        success: true,
        message: "Budget created successfully",
        data: budget,
    });
});
exports.getBudgetsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const { month, year } = req.query;
    const budgets = await (0, budget_service_1.getBudgetsService)(userId, Number(month), Number(year));
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Budgets fetched successfully",
        data: budgets,
    });
});
exports.updateBudgetController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const budget = await (0, budget_service_1.updateBudgetService)(req.body.id, userId, req.body);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Budget updated successfully",
        data: budget,
    });
});
exports.deleteBudgetController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const budget = await (0, budget_service_1.deleteBudgetService)(req.body.id, userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Budget deleted successfully",
        data: budget,
    });
});
