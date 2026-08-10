"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatSchema = void 0;
const zod_1 = require("zod");
exports.aiChatSchema = zod_1.z.object({
    message: zod_1.z
        .string()
        .trim()
        .min(1, "Message is required")
        .max(2000, "Message is too long"),
    history: zod_1.z
        .array(zod_1.z.object({
        role: zod_1.z.enum(["user", "assistant"]),
        content: zod_1.z.string().min(1),
    }))
        .max(20)
        .optional(),
});
