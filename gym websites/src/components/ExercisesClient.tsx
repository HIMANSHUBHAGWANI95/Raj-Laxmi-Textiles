"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, Dumbbell, Award, HelpCircle } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  slug: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  tips: string; // JSON string
  videoUrl: string | null;
  imageUrl: string | null;
}

interface ExercisesClientProps {
  exercises: Exercise[];
  muscleGroups: string[];
  equipmentOptions: string[];
}

export default function ExercisesClient({ exercises, muscleGroups, equipmentOptions }: ExercisesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ex.instructions.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscle === "" || ex.muscleGroup === selectedMuscle;
    const matchesEquipment = selectedEquipment === "" || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const toggleExpand = (id: string) => {
    if (expandedExerciseId === id) {
      setExpandedExerciseId(null);
    } else {
      setExpandedExerciseId(id);
    }
  };

  const getDifficultyClass = (diff: string) => {
    if (diff === "ADVANCED") return "badge-primary";
    if (diff === "INTERMEDIATE") return "badge-secondary";
    return "badge-success";
  };

  return (
    <div className="container" style={{ paddingTop: "120px", paddingBottom: "100px" }}>
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <span className="badge badge-secondary" style={{ marginBottom: "12px" }}>
          EXERCISE DATABASE
        </span>
        <h1 style={{ fontSize: "44px", fontWeight: "900", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
          FITNESS WORKOUT DICTIONARY
        </h1>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "16px" }}>
          Search step-by-step instructions and trainer safety tips for chest, legs, and strength movements.
        </p>
      </div>

      {/* Filters */}
      <div 
        className="card-glass" 
        style={{ 
          display: "flex", 
          gap: "16px", 
          marginBottom: "40px", 
          alignItems: "center",
          flexWrap: "wrap",
          padding: "20px 24px"
        }}
      >
        <div style={{ flex: 1.5, position: "relative", minWidth: "260px" }}>
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} 
          />
          <input
            type="text"
            className="form-input"
            placeholder="Search exercises by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "42px" }}
          />
        </div>
        
        <div style={{ flex: 1, minWidth: "180px" }}>
          <select
            className="form-input"
            value={selectedMuscle}
            onChange={(e) => setSelectedMuscle(e.target.value)}
            style={{ 
              appearance: "none", 
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", 
              backgroundPosition: "right 12px center", 
              backgroundRepeat: "no-repeat" 
            }}
          >
            <option value="">All Muscles</option>
            {muscleGroups.map((m) => (
              <option key={m} value={m} style={{ color: "black" }}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, minWidth: "180px" }}>
          <select
            className="form-input"
            value={selectedEquipment}
            onChange={(e) => setSelectedEquipment(e.target.value)}
            style={{ 
              appearance: "none", 
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", 
              backgroundPosition: "right 12px center", 
              backgroundRepeat: "no-repeat" 
            }}
          >
            <option value="">All Equipment</option>
            {equipmentOptions.map((eq) => (
              <option key={eq} value={eq} style={{ color: "black" }}>
                {eq}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exercises Count */}
      <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px", fontWeight: "500" }}>
        Showing {filteredExercises.length} movements
      </p>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredExercises.map((ex) => {
          const tips = JSON.parse(ex.tips) as string[];
          const isExpanded = expandedExerciseId === ex.id;
          
          return (
            <div 
              key={ex.id} 
              className="card-glass" 
              style={{ 
                padding: "24px 32px", 
                cursor: "pointer", 
                transition: "all var(--transition-normal)",
                borderLeft: isExpanded ? "4px solid var(--primary)" : "1px solid var(--card-border)",
                borderTopLeftRadius: isExpanded ? "0" : "var(--radius-lg)",
                borderBottomLeftRadius: isExpanded ? "0" : "var(--radius-lg)"
              }}
              onClick={() => toggleExpand(ex.id)}
            >
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "16px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div 
                    style={{ 
                      width: "42px", 
                      height: "42px", 
                      borderRadius: "var(--radius-md)", 
                      background: "rgba(255, 42, 95, 0.08)", 
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "19px", fontWeight: "700", marginBottom: "4px" }}>
                      {ex.name}
                    </h3>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span className="badge badge-secondary" style={{ fontSize: "10px", padding: "1px 8px" }}>
                        {ex.muscleGroup}
                      </span>
                      <span className="badge badge-secondary" style={{ fontSize: "10px", padding: "1px 8px" }}>
                        {ex.equipment}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span className={`badge ${getDifficultyClass(ex.difficulty)}`} style={{ fontSize: "10px" }}>
                    {ex.difficulty}
                  </span>
                  <button 
                    style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                    aria-label="Expand details"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div 
                  style={{ 
                    marginTop: "24px", 
                    paddingTop: "24px", 
                    borderTop: "1px solid var(--border-color)", 
                    display: "grid", 
                    gridTemplateColumns: "1.5fr 1fr", 
                    gap: "40px" 
                  }}
                  className="grid-responsive"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inner details
                >
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      👉 INSTRUCTIONS
                    </h4>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", whiteSpace: "pre-line", lineHeight: "1.6" }}>
                      {ex.instructions}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: "700", color: "var(--secondary)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      💡 COACH'S TIPS
                    </h4>
                    <ul style={{ paddingLeft: "18px", fontSize: "14px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {tips.map((t, idx) => (
                        <li key={idx} style={{ lineHeight: "1.5" }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
