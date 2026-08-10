"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomeAnalyticsController = exports.deleteIncomeController = exports.updateIncomeController = exports.getIncomeByIdController = exports.getIncomesController = exports.createIncomeController = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const income_service_1 = require("./income.service");
exports.createIncomeController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, income_service_1.createIncomeService)({ ...req.body, userId });
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.CREATED, {
        success: true,
        message: "Income created successfully",
        data: result,
    });
});
exports.getIncomesController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, income_service_1.getIncomesService)(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Income list fetched successfully",
        data: result,
    });
});
exports.getIncomeByIdController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, income_service_1.getIncomeByIdService)(req.params.id, userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Income fetched successfully",
        data: result,
    });
});
exports.updateIncomeController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, income_service_1.updateIncomeService)(req.body.id, userId, req.body);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Income updated successfully",
        data: result,
    });
});
exports.deleteIncomeController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, income_service_1.deleteIncomeService)(req.body.id, userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Income deleted successfully",
        data: result,
    });
});
exports.getIncomeAnalyticsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, income_service_1.getIncomeAnalyticsService)(userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Income analytics fetched successfully",
        data: result,
    });
});
