import { processRecurringExpenses } from "../services/cron-recurring-expense.service";
import cron from "node-cron";

export const checkRecurringExpense = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      await processRecurringExpenses();
    },
    {
      timezone: "Asia/Karachi",
    },
  );
};
