import cors from "cors";
import express, { ErrorRequestHandler } from "express";
import { globalErrorHandler } from "./middleware/error.middleware";
import authRoutes from "./modules/auth/auth.route";
import categoryRoutes from "./modules/category/category.route";
import userRoutes from "./modules/user/user.route";
import expenseRoutes from "./modules/expense/expense.route";
import incomeRoutes from "./modules/income/income.route";
import budgetRoutes from "./modules/budget/budget.route";
import recurringExpenseRoutes from "./modules/recurringExpense/recurringExpense.route";
import aiRoutes from "./modules/ai/ai.route";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/recurring-expense", recurringExpenseRoutes);
app.use("/api/ai", aiRoutes);
app.use(globalErrorHandler as ErrorRequestHandler);

export default app;
