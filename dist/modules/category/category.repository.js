"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const database_1 = __importDefault(require("../../config/database"));
class CategoryRepository {
    async findAll(userId) {
        return await database_1.default.category.findMany({
            where: { OR: [{ isDefault: true }, { userId }] },
            orderBy: {
                name: "asc",
            },
        });
    }
    async findById(id) {
        return await database_1.default.category.findUnique({
            where: { id },
        });
    }
    async create(data) {
        return await database_1.default.category.create({
            data,
        });
    }
    async update(id, data) {
        return database_1.default.category.update({ where: { id }, data });
    }
    async delete(id) {
        return database_1.default.category.delete({ where: { id } });
    }
    async findDuplicateCategory(slug, name) {
        return database_1.default.category.findFirst({
            where: {
                slug,
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });
    }
}
exports.CategoryRepository = CategoryRepository;
