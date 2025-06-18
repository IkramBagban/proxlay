/*
  Warnings:

  - You are about to drop the column `userId` on the `PlanUsage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId,planType]` on the table `PlanUsage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `PlanUsage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PlanUsage_userId_idx";

-- DropIndex
DROP INDEX "PlanUsage_userId_planType_key";

-- AlterTable
ALTER TABLE "PlanUsage" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PlanUsage_ownerId_idx" ON "PlanUsage"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanUsage_ownerId_planType_key" ON "PlanUsage"("ownerId", "planType");
