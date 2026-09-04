"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, AlertCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  rxRequired: boolean;
  imageUrl: string | null;
  category?: {
    name: string;
  } | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      imageUrl: product.imageUrl,
      rxRequired: product.rxRequired,
    });
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="card-glass"
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        padding: "1.5rem",
        position: "relative",
      }}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            background: "rgba(16, 185, 129, 0.9)",
            color: "white",
            fontSize: "0.75rem",
            fontWeight: "bold",
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            zIndex: 3,
          }}
        >
          {discountPercent}% OFF
        </span>
      )}

      {/* Product Image */}
      <div
        style={{
          height: "160px",
          width: "100%",
          borderRadius: "0.5rem",
          overflow: "hidden",
          marginBottom: "1rem",
          position: "relative",
          background: "var(--bg-tertiary)",
        }}
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "var(--text-muted)",
            }}
          >
            💊
          </div>
        )}
      </div>

      {/* Category Name */}
      {product.category && (
        <span
          style={{
            color: "var(--color-primary)",
            fontSize: "0.8rem",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: "0.25rem",
          }}
        >
          {product.category.name}
        </span>
      )}

      {/* Title */}
      <h3
        className="title-sm"
        style={{
          color: "white",
          marginBottom: "0.5rem",
          fontSize: "1.1rem",
          fontWeight: 600,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.name}
      </h3>

      {/* Description */}
      <p
        className="text-muted"
        style={{
          fontSize: "0.85rem",
          marginBottom: "1rem",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          height: "2.6rem",
          lineHeight: "1.3",
        }}
      >
        {product.description}
      </p>

      {/* Rx Badge */}
      <div style={{ marginBottom: "1rem", height: "24px" }}>
        {product.rxRequired ? (
          <span className="badge badge-warning" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
            <AlertCircle size={12} />
            Rx Required
          </span>
        ) : (
          <span className="badge badge-success">OTC</span>
        )}
      </div>

      {/* Price and Add button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "white" }}>
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  textDecoration: "line-through",
                }}
              >
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              color: product.stock > 0 ? "var(--color-accent)" : "var(--color-danger)",
            }}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className="btn btn-primary"
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          disabled={product.stock <= 0}
          aria-label="Add to cart"
        >
          <ShoppingCart size={18} />
        </button>
      </div>
    </Link>
  );
}
