"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const appError_1 = require("../errors/appError");
const jwt_1 = require("../utils/jwt");
const httpStatus_1 = require("../constants/httpStatus");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    const token = authHeader.split(" ")[1];
    if (!token)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Unauthorized");
    const decoded = (0, jwt_1.verifyToken)(token);
    req.user = decoded;
    next();
};
exports.authMiddleware = authMiddleware;
