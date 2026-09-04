import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import OrderRow from "@/components/OrderRow";
import Link from "next/link";

export const revalidate = 0; // Prevent caching to show fresh database queries upon payment

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  // Retrieve user's complete order history
  const orders = await db.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              imageUrl: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="dashboard-section-header">
        <div>
          <h1
            className="title-sm"
            style={{
              fontSize: "1.75rem",
              background: "linear-gradient(135deg, #ffffff 60%, var(--color-primary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Orders
          </h1>
          <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Track and review your active shipments and transaction histories.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div
          className="card-glass"
          style={{
            padding: "5rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</span>
          <h3 className="title-sm" style={{ color: "white", marginBottom: "0.5rem" }}>
            No Orders Placed Yet
          </h3>
          <p className="text-muted" style={{ maxWidth: "400px", marginBottom: "1.5rem" }}>
            All your medicine and supplement purchases will appear here. Visit our shop catalog to place your first order.
          </p>
          <Link href="/shop" className="btn btn-primary">
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
