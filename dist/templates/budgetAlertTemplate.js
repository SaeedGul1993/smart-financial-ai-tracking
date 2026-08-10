"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetAlertTemplate = void 0;
const budgetAlertTemplate = (data) => {
    return `
    <h1>Budget Alert</h1>
    <p>The ${data.categoryName} budget is ${data.type}.</p>
    <p>The amount is ${data.amount}.</p>
    <p>The percentage is ${data.percentage}.</p>
    `;
};
exports.budgetAlertTemplate = budgetAlertTemplate;
