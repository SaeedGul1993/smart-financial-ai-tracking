/*
  Warnings:

  - A unique constraint covering the columns `[recurringExpenseId,date]` on the table `Expense` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Expense_recurringExpenseId_date_key" ON "Expense"("recurringExpenseId", "date");
