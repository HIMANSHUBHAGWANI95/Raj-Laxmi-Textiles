"use client";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import "@/app/dashboard/dashboard.css";

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    // This should never happen because proxy redirects, but just in case.
    return <div>Loading...</div>;
  }

  // Fetch recent 3 orders for this user
  const recentOrders = await db.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { orderItems: { include: { menuItem: true } } },
  });

  return (
    <section className="dashboard-overview">
      <h1 className="welcome-banner">Welcome, {(session.user as any).name || (session.user as any).email}!</h1>
      <p className="quick-link">
        <a href="/restaurants" className="btn-primary">Browse Restaurants</a>
      </p>
      <h2 className="section-title">Recent Orders</h2>
      {recentOrders.length === 0 ? (
        <p>No recent orders.</p>
      ) : (
        <ul className="orders-list">
          {recentOrders.map((order) => (
            <li key={order.id} className="order-item">
              <span>Order #{order.id}</span>
              <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
              <span className="amount">₹{order.totalAmount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
