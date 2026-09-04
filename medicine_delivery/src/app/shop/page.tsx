import React from "react";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import ShopFilters from "@/components/ShopFilters";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

export const revalidate = 0; // Disable caching to fetch updated stock or query adjustments

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    rxRequired?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Await searchParams as required by Next.js 15+
  const resolvedParams = await searchParams;
  const search = resolvedParams.search;
  const categorySlug = resolvedParams.category;
  const rxRequired = resolvedParams.rxRequired;

  // Construct filters
  const whereClause: any = {};

  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (search) {
    whereClause.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (rxRequired === "true") {
    whereClause.rxRequired = true;
  }

  // Fetch data
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const products = await db.product.findMany({
    where: whereClause,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <Navbar />
      <main style={{ flexGrow: 1, padding: "3rem 0" }}>
        <div className="container">
          <div style={{ marginBottom: "2.5rem" }}>
            <h1
              className="title-lg"
              style={{
                marginBottom: "0.5rem",
                background: "linear-gradient(135deg, #ffffff 60%, var(--color-primary) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Shop Medicines & Supplies
            </h1>
            <p className="text-muted">
              Search and filter through our inventory of genuine prescription and over-the-counter medical supplies.
            </p>
          </div>

          <div
            className="shop-layout"
            style={{
              display: "grid",
              gridTemplateColumns: "280px 1fr",
              gap: "2rem",
            }}
          >
            {/* Sidebar Filters */}
            <ShopFilters categories={categories} />

            {/* Products Grid */}
            <div>
              {products.length === 0 ? (
                <div
                  className="card-glass"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "5rem 2rem",
                    textAlign: "center",
                  }}
                >
                  <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</span>
                  <h3 className="title-sm" style={{ color: "white", marginBottom: "0.5rem" }}>
                    No Products Found
                  </h3>
                  <p className="text-muted" style={{ maxWidth: "400px" }}>
                    We couldn&apos;t find any products matching your current filters. Try resetting the filters or using different keywords.
                  </p>
                </div>
              ) : (
                <div className="grid grid-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Responsive shop view CSS styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 900px) {
            .shop-layout {
              grid-template-columns: 1fr !important;
            }
          }
        `}} />
      </main>
      <Footer />
    </>
  );
}
