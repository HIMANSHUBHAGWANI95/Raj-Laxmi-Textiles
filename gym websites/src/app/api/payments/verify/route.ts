import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";
import { generateCardNumber } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    // Verify signature
    let isSignatureValid = false;

    if (razorpay_order_id.startsWith("order_mock_")) {
      isSignatureValid = razorpay_signature === "mock_signature";
    } else {
      const secret = process.env.RAZORPAY_KEY_SECRET || "";
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body.toString())
        .digest("hex");
      isSignatureValid = expectedSignature === razorpay_signature;
    }

    if (!isSignatureValid) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
    }

    // Retrieve pending payment
    const payment = await db.payment.findFirst({
      where: {
        razorpayOrderId: razorpay_order_id,
        status: "PENDING"
      }
    });

    if (!payment) {
      return NextResponse.json({ message: "Pending transaction not found" }, { status: 404 });
    }

    // Parse PlanId from description
    const planIdMatch = payment.description?.match(/PlanId:\s*([^\s|]+)/);
    const planId = planIdMatch ? planIdMatch[1] : null;

    if (!planId) {
      return NextResponse.json({ message: "Plan information missing from payment record" }, { status: 400 });
    }

    const plan = await db.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }

    // Update payment record to SUCCESS
    const updatedPayment = await db.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      }
    });

    // Check if user has an existing active membership
    const existingMembership = await db.membership.findFirst({
      where: {
        userId: payment.userId,
        status: "ACTIVE"
      }
    });

    let membership;

    if (existingMembership) {
      // Extend existing membership
      const currentEndDate = new Date(existingMembership.endDate);
      const newEndDate = new Date(currentEndDate);
      newEndDate.setMonth(newEndDate.getMonth() + plan.duration);

      membership = await db.membership.update({
        where: { id: existingMembership.id },
        data: {
          endDate: newEndDate,
          planId: plan.id,
        }
      });
    } else {
      // Create new membership
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration);
      const cardNumber = generateCardNumber();

      membership = await db.membership.create({
        data: {
          userId: payment.userId,
          planId: plan.id,
          status: "ACTIVE",
          cardNumber,
          startDate,
          endDate,
          autoRenew: false
        }
      });
    }

    // Link membership to payment log
    await db.payment.update({
      where: { id: updatedPayment.id },
      data: {
        membershipId: membership.id
      }
    });

    return NextResponse.json({
      message: "Payment verified and membership activated successfully",
      membershipId: membership.id,
      cardNumber: membership.cardNumber
    });
  } catch (error) {
    console.error("Verification failed:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
