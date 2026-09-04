"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Trash2, Calendar, Dumbbell, History, RefreshCw } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}

interface WorkoutLog {
  id: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  notes: string | null;
  date: string;
  exercise: {
    name: string;
    muscleGroup: string;
  };
}

interface WorkoutLoggerClientProps {
  exercises: Exercise[];
}

export default function WorkoutLoggerClient({ exercises }: WorkoutLoggerClientProps) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [exerciseId, setExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/workout-log");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!exerciseId || !sets || !reps || !weight || !duration) {
      setError("Please fill out all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/workout-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseId,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseFloat(weight),
          duration: parseInt(duration),
          notes: notes || undefined,
        }),
      });

      if (res.ok) {
        setExerciseId("");
        setSets("");
        setReps("");
        setWeight("");
        setDuration("");
        setNotes("");
        fetchLogs();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to log workout");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this log entry?")) return;
    try {
      const res = await fetch(`/api/workout-log?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchLogs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "40px" }} className="grid-responsive">
      {/* Logger Form */}
      <div>
        <div className="card-glass" style={{ padding: "32px", height: "fit-content" }}>
          <h3 className="db-section-title">
            <PlusCircle size={18} color="var(--primary)" /> Log Exercise Set
          </h3>
          
          {error && <div className="auth-global-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="select-exercise">Select Exercise</label>
              <select
                id="select-exercise"
                className="form-input"
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
                disabled={submitting}
                style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat" }}
              >
                <option value="" disabled>Choose an exercise...</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id} style={{ color: "black" }}>
                    {ex.name} ({ex.muscleGroup})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-sets">Sets Count</label>
                <input
                  id="input-sets"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 4"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="input-reps">Reps per Set</label>
                <input
                  id="input-reps"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 10"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="input-weight">Weight (in kg)</label>
                <input
                  id="input-weight"
                  type="number"
                  step="0.5"
                  className="form-input"
                  placeholder="e.g. 60"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="input-duration">Duration (in mins)</label>
                <input
                  id="input-duration"
                  type="number"
                  className="form-input"
                  placeholder="e.g. 45"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-notes">Trainer Notes (Optional)</label>
              <textarea
                id="input-notes"
                className="form-input"
                placeholder="e.g. Felt strong today, slight struggle on last set reps."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={submitting}
                rows={3}
                style={{ resize: "none" }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
              disabled={submitting}
            >
              {submitting ? "Logging Set..." : "Log Workout Set"}
            </button>
          </form>
        </div>
      </div>

      {/* History Log List */}
      <div>
        <div className="card-glass" style={{ padding: "32px", minHeight: "360px" }}>
          <h3 className="db-section-title">
            <History size={18} color="var(--primary)" /> Training History Logs
          </h3>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <RefreshCw className="animate-float" size={24} color="var(--primary)" />
            </div>
          ) : logs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)", fontSize: "14px" }}>
              No logged workouts found. Fill out the form to log your first exercise set!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "560px", overflowY: "auto", paddingRight: "8px" }}>
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="db-list-item" 
                  style={{ 
                    background: "rgba(255,255,255,0.02)", 
                    padding: "16px 20px", 
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <div style={{ background: "rgba(255, 42, 95, 0.1)", color: "var(--primary)", padding: "8px", borderRadius: "var(--radius-sm)" }}>
                      <Dumbbell size={16} />
                    </div>
                    <div className="db-list-main">
                      <span className="db-list-title" style={{ fontSize: "15px" }}>{log.exercise.name}</span>
                      <span className="db-list-subtitle" style={{ fontSize: "12px" }}>
                        {log.sets} sets &times; {log.reps} reps @ {log.weight} kg
                      </span>
                      {log.notes && (
                        <span style={{ fontSize: "11px", color: "var(--text-muted)", fontStyle: "italic", marginTop: "4px" }}>
                          "{log.notes}"
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Calendar size={12} />
                      {new Date(log.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short"
                      })}
                    </span>
                    <button 
                      onClick={() => handleDelete(log.id)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                      onMouseOver={(e) => e.currentTarget.style.color = "var(--primary)"}
                      onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
