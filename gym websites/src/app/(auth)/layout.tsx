import React from "react";
import "./auth.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      <div className="auth-sidebar">
        <div className="auth-brand">
          <span className="auth-brand-logo">⚡ AB</span> FITNESS
        </div>
        
        <div className="auth-quote-container">
          <h2 className="auth-quote">
            "THE ONLY BAD WORKOUT IS THE ONE THAT DIDN'T HAPPEN."
          </h2>
          <div className="auth-author">AB Elite Training System</div>
        </div>
        
        <div className="auth-stats">
          <div className="auth-stat-item">
            <span className="auth-stat-val">25+</span>
            <span className="auth-stat-lbl">Gym Locations</span>
          </div>
          <div className="auth-stat-item">
            <span className="auth-stat-val">50K+</span>
            <span className="auth-stat-lbl">Active Members</span>
          </div>
          <div className="auth-stat-item">
            <span className="auth-stat-val">100+</span>
            <span className="auth-stat-lbl">Elite Coaches</span>
          </div>
        </div>
      </div>
      
      <div className="auth-form-side">
        {children}
      </div>
    </div>
  );
}
