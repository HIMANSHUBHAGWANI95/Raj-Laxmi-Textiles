"use client";

import React from "react";
import { Star, MapPin } from "lucide-react";

interface LocationCardProps {
  imageUrl: string;
  name: string;
  city: string;
  state: string;
  rating: number;
  amenities: string[];
}

export default function LocationCard({ imageUrl, name, city, state, rating, amenities }: LocationCardProps) {
  return (
    <div className="card-glass" style={{ padding: "0", overflow: "hidden" }}>
      <div style={{ height: "200px", overflow: "hidden", position: "relative" }}>
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform var(--transition-normal)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            gap: "4px",
            background: "rgba(10, 10, 12, 0.75)",
            backdropFilter: "blur(6px)",
            padding: "4px 8px",
            borderRadius: "var(--radius-sm)",
            alignItems: "center",
          }}
        >
          <Star size={14} fill="#ffaa00" color="#ffaa00" />
          <span style={{ fontSize: "13px", fontWeight: "700" }}>{rating}</span>
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>{name}</h3>
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            color: "var(--text-secondary)",
            fontSize: "13px",
            marginBottom: "16px",
          }}
        >
          <MapPin size={14} />
          <span>
            {city}, {state}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
          {amenities.slice(0, 3).map((a, index) => (
            <span key={index} className="badge badge-secondary" style={{ fontSize: "10px", padding: "2px 8px" }}>
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
