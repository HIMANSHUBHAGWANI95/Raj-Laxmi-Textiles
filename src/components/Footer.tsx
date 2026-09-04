"use client";

import React from "react";
import Link from "next/link";
import { Utensils, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      padding: "60px 0 40px 0",
      borderTop: "1px solid var(--card-border)",
      background: "rgba(25, 20, 18, 0.4)",
      marginTop: "60px"
    }} className="text-muted">
      <div className="container">
        <div className="grid-responsive" style={{ marginBottom: "40px" }}>
          {/* Logo & Description Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
                letterSpacing: "-0.5px",
                color: "var(--foreground)"
              }}>
                Crave<span style={{ color: "var(--primary)" }}>Bite</span>
              </span>
            </div>
            <p style={{ fontSize: "14px", lineHeight: 1.6, maxWidth: "300px" }}>
              Cravings delivered fast! Satisfy your appetite with organic, fresh, and hot gourmet meals from your favorite local restaurants.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <a href="#" className="btn-ghost" aria-label="Instagram" style={{ padding: "8px", borderRadius: "50%", border: "1px solid var(--card-border)" }}>
                <Instagram size={18} />
              </a>
              <a href="#" className="btn-ghost" aria-label="Twitter" style={{ padding: "8px", borderRadius: "50%", border: "1px solid var(--card-border)" }}>
                <Twitter size={18} />
              </a>
              <a href="#" className="btn-ghost" aria-label="Facebook" style={{ padding: "8px", borderRadius: "50%", border: "1px solid var(--card-border)" }}>
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3 style={{ fontSize: "16px", color: "var(--foreground)", marginBottom: "8px" }}>Quick Links</h3>
            <Link href="/" style={{ fontSize: "14px" }} className="btn-ghost">Home</Link>
            <Link href="/restaurants" style={{ fontSize: "14px" }} className="btn-ghost">All Restaurants</Link>
            <Link href="/checkout" style={{ fontSize: "14px" }} className="btn-ghost">Checkout Page</Link>
            <Link href="/dashboard" style={{ fontSize: "14px" }} className="btn-ghost">Customer Dashboard</Link>
          </div>

          {/* Contacts Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", color: "var(--foreground)", marginBottom: "4px" }}>Contact Us</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <MapPin size={16} className="text-primary" />
              <span>124 Culinary Boulevard, Sector 4, Food City</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <Phone size={16} className="text-primary" />
              <span>+1 (800) CRAVE-BITE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
              <Mail size={16} className="text-primary" />
              <span>support@cravebite.com</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom copyright */}
        <div style={{
          textAlign: "center",
          borderTop: "1px solid var(--card-border)",
          paddingTop: "24px",
          fontSize: "13px"
        }}>
          &copy; {new Date().getFullYear()} CraveBite Inc. Premium Food Delivery App. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
