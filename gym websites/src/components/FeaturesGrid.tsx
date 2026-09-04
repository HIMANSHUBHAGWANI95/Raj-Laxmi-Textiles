import React from "react";
import { Globe, Award, Activity, Target, Zap, CreditCard } from "lucide-react";
import "./FeaturesGrid.css";

const FEATURES_DATA = [
  {
    icon: <Globe size={24} />,
    title: "All-India Gym Access",
    desc: "Train at any of our 25+ premium club locations in major Indian cities. Zero limits, absolute freedom.",
  },
  {
    icon: <Award size={24} />,
    title: "Certified Elite Coaches",
    desc: "Get personalized guidance from certified trainers specializing in bodybuilding, functional fitness, and diets.",
  },
  {
    icon: <Activity size={24} />,
    title: "Interactive Workout Logger",
    desc: "Say goodbye to notes. Log sets, reps, weights, and exercises straight from your mobile phone.",
  },
  {
    icon: <Target size={24} />,
    title: "Fitness Goals Tracker",
    desc: "Define target weights or reps. Keep tabs on progress with beautiful completion tracking charts.",
  },
  {
    icon: <Zap size={24} />,
    title: "CrossFit & Athletic Zones",
    desc: "Unlock access to premium Olympic lifting bars, bumper plates, kettlebells, and functional turf spaces.",
  },
  {
    icon: <CreditCard size={24} />,
    title: "Sandbox Sim Checkout",
    desc: "Activate membership immediately using our sandbox simulator payment flow. Real key config is optional.",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="features section-padding" id="features">
      <div className="container">
        <div className="features-header">
          <span className="features-subtitle">Why Train With Us</span>
          <h2 className="features-title">ELITE FRANCHISE BENEFITS</h2>
          <p className="features-desc">
            We provide a state-of-the-art training ecosystem combining premium physical locations with next-gen digital logs.
          </p>
        </div>

        <div className="grid-responsive">
          {FEATURES_DATA.map((feat, i) => (
            <div key={i} className="card-glass feature-card">
              <div className="feature-icon-wrapper">{feat.icon}</div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
