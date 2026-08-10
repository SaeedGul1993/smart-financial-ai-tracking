"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    currency: zod_1.z
        .number()
        .positive("Currency must be a positive number")
        .optional(),
    monthlyIncome: zod_1.z
        .number()
        .positive("Monthly income must be a positive number")
        .optional(),
});
