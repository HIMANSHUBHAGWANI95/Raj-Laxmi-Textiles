import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import Link from "next/link";
import { Clock, Flame, BarChart, ArrowRight } from "lucide-react";

export const revalidate = 3600; // Cache page for 1 hour

export default async function WorkoutsCatalogPage() {
  const plans = await db.workoutPlan.findMany({
    orderBy: { name: "asc" }
  });

  const getDifficultyClass = (diff: string) => {
    if (diff === "ADVANCED") return "badge-primary";
    if (diff === "INTERMEDIATE") return "badge-secondary";
    return "badge-success";
  };

  return (
    <>
      <Navbar />
      
      <div className="container" style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span className="badge badge-primary" style={{ marginBottom: "12px" }}>
            WORKOUT SPLITS
          </span>
          <h1 style={{ fontSize: "44px", fontWeight: "900", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
            ELITE TRAINING PROGRAMS
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "16px" }}>
            Select a custom workout plan designed to build lean muscle, increase compound lifts, or burn body fat.
          </p>
        </div>

        <div className="grid-responsive">
          {plans.map((w) => (
            <div 
              key={w.id} 
              className="card-glass" 
              style={{ 
                padding: "0", 
                overflow: "hidden", 
                display: "flex", 
                flexDirection: "column",
                height: "100%"
              }}
            >
              <div style={{ height: "220px", overflow: "hidden", position: "relative" }}>
                <img
                  src={w.imageUrl}
                  alt={w.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform var(--transition-normal)" }}
                />
                <div 
                  style={{ 
                    position: "absolute", 
                    top: "16px", 
                    right: "16px", 
                    background: "rgba(10, 10, 12, 0.75)", 
                    backdropFilter: "blur(6px)", 
                    padding: "4px 12px", 
                    borderRadius: "9999px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span className={`badge ${getDifficultyClass(w.difficulty)}`} style={{ fontSize: "10px", margin: 0, padding: 0, border: "none", background: "none" }}>
                    {w.difficulty}
                  </span>
                </div>
                {w.featured && (
                  <div 
                    style={{ 
                      position: "absolute", 
                      top: "16px", 
                      left: "16px", 
                      background: "var(--gradient-primary)", 
                      padding: "4px 12px", 
                      borderRadius: "9999px",
                      fontSize: "11px",
                      fontWeight: "700"
                    }}
                  >
                    ⭐ RECOMMENDED
                  </div>
                )}
              </div>

              <div style={{ padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "var(--primary)", letterSpacing: "0.05em", display: "block", marginBottom: "8px" }}>
                    {w.category}
                  </span>
                  <h3 style={{ fontSize: "24px", marginBottom: "12px", fontWeight: "800" }}>{w.name}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px", minHeight: "44px" }}>
                    {w.description}
                  </p>

                  <div style={{ display: "flex", gap: "24px", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "30px", borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)", padding: "14px 0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={16} color="var(--primary)" />
                      <span>{w.duration} mins</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Flame size={16} color="var(--secondary)" />
                      <span>{w.calories} kcal</span>
                    </div>
                  </div>
                </div>

                <Link 
                  href={`/workouts/${w.id}`} 
                  className="btn btn-secondary" 
                  style={{ display: "inline-flex", gap: "8px", width: "100%" }}
                >
                  View Full Routine <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}
