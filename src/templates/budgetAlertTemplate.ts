import { BudgetAlertType } from "../generated/prisma/enums";

export const budgetAlertTemplate = (data: {
  categoryName: string;
  amount: number;
  percentage: number;
  type: BudgetAlertType;
}) => {
  return `
    <h1>Budget Alert</h1>
    <p>The ${data.categoryName} budget is ${data.type}.</p>
    <p>The amount is ${data.amount}.</p>
    <p>The percentage is ${data.percentage}.</p>
    `;
};
