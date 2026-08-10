/*
  Warnings:

  - Added the required column `paymentMethod` to the `RecurringExpense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecurringExpense" ADD COLUMN     "description" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL;
