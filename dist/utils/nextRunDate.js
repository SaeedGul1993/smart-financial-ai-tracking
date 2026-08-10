"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextValidRunDate = exports.calculateNextRunDate = void 0;
const httpStatus_1 = require("../constants/httpStatus");
const appError_1 = require("../errors/appError");
const enums_1 = require("../generated/prisma/enums");
const calculateNextRunDate = (date, frequency) => {
    const nextDate = new Date(date);
    switch (frequency) {
        case enums_1.RecurringFrequency.DAILY:
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case enums_1.RecurringFrequency.WEEKLY:
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case enums_1.RecurringFrequency.MONTHLY:
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case enums_1.RecurringFrequency.YEARLY:
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Invalid frequency");
    }
    return nextDate;
};
exports.calculateNextRunDate = calculateNextRunDate;
const getNextValidRunDate = (nextRunDate, frequency) => {
    let date = new Date(nextRunDate);
    const now = new Date();
    while (date < now) {
        date = (0, exports.calculateNextRunDate)(date, frequency);
    }
    return date;
};
exports.getNextValidRunDate = getNextValidRunDate;
