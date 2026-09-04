import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesGrid from "@/components/FeaturesGrid";
import PricingCards from "@/components/PricingCards";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { Award, ArrowRight } from "lucide-react";
import LocationCard from "@/components/LocationCard";
import Link from "next/link";

export const revalidate = 0; // Disable static cache for dynamic pricing checkout states

export default async function HomePage() {
  // Fetch active plans and top rated gym locations
  const plans = await db.plan.findMany({
    where: { active: true },
    orderBy: { price: "asc" }
  });

  const topLocations = await db.gymLocation.findMany({
    where: { active: true },
    take: 3,
    orderBy: { rating: "desc" }
  });

  return (
    <>
      <Navbar />
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesGrid />

      {/* Locations Preview Section */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="badge badge-secondary" style={{ marginBottom: "12px" }}>
              📍 25+ LOCATIONS NATIONWIDE
            </span>
            <h2 style={{ fontSize: "40px", marginBottom: "16px" }}>PREMIUM CLUB LOCATIONS</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Locate your nearest home club. Every club is equipped with elite trainers and high-end weights.
            </p>
          </div>

          <div className="grid-responsive" style={{ marginBottom: "40px" }}>
            {topLocations.map((loc) => {
              const amenities = JSON.parse(loc.amenities) as string[];
              return (
                <LocationCard
                  key={loc.id}
                  imageUrl={loc.imageUrl}
                  name={loc.name}
                  city={loc.city}
                  state={loc.state}
                  rating={loc.rating}
                  amenities={amenities}
                />
              );
            })}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link href="/locations" className="btn btn-secondary" style={{ display: "inline-flex", gap: "8px" }}>
              Explore All 25+ Gym Locations <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="section-padding" style={{ backgroundColor: "var(--bg-secondary)", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="badge badge-primary" style={{ marginBottom: "12px" }}>
              ⭐ MEMBER SUCCESS
            </span>
            <h2 style={{ fontSize: "40px", marginBottom: "16px" }}>CRUSHING GOALS</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Hear how our members utilize our All-India passes and tracking dashboards to transform.
            </p>
          </div>

          <div className="grid-responsive">
            <div className="card-glass" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontStyle: "italic", fontSize: "15px", lineHeight: "1.6", marginBottom: "20px" }}>
                "The digital workout logger completely changed the way I train. I can look back at what weight I lifted last week and ensure progressive overload. The interface is clean and super fast!"
              </p>
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "2px" }}>Rohan Sharma</h4>
                <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600" }}>Mumbai Club Member</span>
              </div>
            </div>

            <div className="card-glass" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontStyle: "italic", fontSize: "15px", lineHeight: "1.6", marginBottom: "20px" }}>
                "The Whitefield facility in Bangalore is world-class. Being a Gold Elite member, I travel between Pune and Bengaluru and check in seamlessly at any club with my QR mobile pass!"
              </p>
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "2px" }}>Sneha Kulkarni</h4>
                <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600" }}>Bengaluru Club Member</span>
              </div>
            </div>

            <div className="card-glass" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontStyle: "italic", fontSize: "15px", lineHeight: "1.6", marginBottom: "20px" }}>
                "I opted for the Platinum VIP plan. The 4 personal trainer sessions per month kept me accountable, and the custom nutrition charts helped me drop 8kgs of fat in 8 weeks!"
              </p>
              <div>
                <h4 style={{ fontSize: "16px", marginBottom: "2px" }}>Priya Nair</h4>
                <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600" }}>Pune VIP Member</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <PricingCards plans={plans} />

      <Footer />
    </>
  );
}
