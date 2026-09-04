import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { razorpay, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cartItems, deliveryAddress } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!deliveryAddress) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
    }

    // Fetch the items from the database to securely verify prices and calculate total
    const menuItemIds = cartItems.map((item: any) => item.id);
    const dbItems = await db.menuItem.findMany({
      where: {
        id: { in: menuItemIds },
      },
    });

    let subtotal = 0;
    for (const item of cartItems) {
      const dbItem = dbItems.find((d) => d.id === item.id);
      if (!dbItem) {
        return NextResponse.json(
          { error: `Menu item ${item.name} not found in database.` },
          { status: 400 }
        );
      }
      subtotal += dbItem.price * item.quantity;
    }

    const deliveryFee = 5.0; // Flat delivery fee
    const taxes = Math.round(subtotal * 0.18 * 100) / 100; // 18% Tax/GST
    const totalAmount = Math.round((subtotal + deliveryFee + taxes) * 100) / 100;

    // Create the order in the database
    const order = await db.order.create({
      data: {
        userId: (session.user as any).id,
        restaurantId: cartItems[0].restaurantId,
        totalAmount,
        deliveryAddress,
        status: "PENDING",
        paymentStatus: "PENDING",
        orderItems: {
          create: cartItems.map((item: any) => {
            const dbItem = dbItems.find((d) => d.id === item.id)!;
            return {
              menuItemId: item.id,
              quantity: item.quantity,
              price: dbItem.price,
            };
          }),
        },
      },
    });

    let razorpayOrderId = "";
    let isMock = false;

    if (!isRazorpayConfigured || !razorpay) {
      isMock = true;
      razorpayOrderId = `order_mock_${order.id}`;
    } else {
      try {
        const rp = razorpay!;
        const razorpayOrder = await (rp as any).orders.create({
          amount: Math.round(totalAmount * 100), // amount in paise
          currency: "INR",
          receipt: order.id,
        });
        razorpayOrderId = razorpayOrder.id;
      } catch (error) {
        console.error("Razorpay order generation failed, falling back to mock mode:", error);
        isMock = true;
        razorpayOrderId = `order_mock_${order.id}`;
      }
    }

    // Update order with the razorpayOrderId
    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: { razorpayOrderId },
    });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      razorpayOrderId,
      amount: totalAmount,
      currency: "INR",
      isMock,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Order creation api error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
