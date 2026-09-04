"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, User as UserIcon } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="nav-brand">
          <span className="nav-logo">⚡ AB</span> FITNESS
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation links */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            href="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/workouts"
            className={`nav-link ${isActive("/workouts") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Workouts
          </Link>
          <Link
            href="/locations"
            className={`nav-link ${isActive("/locations") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Locations
          </Link>
          <Link
            href="/tips"
            className={`nav-link ${isActive("/tips") ? "active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            Safety & Tips
          </Link>

          {/* Conditional links for dashboard */}
          {session ? (
            <>
              <Link
                href="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <div className="nav-actions">
                <span className="nav-user">
                  Hi, {session.user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsOpen(false);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ display: "inline-flex", gap: "6px" }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="nav-actions">
              <Link
                href="/login"
                className="btn btn-primary btn-sm"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
