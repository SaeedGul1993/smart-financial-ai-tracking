"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAIController = exports.refreshSpendingAnalysisController = exports.getFinancialHealthController = exports.analyzeSpendingController = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const ai_service_1 = require("./ai.service");
exports.analyzeSpendingController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const response = await (0, ai_service_1.getSpendingAnalysis)(userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Spending analysis completed",
        data: response,
    });
});
exports.getFinancialHealthController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const response = await (0, ai_service_1.getFinancialHealth)(userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Financial health analysis completed",
        data: response,
    });
});
exports.refreshSpendingAnalysisController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const response = await (0, ai_service_1.refreshSpendingAnalysis)(userId);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "Refresh Spending analysis Fetched.",
        data: response,
    });
});
exports.chatWithAIController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { userId } = req.user;
    const result = await (0, ai_service_1.chatWithAI)(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, httpStatus_1.HTTP_STATUS.OK, {
        success: true,
        message: "AI response generated successfully",
        data: result,
    });
});
