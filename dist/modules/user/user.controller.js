"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileController = exports.getUserProfileController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
exports.getUserProfileController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const result = await (0, user_service_1.getUserProfileService)(userId);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "User profile fetched successfully",
        data: result,
    });
});
exports.updateUserProfileController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user.userId;
    const data = req.body;
    const result = await (0, user_service_1.updateUserProfileService)(userId, data);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
});
