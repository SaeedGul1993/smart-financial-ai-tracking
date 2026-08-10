"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeRecurringExpenseService = exports.pauseRecurringExpenseService = exports.getRecurringExpensesService = exports.createRecurringExpenseService = void 0;
const httpStatus_1 = require("../../constants/httpStatus");
const appError_1 = require("../../errors/appError");
const nextRunDate_1 = require("../../utils/nextRunDate");
const recurringExpense_repository_1 = require("./recurringExpense.repository");
const recurringExpenseRepository = new recurringExpense_repository_1.RecurringExpenseRepository();
const createRecurringExpenseService = async (input) => {
    return await recurringExpenseRepository.create(input);
};
exports.createRecurringExpenseService = createRecurringExpenseService;
const getRecurringExpensesService = async (userId) => {
    return await recurringExpenseRepository.findByUser(userId);
};
exports.getRecurringExpensesService = getRecurringExpensesService;
const pauseRecurringExpenseService = async (id, userId) => {
    const recurringExpense = await recurringExpenseRepository.findById(id);
    console.log(recurringExpense, "recurringExpense");
    if (!recurringExpense)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Recurring expense not found");
    if (recurringExpense.userId !== userId)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to pause this recurring expense");
    if (!recurringExpense.isActive)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Recurring expense is already inActive");
    return await recurringExpenseRepository.pauseRecurringExpense(id);
};
exports.pauseRecurringExpenseService = pauseRecurringExpenseService;
const resumeRecurringExpenseService = async (id, userId) => {
    const recurringExpense = await recurringExpenseRepository.findById(id);
    if (!recurringExpense)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.NOT_FOUND, "Recurring expense not found");
    if (recurringExpense.userId !== userId)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.FORBIDDEN, "You are not authorized to resume this recurring expense");
    if (recurringExpense.isActive)
        throw new appError_1.AppError(httpStatus_1.HTTP_STATUS.BAD_REQUEST, "Recurring expense is already active");
    let nextRunDate = new Date(recurringExpense.nextRunDate);
    const today = new Date();
    if (nextRunDate <= today) {
        while (nextRunDate <= today) {
            nextRunDate = (0, nextRunDate_1.calculateNextRunDate)(nextRunDate, recurringExpense.frequency);
        }
    }
    const updatedNextRunDate = recurringExpenseRepository.updateNextRunDate(id, nextRunDate);
    return updatedNextRunDate;
};
exports.resumeRecurringExpenseService = resumeRecurringExpenseService;
