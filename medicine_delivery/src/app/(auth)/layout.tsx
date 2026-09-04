import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      {/* Left Column: Branding Block (Hidden on mobile) */}
      <div
        className="auth-branding-panel"
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #091322 0%, #0d1b32 50%, #152c4e 100%)",
          borderRight: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-5%",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        {/* Logo / Header */}
        <div style={{ zIndex: 1 }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "white",
              fontFamily: "var(--font-title)",
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                color: "white",
                boxShadow: "0 4px 10px rgba(14, 165, 233, 0.3)",
              }}
            >
              ✙
            </span>
            Medi<span style={{ color: "var(--color-primary)" }}>Quick</span>
          </Link>
        </div>

        {/* Marketing Info */}
        <div style={{ zIndex: 1, margin: "4rem 0" }}>
          <h1
            style={{
              fontSize: "2.75rem",
              lineHeight: 1.2,
              marginBottom: "1.5rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #ffffff 50%, var(--color-primary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Health, Delivered Fast
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              marginBottom: "2rem",
              maxWidth: "480px",
            }}
          >
            MediQuick brings genuine medications, healthcare devices, and pharmacy supplements to your doorstep in minutes. Upload prescriptions securely and let our certified pharmacists verify your orders.
          </p>

          {/* Trust Signals */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "var(--color-accent)", fontSize: "1.25rem" }}>✓</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>100% Genuine Certified Medicines</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "var(--color-accent)", fontSize: "1.25rem" }}>✓</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Secure Prescription Upload & Rx Verification</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span style={{ color: "var(--color-accent)", fontSize: "1.25rem" }}>✓</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Seamless Sandbox Payment Simulator</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div style={{ zIndex: 1, color: "var(--text-muted)", fontSize: "0.85rem" }}>
          © {new Date().getFullYear()} MediQuick. All rights reserved. Registered Digital Pharmacy License.
        </div>
      </div>

      {/* Right Column: Active Form Content */}
      <div
        className="auth-form-panel"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          position: "relative",
        }}
      >
        {/* Style block for responsive panels */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 900px) {
            .auth-branding-panel {
              display: none !important;
            }
            .auth-form-panel {
              width: 100% !important;
              padding: 1.5rem !important;
            }
          }
        `}} />
        
        <div style={{ width: "100%", maxWidth: "450px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
