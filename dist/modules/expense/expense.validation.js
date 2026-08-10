"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseFilterSchema = exports.deleteExpenseSchema = exports.updateExpenseSchema = exports.createExpenseSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../generated/prisma/enums");
exports.createExpenseSchema = zod_1.z.object({
    amount: zod_1.z.number().min(1),
    date: zod_1.z.string().datetime().default(new Date().toISOString()),
    paymentMethod: zod_1.z.nativeEnum(enums_1.PaymentMethod),
    receiptUrl: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().min(1),
    userId: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    isRecurring: zod_1.z.boolean().optional(),
    frequency: zod_1.z.nativeEnum(enums_1.RecurringFrequency).optional(),
});
exports.updateExpenseSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    amount: zod_1.z.number().min(1).optional(),
    date: zod_1.z.date().optional(),
    paymentMethod: zod_1.z.nativeEnum(enums_1.PaymentMethod).optional(),
    receiptUrl: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().min(1).optional(),
    userId: zod_1.z.string().min(1).optional(),
    description: zod_1.z.string().optional(),
});
exports.deleteExpenseSchema = zod_1.z.object({
    expenseId: zod_1.z.string().min(1),
});
exports.expenseFilterSchema = zod_1.z.object({
    page: zod_1.z.string().min(1).default("1"),
    limit: zod_1.z.string().min(1).default("10"),
    categoryId: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.nativeEnum(enums_1.PaymentMethod).optional(),
    startDate: zod_1.z.string().datetime().optional(),
    endDate: zod_1.z.string().datetime().optional(),
});
