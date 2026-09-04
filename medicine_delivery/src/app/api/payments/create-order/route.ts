import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, deliveryAddress } = body as {
      items: { id: string; quantity: number }[];
      deliveryAddress: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!deliveryAddress) {
      return NextResponse.json({ message: "Delivery address is required" }, { status: 400 });
    }

    // 1. Calculate true total from SQLite database prices (Security validation)
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        return NextResponse.json(
          { message: `Product not found: ${item.id}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // 2. Detect Sandbox / Mock mode
    const keyId = process.env.RAZORPAY_KEY_ID;
    const isMock = !keyId || keyId === "rzp_test_yourkeyhere";
    
    let razorpayOrderId = "";

    if (isMock) {
      // Generate a mock order identifier
      razorpayOrderId = `order_mock_${Math.random().toString(36).substring(2, 15)}`;
    } else {
      // Generate a real order with Razorpay
      try {
        const order = await (razorpay as any).orders.create({
          amount: Math.round(totalAmount * 100), // in cents/paise
          currency: "USD",
          receipt: `receipt_${Date.now()}`,
        });
        razorpayOrderId = order.id;
      } catch (err: any) {
        console.error("Razorpay API Error:", err);
        return NextResponse.json(
          { message: "Failed to communicate with Razorpay payment gateway." },
          { status: 520 }
        );
      }
    }

    // 3. Create database Order entry
    const newOrder = await db.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        status: "PENDING",
        deliveryAddress,
        paymentStatus: "PENDING",
        razorpayOrderId,
        orderItems: {
          create: orderItemsData,
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      razorpayOrderId,
      amount: totalAmount,
      isMock,
      keyId: isMock ? "mock_key" : keyId,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { message: "An error occurred while creating order" },
      { status: 500 }
    );
  }
}
