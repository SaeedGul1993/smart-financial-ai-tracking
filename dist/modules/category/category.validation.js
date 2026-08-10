"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategorySchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    type: zod_1.z.enum(["INCOME", "EXPENSE"]),
});
exports.updateCategorySchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1).optional(),
    type: zod_1.z.enum(["INCOME", "EXPENSE"]).optional(),
});
exports.deleteCategorySchema = zod_1.z.object({
    categoryId: zod_1.z.string().min(1),
});
