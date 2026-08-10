/*
  Warnings:

  - You are about to drop the column `message` on the `AIInsight` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `AIInsight` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `AIInsight` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `AIInsight` table. All the data in the column will be lost.
  - Added the required column `period` to the `AIInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `result` to the `AIInsight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AIInsight` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AIInsight_createdAt_idx";

-- DropIndex
DROP INDEX "AIInsight_type_idx";

-- AlterTable
ALTER TABLE "AIInsight" DROP COLUMN "message",
DROP COLUMN "metadata",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "model" TEXT,
ADD COLUMN     "period" TEXT NOT NULL,
ADD COLUMN     "result" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "AIInsight_userId_period_idx" ON "AIInsight"("userId", "period");
