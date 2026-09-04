"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, AlertCircle, Check, Info } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  stock: number;
  rxRequired: boolean;
  imageUrl: string | null;
}

export default function AddToCartSection({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAdd = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        imageUrl: product.imageUrl,
        rxRequired: product.rxRequired,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Rx Warn block */}
      {product.rxRequired && (
        <div className="alert alert-warning" style={{ margin: "0.5rem 0" }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>Prescription Required</strong>
            <span style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
              This is a restricted medicine. You must upload a valid digital prescription at the dashboard or checkout to receive this delivery.
            </span>
          </div>
        </div>
      )}

      {/* Action controls */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        {/* Quantity selector */}
        {product.stock > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.02)",
              padding: "0.25rem",
              height: "48px",
            }}
          >
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              style={{
                width: "36px",
                height: "36px",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              -
            </button>
            <span style={{ width: "40px", textAlign: "center", fontWeight: "bold" }}>{quantity}</span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              style={{
                width: "36px",
                height: "36px",
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              +
            </button>
          </div>
        )}

        {/* Add button */}
        <button
          onClick={handleAdd}
          className="btn btn-primary"
          style={{
            flexGrow: 1,
            height: "48px",
            fontSize: "1.05rem",
            minWidth: "200px",
          }}
          disabled={product.stock <= 0}
        >
          {added ? (
            <>
              <Check size={20} />
              Added to Cart!
            </>
          ) : product.stock > 0 ? (
            <>
              <ShoppingCart size={20} />
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>

      {/* Extra info details */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          background: "rgba(255,255,255,0.02)",
          padding: "0.75rem 1rem",
          borderRadius: "8px",
        }}
      >
        <Info size={16} style={{ color: "var(--color-primary)" }} />
        <span>Free express delivery on orders totaling $50 or more.</span>
      </div>
    </div>
  );
}
