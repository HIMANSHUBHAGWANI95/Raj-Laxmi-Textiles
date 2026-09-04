import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpay, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();
    if (!planId) {
      return NextResponse.json({ message: "Plan ID is required" }, { status: 400 });
    }

    const plan = await db.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json({ message: "Subscription plan not found" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const amountInPaise = Math.round(plan.price * 100);

    // Check if we are running in keyless/sandbox simulator mode
    if (!isRazorpayConfigured || !razorpay) {
      const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;

      // Record a pending transaction in the payment log
      await db.payment.create({
        data: {
          userId,
          amount: plan.price,
          currency: "INR",
          status: "PENDING",
          razorpayOrderId: mockOrderId,
          description: `Plan: ${plan.name} | Tier: ${plan.tier} | PlanId: ${plan.id}`
        }
      });

      return NextResponse.json({
        isMock: true,
        orderId: mockOrderId,
        amount: amountInPaise,
        currency: "INR"
      });
    }

    // Real Razorpay integration
    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(2, 9)}`,
      notes: {
        userId: userId,
        planId: planId
      }
    };

    const order = await razorpay.orders.create(orderOptions);

    // Save pending payment record
    await db.payment.create({
      data: {
        userId,
        amount: plan.price,
        currency: "INR",
        status: "PENDING",
        razorpayOrderId: order.id,
        description: `Plan: ${plan.name} | Tier: ${plan.tier} | PlanId: ${plan.id}`
      }
    });

    return NextResponse.json({
      isMock: false,
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error("Failed to create checkout order:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
