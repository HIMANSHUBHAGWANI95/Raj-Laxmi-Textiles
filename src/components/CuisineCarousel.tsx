"use client";

import React from "react";
import Link from "next/link";
import { Pizza, Star, Coffee, Soup, Sparkles, ChefHat, Flame, Heart } from "lucide-react";

interface Cuisine {
  name: string;
  slug: string;
  icon: React.ReactNode;
  color: string;
}

const CUISINES: Cuisine[] = [
  { name: "Pizza", slug: "pizza", icon: <Pizza size={24} />, color: "rgba(242, 95, 56, 0.15)" },
  { name: "Sushi", slug: "sushi", icon: <Star size={24} />, color: "rgba(52, 211, 153, 0.15)" },
  { name: "Burgers", slug: "burger", icon: <Flame size={24} />, color: "rgba(248, 113, 113, 0.15)" },
  { name: "Indian", slug: "indian", icon: <ChefHat size={24} />, color: "rgba(251, 191, 36, 0.15)" },
  { name: "Chinese", slug: "chinese", icon: <Soup size={24} />, color: "rgba(96, 165, 250, 0.15)" },
  { name: "Mexican", slug: "mexican", icon: <Sparkles size={24} />, color: "rgba(167, 139, 250, 0.15)" },
  { name: "Healthy", slug: "healthy", icon: <Coffee size={24} />, color: "rgba(52, 211, 153, 0.15)" },
  { name: "Desserts", slug: "desserts", icon: <Heart size={24} />, color: "rgba(244, 114, 182, 0.15)" }
];

export default function CuisineCarousel() {
  return (
    <section style={{ padding: "40px 0", width: "100%" }}>
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontFamily: "var(--font-outfit)" }}>
            Browse by Cuisine
          </h2>
          <span style={{ fontSize: "14px", color: "var(--primary)", fontWeight: 600 }}>
            Scroll to explore &rarr;
          </span>
        </div>

        {/* Scrollable Row */}
        <div style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
          paddingBottom: "12px",
          scrollbarWidth: "none", // Firefox
          WebkitOverflowScrolling: "touch",
        }} className="cuisine-carousel">
          {CUISINES.map((cuisine) => (
            <Link 
              key={cuisine.slug}
              href={`/restaurants?cuisine=${cuisine.slug}`}
              className="card-glass"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                minWidth: "120px",
                width: "120px",
                padding: "20px 10px",
                borderRadius: "var(--border-radius-md)",
                border: "1px solid var(--card-border)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center"
              }}
            >
              <div style={{
                background: cuisine.color,
                color: "var(--foreground)",
                padding: "12px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {cuisine.icon}
              </div>
              <span style={{
                fontFamily: "var(--font-outfit)",
                fontSize: "14px",
                fontWeight: 600
              }}>
                {cuisine.name}
              </span>
            </Link>
          ))}
        </div>
        
        {/* Style tag to hide scrollbars */}
        <style jsx global>{`
          .cuisine-carousel::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}
