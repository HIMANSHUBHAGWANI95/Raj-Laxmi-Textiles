"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Star, Clock, ShoppingBag, Utensils, AlertCircle } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  imageUrl: string;
  available: boolean;
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
  restaurant: Restaurant;
}

export default function RestaurantDetailClient({ restaurant }: Props) {
  const { addToCart, cartItems } = useCart();
  const [showWarning, setShowWarning] = useState<string | null>(null);

  // Group items by category
  const categories = ["Starters", "Main Course", "Desserts", "Beverages"];
  
  const getCategorizedItems = (cat: string) => {
    return restaurant.menuItems.filter(
      (item) => item.category.toLowerCase() === cat.toLowerCase()
    );
  };

  const handleAddToCart = (item: MenuItem) => {
    // Check if cart has items from another restaurant
    if (cartItems.length > 0 && cartItems[0].restaurantId !== restaurant.id) {
      // Cart will be cleared. Let's show a user message / warn them
      const proceed = confirm(`Your cart has items from ${cartItems[0].restaurantName}. Adding this item will clear your previous selection. Proceed?`);
      if (!proceed) return;
    }
    
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  };

  return (
    <div>
      {/* Hero Header Cover Block */}
      <section style={{
        position: "relative",
        height: "320px",
        backgroundImage: `url(${restaurant.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "0 0 32px 32px",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(15, 13, 11, 0.3) 0%, rgba(15, 13, 11, 0.9) 100%)",
          zIndex: 1
        }} />

        <div className="container" style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "32px",
          color: "#f6ebd8"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            {restaurant.isPremium && <span className="badge badge-accent">PREMIUM KITCHEN</span>}
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(8px)",
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600
            }}>
              <Star size={14} fill="#fbbf24" color="#fbbf24" />
              <span>{restaurant.rating.toFixed(1)} Rating</span>
            </span>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(8px)",
              padding: "4px 8px",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 600
            }}>
              <Clock size={14} />
              <span>{restaurant.deliveryTime} Mins</span>
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
            {restaurant.name}
          </h1>
          <p className="text-muted" style={{ fontSize: "15px", marginBottom: "4px" }}>{restaurant.cuisine}</p>
          <p className="text-muted" style={{ fontSize: "13px" }}>{restaurant.address}</p>
        </div>
      </section>

      {/* Menu Sections Container */}
      <section className="container" style={{ padding: "60px 24px" }}>
        <div className="grid-responsive" style={{ gridTemplateColumns: "1fr", gap: "48px" }}>
          
          {categories.map((category) => {
            const items = getCategorizedItems(category);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h2 style={{
                  fontSize: "22px",
                  fontFamily: "var(--font-outfit)",
                  marginBottom: "24px",
                  borderBottom: "2px solid var(--card-border)",
                  paddingBottom: "8px"
                }}>
                  {category}
                </h2>

                <div className="grid-responsive grid-2">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="card-glass"
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "16px",
                        alignItems: "center",
                        height: "100%"
                      }}
                    >
                      {/* Menu Item Thumbnail */}
                      <div style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "var(--border-radius-sm)",
                        overflow: "hidden",
                        flexShrink: 0
                      }}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>

                      {/* Menu Item Content */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span className={`badge ${item.isVeg ? "badge-veg" : "badge-nonveg"}`}>
                              {item.isVeg ? "Veg" : "Non-Veg"}
                            </span>
                            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--foreground)" }}>
                              {item.name}
                            </h3>
                          </div>
                          <p className="text-muted" style={{ fontSize: "13px", lineHeight: 1.4, marginBottom: "8px" }}>
                            {item.description}
                          </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                          <span style={{ fontSize: "18px", fontWeight: 800, color: "var(--foreground)" }}>
                            ${item.price.toFixed(2)}
                          </span>
                          
                          {item.available ? (
                            <button 
                              onClick={() => handleAddToCart(item)}
                              className="btn btn-primary"
                              style={{ padding: "8px 14px", borderRadius: "10px", fontSize: "13px" }}
                            >
                              <ShoppingBag size={14} />
                              <span>Add</span>
                            </button>
                          ) : (
                            <span className="text-muted" style={{ fontSize: "13px", fontWeight: 600 }}>
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        </div>
      </section>
    </div>
  );
}
