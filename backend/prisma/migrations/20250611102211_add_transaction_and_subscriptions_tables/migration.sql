-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('CREATED', 'AUTHENTICATED', 'ACTIVE', 'PENDING', 'HALTED', 'CANCELLED', 'COMPLETED', 'EXPIRED', 'TRIAL_ACTIVE', 'TRIAL_EXPIRED');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('BASIC', 'PRO', 'TRIAL_BASIC');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('CREATED', 'AUTHORIZED', 'CAPTURED', 'REFUNDED', 'FAILED');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "razorpaySubscriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "planType" "PlanType" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "isTrialSubscription" BOOLEAN NOT NULL DEFAULT false,
    "trialStartDate" TIMESTAMP(3),
    "trialEndDate" TIMESTAMP(3),
    "hasUsedTrial" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "subscriptionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "TransactionStatus" NOT NULL,
    "method" TEXT,
    "description" TEXT,
    "isTrialTransaction" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_razorpaySubscriptionId_key" ON "Subscription"("razorpaySubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_razorpaySubscriptionId_idx" ON "Subscription"("razorpaySubscriptionId");

-- CreateIndex
CREATE INDEX "Subscription_userId_hasUsedTrial_idx" ON "Subscription"("userId", "hasUsedTrial");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_razorpayPaymentId_key" ON "Transaction"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "Transaction_subscriptionId_idx" ON "Transaction"("subscriptionId");

-- CreateIndex
CREATE INDEX "Transaction_razorpayPaymentId_idx" ON "Transaction"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
