"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, ShieldCheck, Star, Sparkles } from "lucide-react";

// Defer particle coordinates generation using useEffect to prevent React hydration mismatches
interface Particle {
  id: number;
  emoji: string;
  className: string;
}

const FOOD_EMOJIS = ["🍕", "🍔", "🍣", "🥗", "🍰", "🍩", "🌮", "🥤"];

export default function HeroSection() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate particles coordinates on client side only
    const generated: Particle[] = Array.from({ length: 8 }).map((_, index) => ({
      id: index,
      emoji: FOOD_EMOJIS[index % FOOD_EMOJIS.length],
      className: `doodle-bg doodle-${index + 1}`
    }));
    setParticles(generated);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/restaurants");
    }
  };

  return (
    <section style={{ padding: "60px 0 80px 0", position: "relative", overflow: "hidden" }}>
      {/* Hydration safe client-rendered floating doodles */}
      {mounted && particles.map((p) => (
        <div 
          key={p.id} 
          className={`${p.className} animate-float`}
          style={{ fontSize: "28px", opacity: 0.12, animationDelay: `${p.id * 0.5}s` }}
        >
          {p.emoji}
        </div>
      ))}

      <div className="container text-center" style={{ position: "relative", zIndex: 1 }}>
        {/* Deal Badge */}
        <div className="badge badge-accent animate-pulse-subtle" style={{ marginBottom: "24px" }}>
          <Sparkles size={12} />
          <span>50% OFF YOUR FIRST ORDER</span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(2.5rem, 6.5vw, 4.8rem)",
          lineHeight: 1.1,
          maxWidth: "850px",
          margin: "0 auto 24px auto",
          letterSpacing: "-1.5px",
          fontFamily: "var(--font-outfit)",
          fontWeight: 800
        }}>
          Cravings <span style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>Delivered Fast</span> to Your Door!
        </h1>

        {/* Tagline */}
        <p className="text-muted" style={{
          fontSize: "clamp(16px, 2.5vw, 19px)",
          maxWidth: "600px",
          margin: "0 auto 40px auto",
          lineHeight: 1.6,
          fontWeight: 400
        }}>
          Satisfy your appetite with organic, fresh, and piping hot gourmet meals from your favorite local eateries.
        </p>

        {/* Search Form */}
        <form 
          onSubmit={handleSearchSubmit}
          style={{
            maxWidth: "600px",
            margin: "0 auto 48px auto",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center"
          }}
        >
          <input 
            type="text" 
            placeholder="Search by restaurant or cuisine (e.g. Pizza, Sushi, Indian)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-premium" 
            style={{ flex: 1, minWidth: "280px" }}
          />
          <button type="submit" className="btn btn-primary btn-lg">
            <span>Find Food</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Quality Badges Row */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "32px",
          flexWrap: "wrap",
          borderTop: "1px solid var(--card-border)",
          paddingTop: "32px",
          maxWidth: "700px",
          margin: "0 auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock className="text-primary" size={20} />
            <span style={{ fontWeight: 600, fontSize: "14px" }}>30 Min Delivery</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck style={{ color: "var(--secondary)" }} size={20} />
            <span style={{ fontWeight: 600, fontSize: "14px" }}>100% Quality Assurance</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Star style={{ color: "#fbbf24" }} size={20} />
            <span style={{ fontWeight: 600, fontSize: "14px" }}>4.9/5 Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  );
}
