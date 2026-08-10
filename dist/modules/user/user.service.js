"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfileService = exports.getUserProfileService = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const appError_1 = require("../../errors/appError");
const user_repository_1 = require("./user.repository");
const userRepository = new user_repository_1.UserRepository();
const getUserProfileService = async (userId) => {
    const user = await userRepository.findById(userId);
    if (!user)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    return user;
};
exports.getUserProfileService = getUserProfileService;
const updateUserProfileService = async (userId, data) => {
    const user = await userRepository.findById(userId);
    if (!user)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "User not found");
    return await userRepository.updateProfile(userId, data);
};
exports.updateUserProfileService = updateUserProfileService;
