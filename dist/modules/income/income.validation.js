"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIncomeSchema = exports.updateIncomeSchema = exports.createIncomeSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../generated/prisma/enums");
exports.createIncomeSchema = zod_1.z.object({
    amount: zod_1.z.number().positive(),
    date: zod_1.z.string().datetime().default(new Date().toISOString()),
    description: zod_1.z.string().min(1),
    source: zod_1.z.nativeEnum(enums_1.IncomeSource),
});
exports.updateIncomeSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    amount: zod_1.z.number().positive().optional(),
    date: zod_1.z.string().datetime().default(new Date().toISOString()).optional(),
    description: zod_1.z.string().min(1).optional(),
    source: zod_1.z.nativeEnum(enums_1.IncomeSource).optional(),
});
exports.deleteIncomeSchema = zod_1.z.object({
    id: zod_1.z.string().uuid().min(1, "Income ID is required"),
});
