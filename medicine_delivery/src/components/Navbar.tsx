"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Menu, X, User, LogOut, FileText, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(6, 11, 19, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-color)",
        transition: "all var(--transition-normal)",
      }}
    >
      <div className="container" style={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.4rem",
            fontWeight: 700,
            fontFamily: "var(--font-title)",
            color: "white",
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
              width: "32px",
              height: "32px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              color: "white",
            }}
          >
            ✙
          </span>
          Medi<span style={{ color: "var(--color-primary)" }}>Quick</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="desktop-menu" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link
            href="/"
            style={{
              color: isActive("/") ? "var(--color-primary)" : "var(--text-secondary)",
              fontWeight: isActive("/") ? 600 : 400,
              transition: "color var(--transition-fast)",
            }}
          >
            Home
          </Link>
          <Link
            href="/shop"
            style={{
              color: isActive("/shop") ? "var(--color-primary)" : "var(--text-secondary)",
              fontWeight: isActive("/shop") ? 600 : 400,
              transition: "color var(--transition-fast)",
            }}
          >
            Shop Medicines
          </Link>
          <Link
            href="/upload-prescription"
            style={{
              color: isActive("/upload-prescription") ? "var(--color-primary)" : "var(--text-secondary)",
              fontWeight: isActive("/upload-prescription") ? 600 : 400,
              transition: "color var(--transition-fast)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <FileText size={16} />
            Upload Prescription
          </Link>
        </div>

        {/* Action Controls */}
        <div className="desktop-menu" style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          {/* Cart Icon */}
          <Link
            href="/checkout"
            style={{
              position: "relative",
              color: "var(--text-primary)",
              padding: "0.5rem",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all var(--transition-fast)",
            }}
            className="btn-secondary"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "var(--color-primary)",
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "9px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  boxShadow: "var(--shadow-glow)",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Trigger */}
          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link
                href="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                <LayoutDashboard size={18} style={{ color: "var(--color-primary)" }} />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-danger)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  fontSize: "0.95rem",
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              <User size={16} />
              Login / Register
            </Link>
          )}
        </div>

        {/* Mobile menu triggers */}
        <div className="mobile-toggle" style={{ display: "none" }}>
          {/* Cart Icon for Mobile */}
          <Link
            href="/checkout"
            style={{
              position: "relative",
              color: "var(--text-primary)",
              marginRight: "1rem",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "var(--color-primary)",
                  color: "white",
                  fontSize: "0.65rem",
                  fontWeight: "bold",
                  width: "16px",
                  height: "16px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMenu}
            style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "70px",
            left: 0,
            width: "100%",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            zIndex: 99,
          }}
        >
          <Link
            href="/"
            onClick={closeMenu}
            style={{
              color: isActive("/") ? "var(--color-primary)" : "var(--text-primary)",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={closeMenu}
            style={{
              color: isActive("/shop") ? "var(--color-primary)" : "var(--text-primary)",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            Shop Medicines
          </Link>
          <Link
            href="/upload-prescription"
            onClick={closeMenu}
            style={{
              color: isActive("/upload-prescription") ? "var(--color-primary)" : "var(--text-primary)",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            Upload Prescription
          </Link>
          <hr style={{ border: 0, borderTop: "1px solid var(--border-color)" }} />
          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                style={{
                  color: "var(--text-primary)",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <button
                onClick={() => {
                  closeMenu();
                  signOut({ callbackUrl: "/" });
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-danger)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1.1rem",
                  fontWeight: 500,
                  textAlign: "left",
                  padding: 0,
                }}
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={closeMenu}
              className="btn btn-primary"
              style={{ width: "100%", height: "44px" }}
            >
              Login / Register
            </Link>
          )}
        </div>
      )}

      {/* Desktop/Mobile display styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: flex !important;
            align-items: center;
          }
        }
      `}} />
    </nav>
  );
}
