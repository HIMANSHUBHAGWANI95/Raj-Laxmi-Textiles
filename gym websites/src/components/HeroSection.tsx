"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import "./HeroSection.css";

interface Particle {
  id: number;
  width: number;
  height: number;
  top: number;
  left: number;
  delay: string;
  duration: string;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate particle configuration client-side only to prevent React hydration mismatch
    const items: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      width: Math.random() * 80 + 40,
      height: Math.random() * 80 + 40,
      top: Math.random() * 80 + 10,
      left: Math.random() * 80 + 10,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setParticles(items);
  }, []);

  return (
    <section className="hero">
      {mounted && (
        <div className="hero-particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                width: `${p.width}px`,
                height: `${p.height}px`,
                top: `${p.top}%`,
                left: `${p.left}%`,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      )}

      <div className="container">
        <div className="hero-content">
          <div className="badge badge-primary" style={{ marginBottom: "20px" }}>
            🔥 NEXT-GEN FITNESS HAS ARRIVED
          </div>
          <h1 className="hero-title">
            UNLEASH YOUR <span className="text-gradient">ULTIMATE</span> POTENTIAL
          </h1>
          <p className="hero-description">
            AB Fitness is India's premium gym network featuring elite personal trainers, CrossFit arenas, steam sauna treatments, and all-India franchise access. Start tracking your metrics today.
          </p>
          <div className="hero-actions">
            <Link href="#pricing" className="btn btn-primary btn-lg">
              Start Training Now <ArrowRight size={18} />
            </Link>
            <Link href="/workouts" className="btn btn-secondary btn-lg">
              Explore Workouts <Play size={16} style={{ fill: "currentColor" }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
