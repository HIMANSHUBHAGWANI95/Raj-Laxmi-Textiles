"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, RotateCcw } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load initial states from URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [rxOnly, setRxOnly] = useState(searchParams.get("rxRequired") === "true");

  // Keep state in sync with URL changes (e.g. from navbar search)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSelectedCategory(searchParams.get("category") || "");
    setRxOnly(searchParams.get("rxRequired") === "true");
  }, [searchParams]);

  const applyFilters = (updates: { search?: string; category?: string; rxRequired?: boolean }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Process search
    const newSearch = updates.search !== undefined ? updates.search : search;
    if (newSearch) {
      params.set("search", newSearch);
    } else {
      params.delete("search");
    }

    // Process category
    const newCat = updates.category !== undefined ? updates.category : selectedCategory;
    if (newCat) {
      params.set("category", newCat);
    } else {
      params.delete("category");
    }

    // Process Rx Required
    const newRx = updates.rxRequired !== undefined ? updates.rxRequired : rxOnly;
    if (newRx) {
      params.set("rxRequired", "true");
    } else {
      params.delete("rxRequired");
    }

    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ search });
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    applyFilters({ category: slug });
  };

  const handleRxToggle = (checked: boolean) => {
    setRxOnly(checked);
    applyFilters({ rxRequired: checked });
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    setRxOnly(false);
    router.push("/shop");
  };

  return (
    <div
      className="card-glass"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        height: "fit-content",
        position: "sticky",
        top: "90px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 className="title-sm" style={{ color: "white", fontSize: "1.1rem" }}>Filters</h3>
        <button
          onClick={handleReset}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-primary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.85rem",
            fontWeight: 500,
          }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearchSubmit} className="input-group">
        <label className="input-label">Search Medicines</label>
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
            style={{ paddingRight: "2.5rem" }}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Category selector */}
      <div className="input-group">
        <label className="input-label">Category</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button
            onClick={() => handleCategoryChange("")}
            style={{
              textAlign: "left",
              padding: "0.5rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid transparent",
              background: selectedCategory === "" ? "rgba(14, 165, 233, 0.15)" : "transparent",
              color: selectedCategory === "" ? "var(--color-primary)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: selectedCategory === "" ? 600 : 400,
              transition: "all var(--transition-fast)",
            }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              style={{
                textAlign: "left",
                padding: "0.5rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid transparent",
                background: selectedCategory === cat.slug ? "rgba(14, 165, 233, 0.15)" : "transparent",
                color: selectedCategory === cat.slug ? "var(--color-primary)" : "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: selectedCategory === cat.slug ? 600 : 400,
                transition: "all var(--transition-fast)",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rx filter toggle */}
      <div className="input-group">
        <label className="input-label">Prescription Check</label>
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={rxOnly}
            onChange={(e) => handleRxToggle(e.target.checked)}
            className="checkbox-input"
          />
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
            Rx Prescription Required
          </span>
        </label>
      </div>
    </div>
  );
}
