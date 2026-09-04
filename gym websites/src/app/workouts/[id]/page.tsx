import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Clock, Flame, BarChart, ArrowLeft, Play, AlertCircle } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600; // Cache for 1 hour

type Params = Promise<{ id: string }>;

interface PageProps {
  params: Params;
}

export default async function WorkoutDetailPage(props: PageProps) {
  const resolvedParams = await props.params;
  const { id } = resolvedParams;

  const workout = await db.workoutPlan.findUnique({
    where: { id },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: { exercise: true }
      }
    }
  });

  if (!workout) {
    notFound();
  }

  const getDifficultyClass = (diff: string) => {
    if (diff === "ADVANCED") return "badge-primary";
    if (diff === "INTERMEDIATE") return "badge-secondary";
    return "badge-success";
  };

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        {/* Back navigation */}
        <Link 
          href="/workouts" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            color: "var(--text-secondary)", 
            marginBottom: "32px",
            fontSize: "14px",
            fontWeight: "500" 
          }}
        >
          <ArrowLeft size={16} /> Back to Workout Library
        </Link>

        {/* Hero banner for workout details */}
        <div 
          className="card-glass" 
          style={{ 
            padding: "40px", 
            marginBottom: "40px",
            background: `linear-gradient(180deg, rgba(18, 18, 22, 0.8) 0%, rgba(10, 10, 12, 0.95) 100%), url(${workout.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}
        >
          <div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
              <span className="badge badge-primary">{workout.category}</span>
              <span className={`badge ${getDifficultyClass(workout.difficulty)}`}>
                {workout.difficulty}
              </span>
            </div>
            <h1 style={{ fontSize: "40px", fontWeight: "900", marginBottom: "12px", fontFamily: "var(--font-heading)" }}>
              {workout.name}
            </h1>
            <p style={{ color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.6", fontSize: "16px" }}>
              {workout.description}
            </p>
          </div>

          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", borderTop: "1px solid var(--border-color)", paddingTop: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                Estimated Duration
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
                {workout.duration} Minutes
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                Target Calories
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
                {workout.calories} Calories
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                Exercise Count
              </span>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "var(--text-primary)" }}>
                {workout.exercises.length} Movements
              </span>
            </div>
          </div>
        </div>

        {/* Exercises list mapping */}
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "24px", fontFamily: "var(--font-heading)" }}>
          ROUTINE WORKOUT EXERCISES
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {workout.exercises.map((item, index) => {
            const ex = item.exercise;
            const tips = JSON.parse(ex.tips) as string[];
            
            return (
              <div 
                key={item.id} 
                className="card-glass" 
                style={{ 
                  padding: "32px", 
                  background: "var(--bg-secondary)",
                  borderLeft: "4px solid var(--primary)",
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0"
                }}
              >
                {/* Exercise Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "4px" }}>
                      Exercise {index + 1} • {ex.muscleGroup}
                    </span>
                    <h3 style={{ fontSize: "22px", fontWeight: "800" }}>{ex.name}</h3>
                  </div>

                  <div style={{ display: "flex", gap: "16px", background: "var(--bg-primary)", padding: "10px 20px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Sets</span>
                      <span style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "16px" }}>{item.sets}</span>
                    </div>
                    <div style={{ width: "1px", backgroundColor: "var(--border-color)" }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Reps</span>
                      <span style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "16px" }}>{item.reps}</span>
                    </div>
                    <div style={{ width: "1px", backgroundColor: "var(--border-color)" }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" }}>Rest</span>
                      <span style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "16px" }}>{item.restSeconds}s</span>
                    </div>
                  </div>
                </div>

                {/* Instructions & Tips Split */}
                <div 
                  style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1.5fr 1fr", 
                    gap: "40px", 
                    borderTop: "1px solid var(--border-color)", 
                    paddingTop: "20px" 
                  }}
                  className="grid-responsive"
                >
                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Form Instructions:
                    </h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", whiteSpace: "pre-line", lineHeight: "1.6" }}>
                      {ex.instructions}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "13px", fontWeight: "700", color: "var(--secondary)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "4px" }}>
                      <AlertCircle size={14} /> Trainer Tips:
                    </h4>
                    <ul style={{ paddingLeft: "16px", fontSize: "13px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {tips.map((t, idx) => (
                        <li key={idx} style={{ lineHeight: "1.5" }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
