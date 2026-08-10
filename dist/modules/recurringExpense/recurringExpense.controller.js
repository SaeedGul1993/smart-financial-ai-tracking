"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeRecurringExpenseController = exports.pauseRecurringExpenseController = exports.getRecurringExpensesController = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const recurringExpense_service_1 = require("./recurringExpense.service");
exports.getRecurringExpensesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const recurringExpenses = await (0, recurringExpense_service_1.getRecurringExpensesService)(userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Recurring expenses fetched successfully",
        data: recurringExpenses,
    });
});
exports.pauseRecurringExpenseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    console.log(id, userId, "id and userId");
    const recurringExpense = await (0, recurringExpense_service_1.pauseRecurringExpenseService)(id, userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Recurring expense paused successfully",
        data: recurringExpense,
    });
});
exports.resumeRecurringExpenseController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    const recurringExpense = await (0, recurringExpense_service_1.resumeRecurringExpenseService)(id, userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Recurring expense resumed successfully",
        data: recurringExpense,
    });
});
