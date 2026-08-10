"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRecurringExpense = void 0;
const cron_recurring_expense_service_1 = require("../services/cron-recurring-expense.service");
const node_cron_1 = __importDefault(require("node-cron"));
const checkRecurringExpense = () => {
    node_cron_1.default.schedule("0 0 * * *", async () => {
        await (0, cron_recurring_expense_service_1.processRecurringExpenses)();
    }, {
        timezone: "Asia/Karachi",
    });
};
exports.checkRecurringExpense = checkRecurringExpense;
