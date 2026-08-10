/*
  Warnings:

  - Changed the type of `type` on the `BudgetAlert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BudgetAlertType" AS ENUM ('WARNING', 'EXCEEDED');

-- DropForeignKey
ALTER TABLE "BudgetAlert" DROP CONSTRAINT "BudgetAlert_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetAlert" DROP CONSTRAINT "BudgetAlert_userId_fkey";

-- AlterTable
ALTER TABLE "BudgetAlert" ADD COLUMN     "emailSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailSentAt" TIMESTAMP(3),
ADD COLUMN     "pushSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushSentAt" TIMESTAMP(3),
DROP COLUMN "type",
ADD COLUMN     "type" "BudgetAlertType" NOT NULL;

-- AddForeignKey
ALTER TABLE "BudgetAlert" ADD CONSTRAINT "BudgetAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetAlert" ADD CONSTRAINT "BudgetAlert_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
