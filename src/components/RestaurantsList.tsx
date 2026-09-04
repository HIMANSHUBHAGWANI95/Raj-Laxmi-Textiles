"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, Clock, Search, ArrowUpDown, Filter, Sparkles } from "lucide-react";

interface MenuItem {
  id: string;
  isVeg: boolean;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating: number;
  cuisine: string;
  coverImage: string;
  deliveryTime: number;
  isPremium: boolean;
  menuItems: MenuItem[];
}

interface Props {
  initialRestaurants: Restaurant[];
}

export default function RestaurantsList({ initialRestaurants }: Props) {
  const searchParams = useSearchParams();
  
  // State from URL or defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get("cuisine") || "");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "deliveryTime" | "default">("default");

  // Sync state if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
    setSelectedCuisine(searchParams.get("cuisine") || "");
  }, [searchParams]);

  // Filter & Sort Logic
  const filteredRestaurants = initialRestaurants
    .filter((restaurant) => {
      // 1. Search Query filter (matches restaurant name or cuisine text)
      const matchesSearch = 
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Cuisine filter
      const matchesCuisine = 
        !selectedCuisine || 
        restaurant.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase()) ||
        restaurant.slug.includes(selectedCuisine.toLowerCase());

      // 3. Veg Only filter (displays restaurants offering veg items)
      const hasVegItems = restaurant.menuItems.some((item) => item.isVeg === true);
      const matchesVeg = !vegOnly || hasVegItems;

      return matchesSearch && matchesCuisine && matchesVeg;
    })
    .sort((a, b) => {
      // 4. Sort logic
      if (sortBy === "rating") {
        return b.rating - a.rating; // Descending ratings
      }
      if (sortBy === "deliveryTime") {
        return a.deliveryTime - b.deliveryTime; // Ascending delivery times
      }
      return 0; // Default
    });

  // Extract unique cuisines list for select options
  const allCuisines = Array.from(
    new Set(
      initialRestaurants
        .flatMap((r) => r.cuisine.split(","))
        .map((c) => c.trim())
    )
  );

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      {/* Page Header */}
      <div style={{ marginBottom: "36px" }}>
        <h1 style={{ fontSize: "36px", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
          All Restaurants
        </h1>
        <p className="text-muted">
          Browse, filter, and order from the best dining spots near you.
        </p>
      </div>

      {/* Filter Options Bar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        marginBottom: "40px",
        padding: "20px",
        borderRadius: "var(--border-radius-md)",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        alignItems: "center"
      }}>
        {/* Search */}
        <div style={{ flex: "1 1 280px", position: "relative" }}>
          <span style={{
            position: "absolute",
            left: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
            display: "flex",
            alignItems: "center"
          }}>
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search restaurants by name or cuisine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-premium"
            style={{ paddingLeft: "42px" }}
          />
        </div>

        {/* Cuisine Filter Select */}
        <div style={{ flex: "0 1 180px", position: "relative" }}>
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="input-premium"
            style={{ paddingRight: "36px" }}
          >
            <option value="">All Cuisines</option>
            {allCuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine.toLowerCase()}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Sort select */}
        <div style={{ flex: "0 1 180px", position: "relative" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="input-premium"
            style={{ paddingRight: "36px" }}
          >
            <option value="default">Default Sort</option>
            <option value="rating">Highest Rated</option>
            <option value="deliveryTime">Fastest Delivery</option>
          </select>
        </div>

        {/* Veg Only Checkbox */}
        <label style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          userSelect: "none",
          fontWeight: 600,
          fontSize: "14px",
          color: "var(--foreground)"
        }}>
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
            style={{
              width: "18px",
              height: "18px",
              accentColor: "var(--secondary)",
              cursor: "pointer"
            }}
          />
          <span>Veg-Only Options</span>
        </label>
      </div>

      {/* Grid List Output */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid-responsive grid-3">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.slug}`}
              className="card-glass card-glow"
              style={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <div style={{
                position: "relative",
                height: "180px",
                borderRadius: "var(--border-radius-md)",
                overflow: "hidden",
                marginBottom: "16px"
              }}>
                <img
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {restaurant.isPremium && (
                  <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                    <span className="badge badge-accent">PREMIUM</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "19px", fontFamily: "var(--font-outfit)", color: "var(--foreground)" }}>
                    {restaurant.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Star size={16} fill="#fbbf24" color="#fbbf24" style={{ flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--foreground)" }}>
                      {restaurant.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <p className="text-muted" style={{ fontSize: "13px", marginBottom: "16px", flex: 1, lineHeight: 1.4 }}>
                  {restaurant.cuisine}
                </p>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px solid var(--card-border)",
                  paddingTop: "12px",
                  marginTop: "auto"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }} className="text-muted">
                    <Clock size={16} />
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>{restaurant.deliveryTime} mins</span>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)" }}>
                    Order Now &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card-glass text-center" style={{ padding: "60px 40px" }}>
          <Sparkles size={48} className="text-primary" style={{ margin: "0 auto 16px auto" }} />
          <h2 style={{ fontSize: "22px", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
            No Restaurants Found
          </h2>
          <p className="text-muted" style={{ fontSize: "14px", maxWidth: "400px", margin: "0 auto" }}>
            We couldn't find any restaurants matching your query. Try clearing your filters or search keywords.
          </p>
        </div>
      )}
    </div>
  );
}
