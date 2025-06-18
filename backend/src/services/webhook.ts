import { Response } from "express";
import { SubscriptionStatus, TransactionStatus } from "../generated/prisma";
import { prismaClient } from "../lib/db";

export async function handleSubscriptionActivated(
  subscriptionEntity: any,
  paymentEntity: any,
  res: Response
) {
  // Check if subscription already exists and is active (idempotency check)
  console.log("In handleSubscriptionActivated");
  const existing = await prismaClient.subscription.findFirst({
    where: {
      razorpaySubscriptionId: subscriptionEntity.id,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (existing) {
    console.log("Subscription: already active, skipping update");
    return;
  }

  const existingPayment = await prismaClient.transaction.findFirst({
    where: { razorpayPaymentId: paymentEntity.id },
  });

  if (existingPayment) {
    console.log(`Subscription: Payment ${paymentEntity.id} already processed`);
    res.status(200).send(`Payment ${paymentEntity.id} already processed`);
    return;
  }
  const userId =
    subscriptionEntity?.notes?.userId || paymentEntity?.notes?.userId;

  await prismaClient.$transaction(async (tx) => {
    const subscription = await tx.subscription.update({
      where: { razorpaySubscriptionId: subscriptionEntity.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(subscriptionEntity.current_start * 1000),
        currentPeriodEnd: new Date(subscriptionEntity.current_end * 1000),
      },
    });

    console.log(
      `Subscription: Updated subscription ${subscriptionEntity.id} to ACTIVE`
    );

    const payment = await tx.transaction.create({
      data: {
        razorpayPaymentId: paymentEntity.id,
        subscriptionId: subscription?.id as string,
        userId: userId,
        amount: paymentEntity.amount / 100, // Convert from paise to rupees
        currency: paymentEntity.currency,
        status: TransactionStatus.CAPTURED,
        method: paymentEntity.method,
        description: `Initial payment for subscription ${subscriptionEntity.id}`,
      },
    });
  });

  console.log(`Subscription: ${subscriptionEntity.id} activated`);
}

export async function handleSubscriptionCharged(
  subscriptionEntity: any,
  paymentEntity: any,
  res: Response
) {
  // Idempotency check - see if we already processed this payment
  const existingPayment = await prismaClient.transaction.findFirst({
    where: { razorpayPaymentId: paymentEntity.id },
  });

  if (existingPayment) {
    console.log(`charges: Payment ${paymentEntity.id} already processed`);
    res.status(200).send(`Payment ${paymentEntity.id} already processed`);
    return;
  }

  const userId =
    subscriptionEntity?.notes?.userId || paymentEntity?.notes?.userId;
  await prismaClient.$transaction(async (tx) => {
    const subscriptionUpdate = await tx.subscription.update({
      where: { razorpaySubscriptionId: subscriptionEntity.id },
      data: {
        currentPeriodStart: new Date(subscriptionEntity.current_start * 1000),
        currentPeriodEnd: new Date(subscriptionEntity.current_end * 1000),
        status: SubscriptionStatus.ACTIVE, 
      },
      select: {
        id: true,
      },
    });

    console.log("charges: subscriptionUpdate:", subscriptionUpdate);

    await tx.transaction.create({
      data: {
        razorpayPaymentId: paymentEntity.id,
        // @ts-ignore
        subscriptionId: subscriptionUpdate.id,
        userId: userId,
        amount: paymentEntity.amount / 100, // Convert from paise to rupees
        currency: paymentEntity.currency,
        status: TransactionStatus.CAPTURED,
        method: paymentEntity.method,
        description: `Recurring payment for subscription ${subscriptionEntity.id}`,
      },
    });
  });

  console.log(
    `charges: ${subscriptionEntity.id} charged with payment ${paymentEntity.id}`
  );
}
