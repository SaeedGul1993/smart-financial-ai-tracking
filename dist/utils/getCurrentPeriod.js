"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPeriod = void 0;
const getCurrentPeriod = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
};
exports.getCurrentPeriod = getCurrentPeriod;
