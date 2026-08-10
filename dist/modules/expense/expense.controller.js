"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpenseSummaryAnalyticsController = exports.deleteExpenseController = exports.updateExpenseController = exports.getExpensesController = exports.createExpenseController = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const expense_service_1 = require("./expense.service");
exports.createExpenseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, expense_service_1.createExpenseService)(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.CREATED, {
        success: true,
        message: "Expense created successfully",
        data: result,
    });
});
exports.getExpensesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, expense_service_1.getExpensesService)(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Expenses fetched successfully",
        data: {
            list: result,
            pagination: {
                total: result.length,
                page: Number(req.query.page),
                limit: Number(req.query.limit),
            },
        },
    });
});
exports.updateExpenseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const { id } = req.body;
    const result = await (0, expense_service_1.updateExpenseService)(id, userId, req.body);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Expense updated successfully",
        data: result,
    });
});
exports.deleteExpenseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const { expenseId } = req.body;
    const result = await (0, expense_service_1.deleteExpenseService)(expenseId, userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Expense deleted successfully",
        data: result,
    });
});
exports.getExpenseSummaryAnalyticsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, expense_service_1.getExpenseSummaryAnalyticsService)(userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Expense summary analytics fetched successfully",
        data: result,
    });
});
