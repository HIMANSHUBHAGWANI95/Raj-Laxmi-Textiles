import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CuisineCarousel from "@/components/CuisineCarousel";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Star, Clock, ArrowRight } from "lucide-react";

export default async function Home() {
  const popularRestaurants = await db.restaurant.findMany({
    orderBy: { rating: "desc" },
    take: 6,
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative" }}>
      
      {/* Sticky Top Header Navigation */}
      <Navbar />

      {/* Main Pages Content */}
      <main style={{ flex: 1, zIndex: 1 }}>
        {/* Dynamic welcome hero section */}
        <HeroSection />

        {/* Cuisine categories selector */}
        <CuisineCarousel />

        {/* Dynamic Database-backed Restaurants Grid */}
        <section style={{ padding: "60px 0", backgroundColor: "rgba(25, 20, 18, 0.3)", borderRadius: "32px 32px 0 0" }}>
          <div className="container">
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "36px"
            }}>
              <div>
                <h2 style={{ fontSize: "28px", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
                  Popular Restaurants Near You
                </h2>
                <p className="text-muted" style={{ fontSize: "14px" }}>
                  Order from the highest-rated gourmet kitchens in your neighborhood.
                </p>
              </div>
              <Link 
                href="/restaurants" 
                style={{ 
                  fontSize: "15px", 
                  fontWeight: 600, 
                  color: "var(--primary)", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px" 
                }} 
                className="btn-ghost"
              >
                <span>View All Restaurants</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid-responsive grid-3">
              {popularRestaurants.map((restaurant) => (
                <Link 
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.slug}`}
                  className="card-glass card-glow"
                  style={{ display: "flex", flexDirection: "column", height: "100%" }}
                >
                  {/* COVER IMAGE */}
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

                  {/* DETAILS */}
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
          </div>
        </section>
      </main>

      {/* Global Page Footer */}
      <Footer />
    </div>
  );
}
