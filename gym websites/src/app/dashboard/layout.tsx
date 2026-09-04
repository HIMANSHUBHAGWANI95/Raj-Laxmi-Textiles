import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import "./dashboard.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name || "Member",
    email: session.user.email || "",
    role: (session.user as any).role || "MEMBER",
  };

  return (
    <div className="db-layout">
      <DashboardSidebar user={user} />
      <main className="db-main">{children}</main>
    </div>
  );
}
