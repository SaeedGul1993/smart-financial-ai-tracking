"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgetStatus = void 0;
const getBudgetStatus = (percentage) => {
    if (percentage >= 100)
        return "EXCEEDED";
    if (percentage >= 90)
        return "WARNING";
    return "ON_TRACK";
};
exports.getBudgetStatus = getBudgetStatus;
