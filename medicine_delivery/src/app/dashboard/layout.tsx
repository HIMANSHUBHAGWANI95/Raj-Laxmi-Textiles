import React from "react";
import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div className="dashboard-container">
        {/* Shared Dashboard Sidebar */}
        <DashboardSidebar />

        {/* Dashboard sub-page content workspace */}
        <main className="dashboard-workspace">{children}</main>
      </div>
    </div>
  );
}
