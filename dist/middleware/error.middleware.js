"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (error, req, res, next) => {
    res.status(error?.statusCode || 500).json({
        statusCode: error?.statusCode || 500,
        success: false,
        message: error?.message || "Internal Server Error",
    });
};
exports.globalErrorHandler = globalErrorHandler;
