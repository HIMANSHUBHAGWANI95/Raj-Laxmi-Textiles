"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, DollarSign, Calendar, Eye } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    slug: string;
    imageUrl: string | null;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  paymentStatus: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: Date | string;
  orderItems: OrderItem[];
}

export default function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="order-item-row" style={{ cursor: "pointer" }} onClick={() => setExpanded(!expanded)}>
      <div className="order-summary-header">
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Order ID</span>
          <h4 style={{ color: "white", fontSize: "0.95rem" }}>#{order.id}</h4>
        </div>
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Order Date</span>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <Calendar size={14} />
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Price</span>
          <p style={{ color: "white", fontWeight: "bold", fontSize: "0.95rem", display: "flex", alignItems: "center" }}>
            ${order.totalAmount.toFixed(2)}
          </p>
        </div>
        <div>
          <span className={`badge-status status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        <div style={{ color: "var(--text-secondary)" }}>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="order-details-pane" onClick={(e) => e.stopPropagation()}>
          {/* Purchased Items List */}
          <div>
            <h5 style={{ color: "white", fontSize: "0.9rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Eye size={16} style={{ color: "var(--color-primary)" }} />
              Items Purchased
            </h5>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "rgba(255, 255, 255, 0.02)",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        background: "var(--bg-tertiary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.1rem",
                        flexShrink: 0,
                      }}
                    >
                      {item.product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.imageUrl} alt={item.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        "💊"
                      )}
                    </div>
                    <span style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>{item.product.name}</span>
                  </div>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment specs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", fontSize: "0.9rem" }} className="responsive-inner-grid">
            {/* Address */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Shipping Address</span>
              <p style={{ color: "var(--text-secondary)", display: "flex", alignItems: "flex-start", gap: "0.25rem" }}>
                <MapPin size={16} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <span>{order.deliveryAddress}</span>
              </p>
            </div>

            {/* Payment Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Payment Details</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Payment status:</span>
                  <strong style={{ color: order.paymentStatus === "COMPLETED" ? "var(--color-accent)" : "var(--color-warning)" }}>
                    {order.paymentStatus}
                  </strong>
                </div>
                {order.razorpayPaymentId && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <span>TX ID:</span>
                    <span style={{ wordBreak: "break-all" }}>{order.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accordion inner mobile layout styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 600px) {
          .responsive-inner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}} />
    </div>
  );
}
