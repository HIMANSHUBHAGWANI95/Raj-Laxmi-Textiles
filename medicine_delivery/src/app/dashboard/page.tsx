import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { ShoppingCart, FileText, ArrowRight, Activity, Calendar } from "lucide-react";

export const revalidate = 0; // Prevent caching to show fresh database queries upon payment

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  // Retrieve user-specific counts & details
  const [orderCount, prescriptionCount, recentOrders] = await Promise.all([
    db.order.count({ where: { userId: session.user.id } }),
    db.prescription.count({ where: { userId: session.user.id } }),
    db.order.findMany({
      where: { userId: session.user.id },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1 className="title-md" style={{ color: "white", marginBottom: "0.5rem" }}>
          Welcome back, {session.user.name || "Patient"}!
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", fontSize: "0.95rem" }}>
          Here is your medical delivery overview. You can order fresh prescriptions, upload new doctor certificates for verification, and check shipment status.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="actions-grid">
        {/* Card 1 */}
        <Link href="/shop" className="action-card">
          <div className="action-icon-wrapper">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Order Medicines</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Search for prescription or OTC drugs and get them shipped.
            </p>
            <span style={{ fontSize: "0.85rem", color: "var(--color-primary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Shop Store <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/upload-prescription" className="action-card">
          <div className="action-icon-wrapper">
            <FileText size={24} />
          </div>
          <div>
            <h3 style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Upload Prescription</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
              Upload your doctor slips for pharmacist review.
            </p>
            <span style={{ fontSize: "0.85rem", color: "var(--color-accent)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Submit File <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </div>

      {/* Overview stats & Recent Orders list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2rem" }} className="grid-responsive-dash">
        {/* Left Side: Recent Orders */}
        <div>
          <div className="dashboard-section-header">
            <h3 className="title-sm" style={{ color: "white" }}>Recent Orders</h3>
            {orderCount > 3 && (
              <Link href="/dashboard/orders" style={{ fontSize: "0.9rem", color: "var(--color-primary)" }}>
                View All Orders →
              </Link>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <div className="card-glass" style={{ padding: "3rem", textAlign: "center" }}>
              <p className="text-muted" style={{ marginBottom: "1rem" }}>
                You have not placed any orders yet.
              </p>
              <Link href="/shop" className="btn btn-primary btn-sm">
                Shop Medicines
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order.id} className="order-item-row">
                  <div className="order-summary-header">
                    <div>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Order ID</span>
                      <h4 style={{ color: "white", fontSize: "0.95rem" }}>#{order.id}</h4>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Date</span>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Total Paid</span>
                      <p style={{ color: "white", fontWeight: "bold", fontSize: "0.95rem" }}>
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`badge-status status-${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Account Health Summary */}
        <div style={{ height: "fit-content" }}>
          <h3 className="title-sm" style={{ color: "white", marginBottom: "1.25rem" }}>Health Portal Stats</h3>
          <div className="card-glass" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  background: "rgba(14, 165, 233, 0.1)",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  color: "var(--color-primary)",
                }}
              >
                <Activity size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Total Orders Placed</span>
                <p style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>{orderCount} Orders</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  color: "var(--color-accent)",
                }}
              >
                <Calendar size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Prescriptions Uploaded</span>
                <p style={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>{prescriptionCount} Files</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style overrides for layouts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 1024px) {
          .grid-responsive-dash {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}} />
    </div>
  );
}
