"use client";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import "./dashboard.css";

const Sidebar = () => {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (!session) redirect("/login");

  return (
    <nav className="dashboard-sidebar glass">
      <h2 className="sidebar-title">CraveBite</h2>
      <ul className="sidebar-links">
        <li><Link href="/dashboard">Overview</Link></li>
        <li><Link href="/dashboard/orders">Orders</Link></li>
        <li><Link href="/dashboard/addresses">Addresses</Link></li>
        <li><Link href="/dashboard/reviews">Reviews</Link></li>
      </ul>
    </nav>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">{children}</main>
    </div>
  );
}
