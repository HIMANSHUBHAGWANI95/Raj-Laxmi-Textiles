import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  CreditCard, 
  Target, 
  History, 
  TrendingUp, 
  PlusCircle, 
  MapPin, 
  Compass,
  ArrowRight
} from "lucide-react";

export const revalidate = 0; // Disable static cache for live counts

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // 1. Fetch active membership
  const membership = await db.membership.findFirst({
    where: { userId, status: "ACTIVE" },
    include: { plan: true }
  });

  // 2. Fetch active goals count
  const activeGoalsCount = await db.fitnessGoal.count({
    where: { userId, status: "ACTIVE" }
  });

  // 3. Fetch workout logs count
  const totalWorkoutsCount = await db.workoutLog.count({
    where: { userId }
  });

  // 4. Fetch recent logs
  const recentLogs = await db.workoutLog.findMany({
    where: { userId },
    take: 4,
    orderBy: { date: "desc" },
    include: { exercise: true }
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div>
      {/* Header */}
      <div className="db-header">
        <div className="db-title-section">
          <span className="db-subtitle">Workspace Overview</span>
          <h1 className="db-title">{getGreeting()}, {session.user.name?.split(" ")[0]}!</h1>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard/log" className="btn btn-primary btn-sm" style={{ display: "inline-flex", gap: "6px" }}>
            <PlusCircle size={14} /> Log Workout
          </Link>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="db-welcome-banner">
        <h2 className="db-welcome-title">Track. Train. Conquer.</h2>
        <p className="db-welcome-desc">
          Welcome to your AB Fitness member dashboard. Access all 25+ locations across India, monitor your metrics, and reach your goals. Log a workout split or create a new body metric goal to get started!
        </p>
      </div>

      {/* Summary Grid */}
      <div className="db-summary-grid">
        <div className="db-summary-card">
          <span className="db-summary-lbl" style={{ color: "var(--primary)" }}>Membership</span>
          <div className="db-summary-val" style={{ fontSize: "22px", marginTop: "4px" }}>
            {membership ? membership.plan.name : "No Active Plan"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <CreditCard size={12} />
            <span>{membership ? `Card: ${membership.cardNumber}` : "Subscribe to start"}</span>
          </div>
        </div>

        <div className="db-summary-card">
          <span className="db-summary-lbl" style={{ color: "var(--secondary)" }}>Active Goals</span>
          <div className="db-summary-val">{activeGoalsCount}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Target size={12} />
            <span>Milestones set</span>
          </div>
        </div>

        <div className="db-summary-card">
          <span className="db-summary-lbl" style={{ color: "var(--accent-cyan)" }}>Workouts Logged</span>
          <div className="db-summary-val">{totalWorkoutsCount}</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <History size={12} />
            <span>Total gym sessions</span>
          </div>
        </div>

        <div className="db-summary-card">
          <span className="db-summary-lbl" style={{ color: "var(--accent-purple)" }}>Locations</span>
          <div className="db-summary-val" style={{ fontSize: "22px", marginTop: "4px" }}>
            {membership ? "All India Pass" : "Restricted"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
            <MapPin size={12} />
            <span>{(session.user as any).city || "India"} franchise access</span>
          </div>
        </div>
      </div>

      {/* Main split sections */}
      <div className="db-content-split">
        {/* Recent Workouts Logged */}
        <div className="card-glass" style={{ height: "fit-content" }}>
          <h3 className="db-section-title">
            <History size={18} color="var(--primary)" /> Recent Workouts
          </h3>
          
          {recentLogs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "14px" }}>
                You haven't logged any workouts yet.
              </p>
              <Link href="/dashboard/log" className="btn btn-secondary btn-sm">
                Log Your First Exercise
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {recentLogs.map((log) => (
                <div key={log.id} className="db-list-item">
                  <div className="db-list-main">
                    <span className="db-list-title">{log.exercise.name}</span>
                    <span className="db-list-subtitle">
                      {log.sets} sets &times; {log.reps} reps | {log.weight} kg
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-primary)" }}>
                      {log.duration} mins
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {new Date(log.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short"
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <Link href="/dashboard/log" style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  View All Logs <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card-glass">
            <h3 className="db-section-title" style={{ fontSize: "17px", marginBottom: "16px" }}>
              <Compass size={16} color="var(--primary)" /> Fast Tracks
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/dashboard/membership" className="btn btn-secondary btn-sm" style={{ justifyContent: "flex-start", fontSize: "14px" }}>
                🎫 View digital gym card
              </Link>
              <Link href="/dashboard/goals" className="btn btn-secondary btn-sm" style={{ justifyContent: "flex-start", fontSize: "14px" }}>
                🎯 Set fitness milestone
              </Link>
              <Link href="/dashboard/progress" className="btn btn-secondary btn-sm" style={{ justifyContent: "flex-start", fontSize: "14px" }}>
                📈 Track body weight trends
              </Link>
              <Link href="/locations" className="btn btn-secondary btn-sm" style={{ justifyContent: "flex-start", fontSize: "14px" }}>
                🔍 Find franchise locations
              </Link>
            </div>
          </div>

          <div className="card-glass" style={{ background: "linear-gradient(135deg, rgba(255, 136, 0, 0.08) 0%, rgba(18,18,22,0.9) 100%)", border: "1px solid rgba(255, 136, 0, 0.15)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "8px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
              <TrendingUp size={16} color="var(--secondary)" /> Daily Fitness Quote
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              "The iron never lies to you. You can walk outside and listen to all kinds of talk, get told that you're a god or a total bastard... but 200 pounds is always 200 pounds."
            </p>
            <div style={{ fontSize: "11px", color: "var(--secondary)", marginTop: "10px", fontWeight: "600" }}>
              — Henry Rollins
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
