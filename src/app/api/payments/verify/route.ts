import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { error: "Missing required verification parameters" },
        { status: 400 }
      );
    }

    let isVerified = false;

    // Check if order is a mock order
    if (razorpayOrderId.startsWith("order_mock_")) {
      if (razorpaySignature === "mock_signature") {
        isVerified = true;
      }
    } else {
      // Verify using real Razorpay signature
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return NextResponse.json(
          { error: "Razorpay key secret not configured on server" },
          { status: 500 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(razorpayOrderId + "|" + razorpayPaymentId)
        .digest("hex");

      if (generatedSignature === razorpaySignature) {
        isVerified = true;
      }
    }

    if (!isVerified) {
      // Mark transaction/order as failed in database if needed, or just return 400
      await db.order.updateMany({
        where: { razorpayOrderId },
        data: {
          paymentStatus: "FAILED",
          status: "CANCELLED",
        },
      });

      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Success: Update the Order status to PREPARING and payment status to PAID
    // Find the order first by razorpayOrderId
    const order = await db.order.findFirst({
      where: { razorpayOrderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found in database" }, { status: 404 });
    }

    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        status: "PREPARING",
        paymentStatus: "PAID",
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order placed and paid successfully",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error("Order verification api error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
