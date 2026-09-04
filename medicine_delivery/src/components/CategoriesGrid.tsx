import React from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export default function CategoriesGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="section" style={{ background: "rgba(255,255,255,0.01)" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <h2
            className="title-lg"
            style={{
              marginBottom: "1rem",
              background: "linear-gradient(135deg, #ffffff 60%, var(--color-primary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Browse by Health Category
          </h2>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Select a specialized category to find the right clinical medications, daily supplements, or home monitoring devices.
          </p>
        </div>

        <div className="grid grid-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="card-glass"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem",
                textDecoration: "none",
                overflow: "hidden",
              }}
            >
              {category.imageUrl && (
                <div
                  style={{
                    height: "180px",
                    width: "100%",
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    marginBottom: "1.25rem",
                    position: "relative",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform var(--transition-normal)",
                    }}
                    className="cat-img"
                  />
                </div>
              )}
              <h3 className="title-sm" style={{ marginBottom: "0.5rem", color: "white" }}>
                {category.name}
              </h3>
              <p className="text-muted" style={{ fontSize: "0.9rem", flexGrow: 1, lineBreak: "anywhere" }}>
                {category.description}
              </p>
              <span
                style={{
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  marginTop: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                Explore Products →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .card-glass:hover .cat-img {
          transform: scale(1.06);
        }
      `}} />
    </section>
  );
}
