"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutController = exports.refreshTokenController = exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("./auth.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
exports.registerController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, auth_service_1.registerService)(req.body);
    (0, sendResponse_1.sendResponse)(res, 201, {
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
exports.loginController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, auth_service_1.loginService)(req.body);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "User logged in successfully",
        data: result,
    });
});
exports.refreshTokenController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, auth_service_1.refreshTokenService)(req.body);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "Refresh token generated successfully",
        data: result,
    });
});
exports.logoutController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await (0, auth_service_1.logoutService)(req.body);
    (0, sendResponse_1.sendResponse)(res, 200, {
        success: true,
        message: "Logout successful",
        data: result,
    });
});
