"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIInsightRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class AIInsightRepository {
    async findByUserAndPeriod(userId, period) {
        return database_1.default.aIInsight.findFirst({
            where: {
                userId,
                period,
            },
        });
    }
    async create(data) {
        return database_1.default.aIInsight.create({
            data,
        });
    }
    async updateAIInsights(id, data) {
        return database_1.default.aIInsight.update({ where: { id }, data });
    }
}
exports.AIInsightRepository = AIInsightRepository;
