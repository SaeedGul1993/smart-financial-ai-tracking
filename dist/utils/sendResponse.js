"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, statusCode, payload) => {
    return res.status(statusCode).json(payload);
};
exports.sendResponse = sendResponse;
