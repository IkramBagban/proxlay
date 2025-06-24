-- CreateEnum
CREATE TYPE "planUsageStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "PlanUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "planType" "PlanType" NOT NULL,
    "totalVideoUploads" INTEGER NOT NULL DEFAULT 0,
    "totalWorkspaces" INTEGER NOT NULL DEFAULT 0,
    "totalStorageUsed" INTEGER NOT NULL DEFAULT 0,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanUsage_userId_idx" ON "PlanUsage"("userId");

-- CreateIndex
CREATE INDEX "PlanUsage_planType_idx" ON "PlanUsage"("planType");

-- CreateIndex
CREATE INDEX "PlanUsage_subscriptionId_idx" ON "PlanUsage"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanUsage_userId_planType_key" ON "PlanUsage"("userId", "planType");

-- AddForeignKey
ALTER TABLE "PlanUsage" ADD CONSTRAINT "PlanUsage_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
