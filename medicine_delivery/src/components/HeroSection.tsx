"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Shield, Clock, Award } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);

  // Defer randomized particle generation to post-mount to avoid hydration mismatch
  useEffect(() => {
    const list = Array.from({ length: 8 }).map((_, idx) => ({
      id: idx,
      x: Math.floor(Math.random() * 90) + 5, // percentage
      y: Math.floor(Math.random() * 70) + 15, // percentage
      size: Math.floor(Math.random() * 16) + 12, // px
      duration: Math.floor(Math.random() * 10) + 12, // seconds
      delay: Math.floor(Math.random() * 5), // seconds
    }));
    setParticles(list);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        padding: "8rem 0 6rem 0",
        background: "radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.08) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(13, 148, 136, 0.05) 0%, transparent 50%)",
        borderBottom: "1px solid var(--border-color)",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Hydration-Safe Floating Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            color: "rgba(14, 165, 233, 0.15)",
            pointerEvents: "none",
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          ✙
        </span>
      ))}

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          {/* Badge */}
          <div
            className="badge badge-info"
            style={{
              marginBottom: "1.5rem",
              padding: "0.4rem 1rem",
              letterSpacing: "0.05em",
              fontSize: "0.8rem",
            }}
          >
            ⚡ Express 30-Minute Pharmacy Delivery
          </div>

          {/* Heading */}
          <h1
            className="title-xl"
            style={{
              maxWidth: "800px",
              marginBottom: "1.5rem",
            }}
          >
            Your Health, <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Delivered Fast & Secure
            </span>
          </h1>

          {/* Tagline */}
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.2rem",
              maxWidth: "600px",
              marginBottom: "3rem",
              lineHeight: 1.6,
            }}
          >
            Order genuine prescription medicines, OTC remedies, wellness supplements, and health devices instantly. Safe signature check for restricted drugs.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "50px",
              padding: "0.5rem 0.5rem 0.5rem 1.5rem",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "var(--shadow-lg), var(--shadow-glow)",
              marginBottom: "3rem",
              position: "relative",
            }}
          >
            <Search size={20} style={{ color: "var(--text-secondary)", marginRight: "0.75rem" }} />
            <input
              type="text"
              placeholder="Search for medicines, vitamins, tablets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "1.05rem",
                width: "100%",
                paddingRight: "1rem",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                borderRadius: "50px",
                padding: "0.6rem 1.5rem",
                fontSize: "0.95rem",
              }}
            >
              Search
            </button>
          </form>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Order Medicines Now
            </Link>
            <Link href="/upload-prescription" className="btn btn-secondary btn-lg">
              Upload Prescription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
