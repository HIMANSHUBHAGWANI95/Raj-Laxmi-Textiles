import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = body as {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    };

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { message: "Missing required verification parameters" },
        { status: 400 }
      );
    }

    // 1. Locate order by razorpayOrderId
    const order = await db.order.findFirst({
      where: { razorpayOrderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    let isSignatureValid = false;

    // 2. Perform signature validation
    if (razorpayOrderId.startsWith("order_mock_")) {
      // Sandbox validation bypass
      isSignatureValid = razorpaySignature === "mock_signature";
    } else {
      // Secure HMAC validation for real transactions
      const secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_here";
      const hash = crypto
        .createHmac("sha256", secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
      
      isSignatureValid = hash === razorpaySignature;
    }

    if (!isSignatureValid) {
      // Mark order as failed in DB
      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "FAILED",
        },
      });
      
      return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
    }

    // 3. Update order in database on success
    await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "COMPLETED",
        status: "PROCESSING", // Order moves to processing for dispatch
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // 4. Atomically decrement stock counts for each product
    for (const item of order.orderItems) {
      await db.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and order updated successfully",
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred during payment verification" },
      { status: 500 }
    );
  }
}
