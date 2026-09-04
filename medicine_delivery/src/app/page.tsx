import React from "react";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoriesGrid from "@/components/CategoriesGrid";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { ShieldCheck, Truck, FileText, CheckCircle2 } from "lucide-react";

export const revalidate = 0; // Prevent stale caching for landing page during sandbox test cycles

export default async function LandingPage() {
  // Fetch categories and featured products from the database
  const categories = await db.category.findMany();
  const featuredProducts = await db.product.findMany({
    take: 8,
    include: {
      category: true,
    },
  });

  return (
    <>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <HeroSection />

        {/* Trust Badges */}
        <section
          style={{
            background: "var(--bg-secondary)",
            padding: "3rem 0",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="container">
            <div
              className="grid grid-4"
              style={{
                textAlign: "center",
                gap: "2rem",
              }}
            >
              {/* Badge 1 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(14, 165, 233, 0.1)",
                    padding: "1rem",
                    borderRadius: "50%",
                    color: "var(--color-primary)",
                  }}
                >
                  <ShieldCheck size={32} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "white" }}>100% Genuine Pharmacy</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Sourced from FDA approved manufacturers & HIPAA compliant storage.
                </p>
              </div>

              {/* Badge 2 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "1rem",
                    borderRadius: "50%",
                    color: "var(--color-accent)",
                  }}
                >
                  <Truck size={32} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "white" }}>30 Mins Express Delivery</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Track your critical medical deliveries in real-time.
                </p>
              </div>

              {/* Badge 3 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.1)",
                    padding: "1rem",
                    borderRadius: "50%",
                    color: "var(--color-warning)",
                  }}
                >
                  <FileText size={32} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "white" }}>Fast Rx Verification</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Our registered pharmacists review and approve prescriptions within 15 minutes.
                </p>
              </div>

              {/* Badge 4 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.1)",
                    padding: "1rem",
                    borderRadius: "50%",
                    color: "var(--color-accent)",
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "white" }}>Sandbox Testing Enabled</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  Signature bypass for simulated sandbox payments without real keys.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <CategoriesGrid categories={categories} />

        {/* Featured Products */}
        <section className="section" style={{ background: "rgba(6, 11, 19, 0.5)" }}>
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
                Featured Medicines & Supplies
              </h2>
              <p className="text-muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
                Top-rated health supplements, home monitoring tools, and daily clinical treatments.
              </p>
            </div>

            <div className="grid grid-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
