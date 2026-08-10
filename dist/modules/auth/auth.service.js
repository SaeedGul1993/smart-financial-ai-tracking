"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutService = exports.refreshTokenService = exports.loginService = exports.registerService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const httpStatus_1 = require("../../constants/httpStatus");
const appError_1 = require("../../errors/appError");
const auth_repository_1 = require("./auth.repository");
const jwt_1 = require("../../utils/jwt");
const authRepository = new auth_repository_1.AuthRepository();
const registerService = async (data) => {
    const { email, password } = data;
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.CONFLICT, "User already exists");
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const addUser = await authRepository.create({
        ...data,
        password: hashedPassword,
    });
    return addUser;
};
exports.registerService = registerService;
const loginService = async (data) => {
    const { email, password } = data;
    const user = await authRepository.findByEmail(email);
    if (!user)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    const passwordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Invalid password");
    let tokenPayload = {
        userId: user.id,
        email: user.email,
    };
    const accessToken = (0, jwt_1.generateToken)(tokenPayload);
    const refreshToken = (0, jwt_1.generateRefreshToken)(tokenPayload);
    await authRepository.createRefreshToken({
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    return { accessToken, refreshToken, user };
};
exports.loginService = loginService;
const refreshTokenService = async (data) => {
    const { refreshToken } = data;
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!decoded)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    const storedToken = await authRepository.findRefreshToken(refreshToken);
    if (!storedToken)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    if (storedToken.expiresAt < new Date())
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Refresh token expired");
    await authRepository.deleteRefreshToken(refreshToken);
    const newAccessToken = (0, jwt_1.generateToken)({
        userId: decoded.userId,
        email: decoded.email,
    });
    const newRefreshToken = (0, jwt_1.generateRefreshToken)({
        userId: decoded.userId,
        email: decoded.email,
    });
    await authRepository.createRefreshToken({
        token: newRefreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};
exports.refreshTokenService = refreshTokenService;
const logoutService = async (data) => {
    const { refreshToken } = data;
    const storedToken = await authRepository.findRefreshToken(refreshToken);
    if (!storedToken)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Invalid refresh token");
    if (storedToken.expiresAt < new Date())
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.UNAUTHORIZED, "Refresh token expired");
    await authRepository.deleteRefreshToken(refreshToken);
    return null;
};
exports.logoutService = logoutService;
