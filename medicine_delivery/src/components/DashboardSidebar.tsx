"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, ShoppingBag, FileText, Settings, User } from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="dashboard-sidebar">
      {/* User Quick Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User size={20} />}
        </div>
        <div style={{ minWidth: 0 }}>
          <h4
            style={{
              color: "white",
              fontSize: "0.95rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {session?.user?.name || "Patient Profile"}
          </h4>
          <span className="badge badge-info" style={{ fontSize: "0.6rem", padding: "0.1rem 0.4rem" }}>
            {session?.user?.role || "MEMBER"}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <div>
        <h4 className="sidebar-title">Workspace</h4>
        <div className="sidebar-menu">
          <Link
            href="/dashboard"
            className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </Link>
          <Link
            href="/dashboard/orders"
            className={`sidebar-link ${isActive("/dashboard/orders") ? "active" : ""}`}
          >
            <ShoppingBag size={18} />
            <span>My Orders</span>
          </Link>
          <Link
            href="/dashboard/prescriptions"
            className={`sidebar-link ${isActive("/dashboard/prescriptions") ? "active" : ""}`}
          >
            <FileText size={18} />
            <span>My Prescriptions</span>
          </Link>
        </div>
      </div>

      {/* Bottom info */}
      <div style={{ marginTop: "auto", fontSize: "0.8rem", color: "var(--text-muted)" }}>
        Logged in as: <br />
        <span style={{ color: "var(--text-secondary)", wordBreak: "break-all" }}>
          {session?.user?.email}
        </span>
      </div>
    </aside>
  );
}
