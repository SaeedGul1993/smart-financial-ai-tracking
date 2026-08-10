"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPipe = void 0;
const validationPipe = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body || req.query);
        if (!result.success) {
            return res.status(400).json({
                message: "Bad Request",
                errors: result.error.flatten().fieldErrors,
            });
        }
        req.body = result.data;
        next();
    };
};
exports.validationPipe = validationPipe;
