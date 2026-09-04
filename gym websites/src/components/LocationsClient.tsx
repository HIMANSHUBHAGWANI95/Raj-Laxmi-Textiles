"use client";

import React, { useState } from "react";
import { Search, MapPin, Phone, Mail, Clock, Star, Shield } from "lucide-react";

interface Location {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  amenities: string; // JSON string
  timings: string;
  rating: number;
  imageUrl: string;
}

interface LocationsClientProps {
  locations: Location[];
  cities: string[];
}

export default function LocationsClient({ locations, cities }: LocationsClientProps) {
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = locations.filter((loc) => {
    const matchesCity = selectedCity === "" || loc.city === selectedCity;
    const matchesSearch = 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <span className="badge badge-primary" style={{ marginBottom: "12px" }}>
          FIND FRANCHISE
        </span>
        <h1 style={{ fontSize: "44px", fontWeight: "900", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
          OUR CLUBS IN INDIA
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "16px" }}>
          Search by city or query our club directory to find the nearest AB Fitness location.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div 
        className="card-glass" 
        style={{ 
          display: "flex", 
          gap: "16px", 
          marginBottom: "40px", 
          alignItems: "center",
          flexWrap: "wrap",
          padding: "20px 24px"
        }}
      >
        <div style={{ flex: 1, position: "relative", minWidth: "260px" }}>
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} 
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, street, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "42px" }}
          />
        </div>
        
        <div style={{ minWidth: "200px" }}>
          <select
            className="form-input"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ 
              appearance: "none", 
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", 
              backgroundPosition: "right 12px center", 
              backgroundRepeat: "no-repeat" 
            }}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city} style={{ color: "black" }}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Locations Count */}
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px", fontWeight: "500" }}>
        Showing {filteredLocations.length} locations
      </p>

      {/* Locations Grid */}
      {filteredLocations.length === 0 ? (
        <div className="card-glass" style={{ textAlign: "center", padding: "60px 24px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>No Clubs Found</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            We couldn't find any gym locations matching your search inputs.
          </p>
        </div>
      ) : (
        <div className="grid-responsive">
          {filteredLocations.map((loc) => {
            const amenities = JSON.parse(loc.amenities) as string[];
            return (
              <div 
                key={loc.id} 
                className="card-glass" 
                style={{ 
                  padding: "0", 
                  overflow: "hidden", 
                  display: "flex", 
                  flexDirection: "column",
                  height: "100%"
                }}
              >
                <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={loc.imageUrl}
                    alt={loc.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div 
                    style={{ 
                      position: "absolute", 
                      top: "16px", 
                      right: "16px", 
                      background: "rgba(10, 10, 12, 0.75)", 
                      backdropFilter: "blur(6px)", 
                      padding: "4px 8px", 
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <Star size={14} fill="#ffaa00" color="#ffaa00" />
                    <span style={{ fontSize: "13px", fontWeight: "700" }}>{loc.rating}</span>
                  </div>
                </div>

                <div style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                  <div>
                    <h3 style={{ fontSize: "22px", marginBottom: "12px", fontWeight: "700" }}>{loc.name}</h3>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", marginBottom: "20px" }}>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", color: "var(--text-secondary)" }}>
                        <MapPin size={16} style={{ flexShrink: 0, marginTop: "2px", color: "var(--primary)" }} />
                        <span>{loc.address}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--text-secondary)" }}>
                        <Phone size={16} style={{ flexShrink: 0, color: "var(--primary)" }} />
                        <span>{loc.phone}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--text-secondary)" }}>
                        <Mail size={16} style={{ flexShrink: 0, color: "var(--primary)" }} />
                        <span style={{ fontSize: "13px" }}>{loc.email}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", color: "var(--text-secondary)" }}>
                        <Clock size={16} style={{ flexShrink: 0, marginTop: "2px", color: "var(--primary)" }} />
                        <span style={{ fontSize: "13px", lineHeight: "1.4" }}>{loc.timings}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {amenities.map((a, idx) => (
                        <span 
                          key={idx} 
                          className="badge badge-secondary" 
                          style={{ fontSize: "10px", padding: "2px 8px" }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
