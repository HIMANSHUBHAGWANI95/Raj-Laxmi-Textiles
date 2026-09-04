import React from "react";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import AddToCartSection from "@/components/AddToCartSection";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronLeft, ShieldCheck, RefreshCcw, AlertTriangle } from "lucide-react";

export const revalidate = 0; // Prevent stale caching for product detail views

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Await params as required by Next.js 15+
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
    },
  });

  if (!product) {
    return (
      <>
        <Navbar />
        <main style={{ flexGrow: 1, padding: "5rem 0" }}>
          <div className="container" style={{ display: "flex", justifyContent: "center" }}>
            <div className="card-glass" style={{ maxWidth: "500px", textAlign: "center" }}>
              <AlertTriangle size={48} style={{ color: "var(--color-danger)", marginBottom: "1rem" }} />
              <h1 className="title-sm" style={{ color: "white", marginBottom: "0.5rem" }}>
                Product Not Found
              </h1>
              <p className="text-muted" style={{ marginBottom: "1.5rem" }}>
                The medicine you are searching for does not exist or has been removed from our listings.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Return to Shop
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <>
      <Navbar />
      <main style={{ flexGrow: 1, padding: "3rem 0" }}>
        <div className="container">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/shop"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              marginBottom: "2rem",
              transition: "color var(--transition-fast)",
            }}
            className="footer-link"
          >
            <ChevronLeft size={18} />
            Back to Shop Catalog
          </Link>

          {/* Product Detail Layout */}
          <div
            className="detail-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
            }}
          >
            {/* Left Column: Image Box */}
            <div
              style={{
                position: "relative",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "1.5rem",
                overflow: "hidden",
                height: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {discountPercent > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    left: "1.5rem",
                    background: "var(--color-accent)",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "6px",
                    zIndex: 2,
                  }}
                >
                  SAVE {discountPercent}%
                </span>
              )}

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
                <span style={{ fontSize: "5rem" }}>💊</span>
              )}
            </div>

            {/* Right Column: Information & Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Category */}
              {product.category && (
                <span
                  style={{
                    color: "var(--color-primary)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {product.category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="title-md" style={{ color: "white", fontSize: "2.25rem", fontWeight: 700 }}>
                {product.name}
              </h1>

              {/* Prices block */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "white" }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span
                    style={{
                      fontSize: "1.25rem",
                      color: "var(--text-muted)",
                      textDecoration: "line-through",
                    }}
                  >
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div>
                <span
                  className={product.stock > 0 ? "badge badge-success" : "badge badge-danger"}
                  style={{ fontSize: "0.8rem", padding: "0.35rem 0.75rem" }}
                >
                  {product.stock > 0 ? `In Stock (${product.stock} units available)` : "Currently Out of Stock"}
                </span>
              </div>

              <hr style={{ border: 0, borderTop: "1px solid var(--border-color)", margin: "0.5rem 0" }} />

              {/* Product description */}
              <div>
                <h3 className="title-sm" style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  Description
                </h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.95rem" }}>
                  {product.description}
                </p>
              </div>

              {/* Add to Cart client controls */}
              <AddToCartSection product={product} />

              <hr style={{ border: 0, borderTop: "1px solid var(--border-color)", margin: "0.5rem 0" }} />

              {/* Product features / trust badges */}
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <ShieldCheck size={18} style={{ color: "var(--color-primary)" }} />
                  <span>100% Genuine Medicine</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                  <RefreshCcw size={18} style={{ color: "var(--color-primary)" }} />
                  <span>7-Day Return Policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive CSS for dynamic dynamic columns */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 800px) {
            .detail-grid {
              grid-template-columns: 1fr !important;
              gap: 2rem !important;
            }
          }
        `}} />
      </main>
      <Footer />
    </>
  );
}
