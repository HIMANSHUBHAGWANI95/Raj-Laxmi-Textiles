import React from "react";
import Link from "next/link";
import { Instagram, Twitter, Youtube, Facebook, MapPin, Phone, Mail } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-info-col">
            <div className="footer-logo">
              <span className="footer-logo-spark">⚡ AB</span> FITNESS
            </div>
            <p className="footer-desc">
              Elite national gym network providing custom workout splits, goal tracking tools, and premium fitness environments across India.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/workouts" className="footer-link">Workouts</Link></li>
              <li><Link href="/locations" className="footer-link">Locations</Link></li>
              <li><Link href="/tips" className="footer-link">Safety & Tips</Link></li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="footer-col-title">Members</h4>
            <ul className="footer-links">
              <li><Link href="/login" className="footer-link">Login</Link></li>
              <li><Link href="/register" className="footer-link">Register</Link></li>
              <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
              <li><Link href="/dashboard/membership" className="footer-link">Gym Card</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="footer-col-title">Headquarters</h4>
            <div className="footer-contact-item">
              <MapPin size={18} style={{ flexShrink: 0 }} />
              <span>101, Prestige Towers, Bandra West, Mumbai, MH - 400050</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} style={{ flexShrink: 0 }} />
              <span>+91 98765 01000</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} style={{ flexShrink: 0 }} />
              <span>support@abfitness.in</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} AB Fitness Gym. All rights reserved.
          </span>
          <span className="footer-copy" style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Made for Fitness Excellence
          </span>
        </div>
      </div>
    </footer>
  );
}
