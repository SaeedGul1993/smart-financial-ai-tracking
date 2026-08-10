"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class UserRepository {
    async findById(userId) {
        return await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                currency: true,
                monthlyIncome: true,
                password: false,
            },
        });
    }
    async updateProfile(userId, data) {
        return await database_1.default.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                currency: true,
                monthlyIncome: true,
                password: false,
            },
        });
    }
}
exports.UserRepository = UserRepository;
