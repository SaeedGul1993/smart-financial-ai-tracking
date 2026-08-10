"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class AuthRepository {
    async findByEmail(email) {
        return await database_1.default.user.findUnique({ where: { email } });
    }
    async create(data) {
        return await database_1.default.user.create({ data });
    }
    async createRefreshToken(data) {
        return await database_1.default.refreshToken.upsert({
            where: { userId: data.userId },
            update: {
                token: data.token,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
            create: {
                token: data.token,
                userId: data.userId,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
    }
    async findRefreshToken(token) {
        return await database_1.default.refreshToken.findUnique({ where: { token } });
    }
    async deleteRefreshToken(token) {
        return await database_1.default.refreshToken.delete({ where: { token } });
    }
}
exports.AuthRepository = AuthRepository;
