"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Target, CheckCircle2, RefreshCw, X } from "lucide-react";

interface Goal {
  id: string;
  type: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  
  // Form states
  const [type, setType] = useState("WEIGHT");
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [unit, setUnit] = useState("kg");
  const [deadline, setDeadline] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Progress edit states
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !target || !current || !deadline) {
      setError("Please fill out all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          target: parseFloat(target),
          current: parseFloat(current),
          unit,
          deadline,
        }),
      });

      if (res.ok) {
        setFormOpen(false);
        setTitle("");
        setTarget("");
        setCurrent("");
        setDeadline("");
        fetchGoals();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create goal");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProgress = async (id: string) => {
    if (!editValue) return;
    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          current: parseFloat(editValue)
        }),
      });

      if (res.ok) {
        setEditId(null);
        setEditValue("");
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;
    try {
      const res = await fetch(`/api/goals?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculatePercent = (current: number, target: number) => {
    const percent = Math.round((current / target) * 100);
    return Math.min(100, Math.max(0, percent));
  };

  return (
    <div>
      {/* Header */}
      <div className="db-header">
        <div className="db-title-section">
          <span className="db-subtitle">Milestones Tracker</span>
          <h1 className="db-title">Fitness Goals</h1>
        </div>
        <button 
          onClick={() => setFormOpen(true)} 
          className="btn btn-primary btn-sm"
          style={{ display: "inline-flex", gap: "6px" }}
        >
          <Plus size={16} /> Define Goal
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <RefreshCw className="animate-float" size={32} color="var(--primary)" />
          <p style={{ marginTop: "12px", color: "var(--text-secondary)" }}>Loading your goals...</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Create Goal Form / Inline card */}
          {formOpen && (
            <div className="card-glass" style={{ border: "1px solid var(--primary)", position: "relative" }}>
              <button 
                onClick={() => setFormOpen(false)}
                style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
              
              <h3 style={{ fontSize: "20px", marginBottom: "20px", fontWeight: "700" }}>Define Fitness Goal</h3>
              
              {error && <div className="auth-global-error">{error}</div>}

              <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="grid-responsive">
                <div className="form-group">
                  <label className="form-label">Goal Category</label>
                  <select 
                    className="form-input" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)}
                    style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat" }}
                  >
                    <option value="WEIGHT" style={{ color: "black" }}>Weight Loss / Gain</option>
                    <option value="STRENGTH" style={{ color: "black" }}>Strength Lifting (Reps/Weight)</option>
                    <option value="CARDIO" style={{ color: "black" }}>Cardio Stamina (Mins/Distance)</option>
                    <option value="BODY_FAT" style={{ color: "black" }}>Body Fat Reduction (%)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Goal Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bench Press 100kg or Lean Weight 70kg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Number</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="e.g. 100"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Current Starting Number</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    placeholder="e.g. 85"
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unit of Measure</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. kg, reps, mins"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "10px" }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Defining..." : "Save Goal"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {goals.length === 0 ? (
            <div className="card-glass" style={{ textAlign: "center", padding: "60px 24px" }}>
              <Target size={40} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
              <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>No Goals Defined</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
                You have not defined any goals yet. Start tracking your targets today!
              </p>
              <button onClick={() => setFormOpen(true)} className="btn btn-primary">
                Define Your First Goal
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {goals.map((g) => {
                const percent = calculatePercent(g.current, g.target);
                const isCompleted = g.status === "COMPLETED";
                
                return (
                  <div 
                    key={g.id} 
                    className="card-glass" 
                    style={{ 
                      padding: "24px 32px",
                      borderLeft: isCompleted ? "4px solid #10b981" : "4px solid var(--primary)",
                      borderTopLeftRadius: "0",
                      borderBottomLeftRadius: "0",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px"
                    }}
                  >
                    {/* Upper row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                      <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: isCompleted ? "#10b981" : "var(--primary)", textTransform: "uppercase", letterSpacing: "0.15em", display: "block", marginBottom: "4px" }}>
                          {g.type} • {g.status}
                        </span>
                        <h3 style={{ fontSize: "20px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                          {g.title} {isCompleted && <CheckCircle2 size={18} color="#10b981" />}
                        </h3>
                      </div>

                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={14} />
                          <span>By {new Date(g.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <button 
                          onClick={() => handleDelete(g.id)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}
                          onMouseOver={(e) => e.currentTarget.style.color = "var(--primary)"}
                          onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                          title="Delete Goal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar Row */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                        <span style={{ color: "var(--text-secondary)" }}>
                          Current: <strong>{g.current} {g.unit}</strong>
                        </span>
                        <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{percent}%</span>
                        <span style={{ color: "var(--text-secondary)" }}>
                          Target: <strong>{g.target} {g.unit}</strong>
                        </span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "var(--bg-primary)", borderRadius: "9999px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                        <div 
                          style={{ 
                            width: `${percent}%`, 
                            height: "100%", 
                            background: isCompleted ? "linear-gradient(90deg, #10b981 0%, #059669 100%)" : "var(--gradient-primary)",
                            borderRadius: "9999px",
                            transition: "width 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
                          }} 
                        />
                      </div>
                    </div>

                    {/* Update Action Row */}
                    {!isCompleted && (
                      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "16px", display: "flex", justifyContent: "flex-end" }}>
                        {editId === g.id ? (
                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            <input
                              type="number"
                              step="0.1"
                              className="form-input"
                              placeholder={`New ${g.unit}`}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              style={{ width: "120px", padding: "6px 12px", height: "34px", fontSize: "14px" }}
                            />
                            <button className="btn btn-primary btn-sm" onClick={() => handleUpdateProgress(g.id)} style={{ height: "34px" }}>
                              Save
                            </button>
                            <button className="btn btn-secondary btn-sm" onClick={() => { setEditId(null); setEditValue(""); }} style={{ height: "34px" }}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={() => { setEditId(g.id); setEditValue(g.current.toString()); }}
                          >
                            Update Progress
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
