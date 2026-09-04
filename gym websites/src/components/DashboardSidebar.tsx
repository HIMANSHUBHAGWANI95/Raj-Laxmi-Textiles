"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  History, 
  LineChart, 
  Home,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Membership", path: "/dashboard/membership", icon: <CreditCard size={18} /> },
    { name: "Fitness Goals", path: "/dashboard/goals", icon: <Target size={18} /> },
    { name: "Workout Logger", path: "/dashboard/log", icon: <History size={18} /> },
    { name: "Progress Tracking", path: "/dashboard/progress", icon: <LineChart size={18} /> },
  ];

  const getInitials = (name: string) => {
    if (!name) return "AB";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Header */}
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 150,
        }}
        className="mobile-header-only"
      >
        <div className="db-brand" style={{ margin: 0 }}>
          <span className="db-brand-logo">⚡ AB</span> FITNESS
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer" }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <style jsx global>{`
        .mobile-header-only {
          display: none !important;
        }
        @media (max-width: 992px) {
          .mobile-header-only {
            display: flex !important;
          }
        }
      `}</style>

      {/* Sidebar navigation */}
      <aside className={`db-sidebar ${isOpen ? "open" : ""}`}>
        <div>
          <div className="db-brand">
            <span className="db-brand-logo">⚡ AB</span> FITNESS
          </div>
          
          <ul className="db-menu-list">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`db-menu-link ${isActive(item.path) ? "active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <ul className="db-menu-list" style={{ marginBottom: "20px" }}>
            <li>
              <Link href="/" className="db-menu-link">
                <Home size={18} />
                <span>Back to Website</span>
              </Link>
            </li>
            <li>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="db-menu-link" 
                style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </li>
          </ul>

          <div className="db-user-panel">
            <div className="db-user-avatar">{getInitials(user.name)}</div>
            <div className="db-user-info">
              <span className="db-user-name">{user.name}</span>
              <span className="db-user-role">{user.role}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
