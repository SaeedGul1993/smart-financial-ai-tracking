"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentMonthRage = exports.getMonthlyRange = void 0;
exports.getCurrentMonthRange = getCurrentMonthRange;
exports.getTodayRange = getTodayRange;
async function getCurrentMonthRange() {
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setHours(23, 59, 59, 999);
    return { start: startDate, end: endDate };
}
async function getTodayRange() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    return { start: startDate, end: endDate };
}
const getMonthlyRange = (month, year) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return { start: startDate, end: endDate };
};
exports.getMonthlyRange = getMonthlyRange;
const currentMonthRage = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const startOfMonth = new Date(year, month - 1, 1);
    const startOfNextMonth = new Date(year, month, 1);
    return {
        month,
        start: startOfMonth,
        end: startOfNextMonth,
        year,
    };
};
exports.currentMonthRage = currentMonthRage;
