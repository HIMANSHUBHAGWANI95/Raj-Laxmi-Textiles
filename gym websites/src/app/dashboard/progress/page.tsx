"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, TrendingUp, Info, Scale, Percent, RefreshCw } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

interface ProgressEntry {
  id: string;
  weight: number;
  bodyFat: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  thighs: number | null;
  notes: string | null;
  date: string;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");
  const [biceps, setBiceps] = useState("");
  const [thighs, setThighs] = useState("");
  const [notes, setNotes] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/progress");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!weight) {
      setError("Body Weight is required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: parseFloat(weight),
          bodyFat: bodyFat ? parseFloat(bodyFat) : null,
          chest: chest ? parseFloat(chest) : null,
          waist: waist ? parseFloat(waist) : null,
          hips: hips ? parseFloat(hips) : null,
          biceps: biceps ? parseFloat(biceps) : null,
          thighs: thighs ? parseFloat(thighs) : null,
          notes: notes || null
        })
      });

      if (res.ok) {
        setFormOpen(false);
        setWeight("");
        setBodyFat("");
        setChest("");
        setWaist("");
        setHips("");
        setBiceps("");
        setThighs("");
        setNotes("");
        fetchEntries();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to log metrics");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this progress log?")) return;
    try {
      const res = await fetch(`/api/progress?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format date for charts
  const chartData = entries.map((entry) => ({
    ...entry,
    formattedDate: new Date(entry.date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short"
    })
  }));

  const latestEntry = entries[entries.length - 1];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div className="db-header">
        <div className="db-title-section">
          <span className="db-subtitle">Metrics Logger</span>
          <h1 className="db-title">Progress Tracking</h1>
        </div>
        <button 
          onClick={() => setFormOpen(!formOpen)} 
          className="btn btn-primary btn-sm"
          style={{ display: "inline-flex", gap: "6px" }}
        >
          <Plus size={16} /> Log Metrics
        </button>
      </div>

      {/* Log Form */}
      {formOpen && (
        <div className="card-glass" style={{ border: "1px solid var(--primary)" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "20px", fontWeight: "700" }}>Log Body Metrics</h3>
          
          {error && <div className="auth-global-error">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="grid-responsive">
            <div className="form-group">
              <label className="form-label" htmlFor="input-weight">Weight (kg) *</label>
              <input
                id="input-weight"
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 78.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-bf">Body Fat %</label>
              <input
                id="input-bf"
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 15.4"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-chest">Chest (inches)</label>
              <input
                id="input-chest"
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 40"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-waist">Waist (inches)</label>
              <input
                id="input-waist"
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 32"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-biceps">Biceps (inches)</label>
              <input
                id="input-biceps"
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 14.5"
                value={biceps}
                onChange={(e) => setBiceps(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="input-thighs">Thighs (inches)</label>
              <input
                id="input-thighs"
                type="number"
                step="0.1"
                className="form-input"
                placeholder="e.g. 22"
                value={thighs}
                onChange={(e) => setThighs(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label" htmlFor="input-progress-notes">Notes</label>
              <input
                id="input-progress-notes"
                type="text"
                className="form-input"
                placeholder="e.g. Measured in morning before breakfast"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Metrics"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <RefreshCw className="animate-float" size={32} color="var(--primary)" />
        </div>
      ) : entries.length === 0 ? (
        <div className="card-glass" style={{ textAlign: "center", padding: "60px 24px" }}>
          <Scale size={40} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
          <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>No Progress Logged</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "24px" }}>
            You haven't logged any body metrics yet. Log your weight to generate tracking charts.
          </p>
          <button onClick={() => setFormOpen(true)} className="btn btn-primary">
            Log Weight Now
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Latest Metric Cards */}
          {latestEntry && (
            <div className="db-summary-grid">
              <div className="db-summary-card">
                <span className="db-summary-lbl" style={{ color: "var(--primary)" }}>Weight</span>
                <div className="db-summary-val">{latestEntry.weight} kg</div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Current scale reading</span>
              </div>
              <div className="db-summary-card">
                <span className="db-summary-lbl" style={{ color: "var(--secondary)" }}>Body Fat</span>
                <div className="db-summary-val">
                  {latestEntry.bodyFat ? `${latestEntry.bodyFat}%` : "--"}
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Adipose calculation</span>
              </div>
              <div className="db-summary-card">
                <span className="db-summary-lbl" style={{ color: "var(--accent-cyan)" }}>Waist</span>
                <div className="db-summary-val">
                  {latestEntry.waist ? `${latestEntry.waist}"` : "--"}
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Tape measurement</span>
              </div>
              <div className="db-summary-card">
                <span className="db-summary-lbl" style={{ color: "var(--accent-purple)" }}>Biceps</span>
                <div className="db-summary-val">
                  {latestEntry.biceps ? `${latestEntry.biceps}"` : "--"}
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>Flexed arms caliper</span>
              </div>
            </div>
          )}

          {/* Charts Row */}
          {mounted && entries.length >= 2 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }} className="grid-responsive">
              {/* Weight Chart */}
              <div className="card-glass" style={{ padding: "30px" }}>
                <h3 className="db-section-title" style={{ fontSize: "17px", marginBottom: "20px" }}>
                  <Scale size={16} color="var(--primary)" /> Weight Trend (kg)
                </h3>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="formattedDate" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} domain={["auto", "auto"]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                        labelStyle={{ fontWeight: "bold" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="var(--primary)" 
                        strokeWidth={3} 
                        dot={{ r: 4, stroke: "var(--primary)", strokeWidth: 2, fill: "var(--bg-secondary)" }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Body Fat Chart */}
              <div className="card-glass" style={{ padding: "30px" }}>
                <h3 className="db-section-title" style={{ fontSize: "17px", marginBottom: "20px" }}>
                  <Percent size={16} color="var(--secondary)" /> Body Fat Trend (%)
                </h3>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.filter(d => d.bodyFat !== null)} margin={{ left: -20, right: 10, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="formattedDate" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} domain={["auto", "auto"]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                        labelStyle={{ fontWeight: "bold" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="bodyFat" 
                        stroke="var(--secondary)" 
                        strokeWidth={3} 
                        dot={{ r: 4, stroke: "var(--secondary)", strokeWidth: 2, fill: "var(--bg-secondary)" }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-glass" style={{ padding: "30px", display: "flex", gap: "12px", alignItems: "center", background: "rgba(255,255,255,0.01)" }}>
              <Info size={20} color="var(--primary)" />
              <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
                Note: Log at least 2 body weight measurements to view chronological progress trend graphs.
              </span>
            </div>
          )}

          {/* Historical Log list */}
          <div className="payments-section">
            <h3 className="payments-title">Logs History</h3>
            <div className="payments-table-container">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Weight</th>
                    <th>Body Fat</th>
                    <th>Tape Measures (W / C / B)</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.slice().reverse().map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        {new Date(entry.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td style={{ fontWeight: "700" }}>{entry.weight} kg</td>
                      <td>{entry.bodyFat ? `${entry.bodyFat}%` : "--"}</td>
                      <td>
                        {entry.waist || entry.chest || entry.biceps ? (
                          <span style={{ fontSize: "12px" }}>
                            Waist: {entry.waist || "--"}" | Chest: {entry.chest || "--"}" | Bicep: {entry.biceps || "--"}"
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>--</span>
                        )}
                      </td>
                      <td style={{ fontSize: "13px" }}>{entry.notes || "--"}</td>
                      <td>
                        <button 
                          onClick={() => handleDelete(entry.id)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                          onMouseOver={(e) => e.currentTarget.style.color = "var(--primary)"}
                          onMouseOut={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
