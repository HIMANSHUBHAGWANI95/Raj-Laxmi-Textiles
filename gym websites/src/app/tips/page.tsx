"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: "safety" | "nutrition" | "training";
}

const TIPS_FAQ: FAQItem[] = [
  {
    id: 1,
    category: "safety",
    question: "How do I maintain form safety during heavy compound lifts like squats and deadlifts?",
    answer: "1. Neutral Spine: Never round your lower back. Keep your spine straight throughout the movement.\n2. Core Bracing: Inhale deeply into your stomach and contract your abs as if expecting a punch (Valsalva maneuver) before lifting.\n3. Flat Feet: Keep your heels and toes firmly planted. Avoid lifting your heels off the floor.\n4. Use a Spotter: Always recruit a trainer or partner when pressing or squatting near failure limit."
  },
  {
    id: 2,
    category: "training",
    question: "What is Progressive Overload and how do I apply it?",
    answer: "Progressive Overload is the practice of gradually increasing the stress placed on your body during training. You can apply it by:\n1. Weight: Adding more weight (e.g., adding 2.5kg to your bench press).\n2. Reps: Performing more repetitions at the same weight.\n3. Sets: Increasing the volume by adding sets.\n4. Rest: Decreasing rest timers slightly while keeping the weight constant.\nLog your lifts in the member dashboard to keep track of your progressive milestones!"
  },
  {
    id: 3,
    category: "nutrition",
    question: "What should I eat before and after a high-intensity gym workout?",
    answer: "• Pre-Workout (1-2 hours before): Focus on easily digestible carbohydrates and moderate protein to fuel your muscles. Examples: Oats with banana, whole wheat toast with peanut butter, or white rice with grilled chicken.\n• Post-Workout (within 45 minutes): Consume fast-digesting protein and carbohydrates to kickstart recovery and muscle protein synthesis. Examples: Whey protein shake with banana, or eggs with toast."
  },
  {
    id: 4,
    category: "safety",
    question: "How do I prevent muscle strain and joint injuries?",
    answer: "1. Dynamic Warm-up: Spend 5-10 minutes performing arm circles, leg swings, and bodyweight squats before touching weights.\n2. Warm-up Sets: Perform 1-2 light sets of the target exercise before lifting heavy.\n3. Control the Weight: Focus on the eccentric (negative) phase of the lift. Avoid dropping weights using momentum.\n4. Decompress: Stretch or foam roll target muscle groups after your workout."
  },
  {
    id: 5,
    category: "nutrition",
    question: "How much water and hydration is needed during training?",
    answer: "Water regulates your body temperature and lubricates joints. Follow this schedule:\n• Drink 500ml of water 2 hours before your workout.\n• Sip 150-250ml of water every 15-20 minutes during exercise.\n• Refuel with 500ml of water or electrolytes post-workout to replace lost sweat."
  },
  {
    id: 6,
    category: "training",
    question: "Should I perform cardio before or after lifting weights?",
    answer: "For muscle hypertrophy and strength, it is highly recommended to perform heavy weight lifting first, when your glycogen reserves are full and muscles are fresh. Perform high-intensity cardio after lifting or on rest days to prevent fatiguing your stabilizer muscles."
  }
];

export default function SafetyTipsPage() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleOpen = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: "120px", paddingBottom: "100px" }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <span className="badge badge-secondary" style={{ marginBottom: "12px" }}>
            SAFETY & SCIENCE
          </span>
          <h1 style={{ fontSize: "44px", fontWeight: "900", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
            TRAINING TIPS & RECOVERY
          </h1>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "16px" }}>
            Read through our coaches' FAQs on safe form execution, nutrient timing splits, and recovery sciences.
          </p>
        </div>

        {/* Info Grid Cards */}
        <div className="grid-responsive" style={{ marginBottom: "50px" }}>
          <div className="card-glass" style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ background: "rgba(255, 42, 95, 0.1)", color: "var(--primary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px", fontWeight: "700" }}>Safety First</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                Always secure bar weights using collar clips. Ask our floor trainers for a spot when pressing or squatting near failure limit.
              </p>
            </div>
          </div>

          <div className="card-glass" style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ background: "rgba(255, 136, 0, 0.1)", color: "var(--secondary)", padding: "12px", borderRadius: "var(--radius-md)" }}>
              <HeartPulse size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px", fontWeight: "700" }}>Hydration Checks</h3>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: "1.5" }}>
                Keep hydrated during CrossFit circuits. Dehydration of just 2% can reduce strength output by up to 10%!
              </p>
            </div>
          </div>
        </div>

        {/* Accordion FAQ */}
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
          {TIPS_FAQ.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div 
                key={item.id} 
                className="card-glass" 
                style={{ 
                  padding: "0", 
                  overflow: "hidden", 
                  border: isOpen ? "1px solid var(--primary)" : "1px solid var(--card-border)" 
                }}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleOpen(item.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "24px",
                    background: "none",
                    border: "none",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                    outline: "none",
                    fontWeight: "600",
                    fontSize: "16px"
                  }}
                >
                  <span>{item.question}</span>
                  {isOpen ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} />}
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div 
                    style={{ 
                      padding: "0 24px 24px 24px", 
                      fontSize: "14px", 
                      color: "var(--text-secondary)",
                      borderTop: "1px solid var(--border-color)",
                      paddingTop: "20px",
                      whiteSpace: "pre-line",
                      lineHeight: "1.7"
                    }}
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
