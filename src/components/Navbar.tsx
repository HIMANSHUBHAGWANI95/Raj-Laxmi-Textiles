"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { Utensils, ShoppingCart, User as UserIcon, LogOut, Menu, X, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="glass-panel" style={{
      position: "sticky",
      top: 12,
      zIndex: 100,
      borderRadius: "16px",
      margin: "12px 12px 24px 12px",
      border: "1px solid var(--card-border)"
    }}>
      <div className="container" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "64px",
        position: "relative"
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: "var(--primary)",
            color: "#ffffff",
            padding: "8px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Utensils size={20} />
          </div>
          <span style={{
            fontFamily: "var(--font-outfit)",
            fontWeight: 800,
            fontSize: "22px",
            letterSpacing: "-0.5px"
          }}>
            Crave<span style={{ color: "var(--primary)" }}>Bite</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: "none", alignItems: "center", gap: "24px" }} className="text-muted">
          <Link href="/" style={{ fontWeight: 500 }} className="btn-ghost">Home</Link>
          <Link href="/restaurants" style={{ fontWeight: 500 }} className="btn-ghost">Restaurants</Link>
          <a href="#" className="btn-ghost" style={{ fontWeight: 500 }}>Offers</a>
          {session && (
            <Link href="/dashboard" style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }} className="btn-ghost text-primary">
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
          )}
        </nav>

        {/* Desktop CTA Action Panel */}
        <div style={{ display: "none", alignItems: "center", gap: "16px" }}>
          {/* Cart Icon */}
          <Link href="/checkout" style={{ position: "relative", display: "flex", alignItems: "center", padding: "8px", color: "var(--foreground)" }} className="btn-ghost">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--primary)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--background)"
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="text-muted">
                <UserIcon size={18} />
                <span style={{ fontSize: "14px", fontWeight: 600 }}>
                  {session.user?.name?.split(" ")[0]}
                </span>
              </div>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-outline" 
                style={{ padding: "8px 14px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Link href="/login" className="btn btn-ghost" style={{ padding: "8px 16px" }}>
                Log In
              </Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: "10px 20px" }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Actions Panel (Burger Menu + Cart Trigger) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Cart Icon for Mobile */}
          <Link href="/checkout" style={{ position: "relative", display: "flex", alignItems: "center", padding: "8px", color: "var(--foreground)" }} className="btn-ghost">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-4px",
                background: "var(--primary)",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 700,
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--background)"
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Toggle Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="btn btn-ghost" 
            style={{ display: "flex", padding: "8px" }}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* CSS for display states matching queries */}
        <style jsx global>{`
          @media (min-width: 768px) {
            nav { display: flex !important; }
            div[style*="display: none;"] { display: flex !important; }
            button[style*="display: flex"] { display: none !important; }
          }
        `}</style>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          padding: "20px",
          borderTop: "1px solid var(--card-border)",
          background: "var(--card-bg)",
          borderRadius: "0 0 16px 16px",
          zIndex: 99
        }}>
          <Link href="/" onClick={() => setIsOpen(false)} style={{ fontSize: "16px", fontWeight: 600, padding: "8px 0" }}>Home</Link>
          <Link href="/restaurants" onClick={() => setIsOpen(false)} style={{ fontSize: "16px", fontWeight: 600, padding: "8px 0" }}>Restaurants</Link>
          <a href="#" onClick={() => setIsOpen(false)} style={{ fontSize: "16px", fontWeight: 600, padding: "8px 0" }}>Offers</a>
          {session && (
            <Link href="/dashboard" onClick={() => setIsOpen(false)} style={{ fontSize: "16px", fontWeight: 600, padding: "8px 0", color: "var(--primary)" }}>
              Dashboard
            </Link>
          )}

          {session ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid var(--card-border)", paddingTop: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="text-muted">
                <UserIcon size={18} />
                <span style={{ fontSize: "15px", fontWeight: 600 }}>Logged in as: {session.user?.name}</span>
              </div>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="btn btn-outline" 
                style={{ width: "100%", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--card-border)", paddingTop: "16px" }}>
              <Link href="/login" onClick={() => setIsOpen(false)} className="btn btn-ghost" style={{ width: "100%", padding: "12px" }}>
                Log In
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: "100%", padding: "12px" }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
