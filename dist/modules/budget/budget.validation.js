"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBudgetSchema = exports.updateBudgetSchema = exports.createBudgetSchema = void 0;
const zod_1 = require("zod");
exports.createBudgetSchema = zod_1.z.object({
    categoryId: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive().min(0),
    month: zod_1.z.number().positive().min(1).max(12),
    year: zod_1.z.number().positive().min(2000).max(2099),
});
exports.updateBudgetSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    categoryId: zod_1.z.string().uuid().optional(),
    amount: zod_1.z.number().positive().min(0).optional(),
    month: zod_1.z.number().positive().min(1).max(12).optional(),
    year: zod_1.z.number().positive().min(2000).max(2099).optional(),
});
exports.deleteBudgetSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
