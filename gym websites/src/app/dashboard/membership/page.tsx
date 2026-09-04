import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Calendar, CreditCard, ShieldAlert } from "lucide-react";
import "./membership.css";

export const revalidate = 0; // Disable static cache for live checkout updates

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch user's active membership
  const membership = await db.membership.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { plan: true }
  });

  // Fetch user's payment records
  const payments = await db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  const getTierClass = (tier: string) => {
    if (tier === "PLATINUM") return "platinum";
    if (tier === "GOLD") return "gold";
    return "silver";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="membership-container">
      {/* Header */}
      <div className="db-header">
        <div className="db-title-section">
          <span className="db-subtitle">Manage Subscription</span>
          <h1 className="db-title">Membership Card</h1>
        </div>
      </div>

      {membership ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Digital Card Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px", alignItems: "center" }} className="grid-responsive">
            <div className="gym-card">
              <div className="gym-card-header">
                <div className="gym-card-logo">
                  <span className="gym-card-logo-spark">⚡ AB</span> FITNESS
                </div>
                <div className={`gym-card-tier ${getTierClass(membership.plan.tier)}`}>
                  {membership.plan.tier}
                </div>
              </div>

              <div className="gym-card-body">
                <div className="gym-card-info">
                  <div className="gym-card-number">
                    {membership.cardNumber}
                  </div>
                  
                  <div className="gym-card-dates">
                    <div className="gym-card-holder">
                      <span className="gym-card-lbl">Card Holder</span>
                      <span className="gym-card-val">{session.user.name}</span>
                    </div>
                    <div className="gym-card-holder">
                      <span className="gym-card-lbl">Expires</span>
                      <span className="gym-card-val">
                        {new Date(membership.endDate).toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inline SVG QR Code Matrix */}
                <div className="gym-card-qr">
                  <svg width="100%" height="100%" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M0 0h7v7H0V0zm2 2v3h3V2H2zm5 0h2v1H7V2zm2 2H8v1h1V4zm0 2H7v1h2V6zm-9 3h1v1H0V9zm1 1h1v1H1v-1zm1 1h1v1H2v-1zm4-2h1v1H6V9zm1 1h1v1H7v-1zm1 1h1v1H8v-1zm1 1H7v1h2v-1zM0 12h2v1H0v-1zm2 1h1v1H2v-1zm1 1h1v1H3v-1zm-3 2h2v1H0v-1zm2 1h1v1H2v-1zm2-5h1v1H4v-1zm1 1h1v1H5v-1zm1 1H4v1h2v-1zm6-12h7v7h-7V0zm2 2v3h3V2h-3zm5 0h2v1h-2V2zm2 2h-1v1h1V4zm0 2h-2v1h2V6zm-9 3h1v1h-1V9zm1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm4-2h1v1h-1V9zm1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm1 1h-2v1h2v-1zM12 12h2v1h-2v-1zm2 1h1v1h-1v-1zm1 1h1v1h-1v-1zm-3 2h2v1h-2v-1zm2 1h1v1h-1v-1zm2-5h1v1h-1v-1zm1 1h1v1h-1v-1zm1 1h-2v1h2v-1zm-18 6h7v7H0v-7zm2 2v3h3V2h-3zm5 0h2v1H7v-1zm2 2H8v1h1V4zm0 2H7v1h2V6zm-9 3h1v1H0V9zm1 1h1v1H1v-1zm1 1h1v1H2v-1zm4-2h1v1H6V9zm1 1h1v1H7v-1zm1 1h1v1H8v-1zm1 1H7v1h2v-1zm11 6h1v1h-1v-1zm1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm-3 2h2v1h-2v-1zm2 1h1v1h-1v-1zm2-5h1v1h-1v-1zm1 1h1v1h-1v-1zm1 1h-2v1h2v-1zm-9 3h1v1h-1v-1zm1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm4-2h1v1h-1V9zm1 1h1v1h-1v-1zm1 1h1v1h-1v-1zm1 1h-2v1h2v-1z" 
                      fill="#0a0a0c"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Details Box */}
            <div className="card-glass" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "32px" }}>
              <div>
                <h3 style={{ fontSize: "22px", marginBottom: "16px", fontWeight: "700" }}>Active Subscription</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
                  Your subscription grants you entry at any of our clubs across the country. Display the virtual QR card at the front desk to scan in upon arrival.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Plan Name:</span>
                    <span style={{ fontWeight: "600" }}>{membership.plan.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Monthly Cost:</span>
                    <span style={{ fontWeight: "600" }}>₹{membership.plan.price}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--text-secondary)" }}>Auto Renew:</span>
                    <span style={{ fontWeight: "600" }}>{membership.autoRenew ? "Enabled" : "Disabled"}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "12px 16px", borderRadius: "var(--radius-md)", fontSize: "12px", color: "var(--text-secondary)", marginTop: "24px" }}>
                <Calendar size={14} color="var(--primary)" />
                <span>Active since {formatDate(membership.startDate)} to {formatDate(membership.endDate)}</span>
              </div>
            </div>
          </div>

          {/* Payments Section */}
          <div className="payments-section">
            <h3 className="payments-title">Transaction History</h3>
            
            {payments.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>No transactions logged yet.</p>
            ) : (
              <div className="payments-table-container">
                <table className="payments-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Order ID</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id}>
                        <td>
                          {new Date(p.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td style={{ fontFamily: "monospace", fontSize: "12px" }}>
                          {p.razorpayOrderId}
                        </td>
                        <td>{p.description || "Subscription Purchase"}</td>
                        <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>
                          ₹{p.amount}
                        </td>
                        <td>
                          <span className={`status-badge ${p.status.toLowerCase()}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* No Membership State */
        <div className="card-glass no-membership-card">
          <div className="no-membership-icon">
            <ShieldAlert size={32} />
          </div>
          <h2 className="no-membership-title">No Active Membership</h2>
          <p className="no-membership-desc">
            You do not currently have an active membership subscription. Join a pricing tier today to unlock workouts tracking, locations access, and your virtual gym pass.
          </p>
          <Link href="/#pricing" className="btn btn-primary">
            View Membership Plans
          </Link>
        </div>
      )}
    </div>
  );
}
