"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-glass" style={{ width: "100%" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2
          className="title-sm"
          style={{
            fontSize: "1.75rem",
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, #ffffff 60%, var(--color-primary) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome Back
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Sign in to order medicines and manage prescriptions
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div className="input-group">
          <label className="input-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            disabled={isLoading}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem", height: "48px" }}
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.9rem" }}>
        <span style={{ color: "var(--text-secondary)" }}>Don&apos;t have an account? </span>
        <Link
          href="/register"
          style={{
            color: "var(--color-primary)",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Register here
        </Link>
      </div>
    </div>
  );
}
