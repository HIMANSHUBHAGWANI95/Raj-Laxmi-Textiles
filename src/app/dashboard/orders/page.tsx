"use client";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import "@/app/dashboard/dashboard.css";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Loading...</div>;
  }

  const orders = await db.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { orderItems: { include: { menuItem: true } } },
  });

  const steps = ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];

  return (
    <section className="dashboard-orders">
      <h1 className="section-title">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-header">
                <span>Order #{order.id}</span>
                <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                <span className="amount">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <ul className="order-items">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="order-item-detail">
                    {item.quantity}x {item.menuItem.name} – ₹{item.price}
                  </li>
                ))}
              </ul>
              {order.status !== "DELIVERED" && (
                <div className="tracker">
                  {steps.map((step) => (
                    <div
                      key={step}
                      className={`tracker-step ${order.status === step ? "active" : ""}`}
                    >
                      {step.replace(/_/g, " ")}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
