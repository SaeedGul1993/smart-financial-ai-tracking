import "dotenv/config";
import app from "./app";
import { startBudgetReminderCron } from "./cron/budget-reminder.cron";
import { checkRecurringExpense } from "./cron/recurring-expense.cron";

const PORT = Number(process.env.PORT);
startBudgetReminderCron();
checkRecurringExpense();
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
