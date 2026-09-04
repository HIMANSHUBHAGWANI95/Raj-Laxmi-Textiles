import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Facebook, Heart, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        color: "var(--text-secondary)",
        padding: "4rem 0 2rem 0",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          className="grid grid-4"
          style={{
            marginBottom: "3rem",
          }}
        >
          {/* Brand Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "white",
                fontFamily: "var(--font-title)",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  color: "white",
                }}
              >
                ✙
              </span>
              MediQuick
            </Link>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
              Licensed digital pharmacy bringing medications, safety check gates, and premium medical supplies straight to your doorstep.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <a href="#" className="social-icon" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="social-icon" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "white", marginBottom: "1.25rem", fontSize: "1.05rem" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/shop" className="footer-link">Shop Medicines</Link>
              <Link href="/upload-prescription" className="footer-link">Upload Prescription</Link>
              <Link href="/checkout" className="footer-link">View Cart</Link>
            </div>
          </div>

          {/* Support / Services */}
          <div>
            <h4 style={{ color: "white", marginBottom: "1.25rem", fontSize: "1.05rem" }}>Customer Services</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
              <Link href="/login" className="footer-link">My Account</Link>
              <Link href="/dashboard/orders" className="footer-link">Track Order</Link>
              <Link href="/dashboard/prescriptions" className="footer-link">Prescriptions list</Link>
              <a href="#" className="footer-link">FAQ & Help</a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: "white", marginBottom: "1.25rem", fontSize: "1.05rem" }}>Contact Us</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <MapPin size={18} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <span>100 Health Science Pkwy, Suite 400, NY</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Phone size={18} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <span>+1 (800) 555-0199</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Mail size={18} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                <span>support@mediquick.com</span>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--border-color)", marginBottom: "1.5rem" }} />

        {/* Legal Copyright */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.85rem",
          }}
        >
          <span>© {new Date().getFullYear()} MediQuick. All rights reserved. Registered Digital Pharmacy License.</span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Made with <Heart size={14} style={{ color: "var(--color-danger)" }} /> for healthy living.
          </span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-link:hover {
          color: var(--color-primary) !important;
        }
        .social-icon {
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }
        .social-icon:hover {
          color: var(--color-primary);
        }
      `}} />
    </footer>
  );
}
