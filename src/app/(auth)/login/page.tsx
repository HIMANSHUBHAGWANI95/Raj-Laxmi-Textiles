"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI State
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Client Validation
  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (result?.error) {
        setGlobalError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else {
        router.refresh();
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setGlobalError("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-card">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontFamily: "var(--font-outfit)", marginBottom: "8px" }}>
          Welcome Back
        </h1>
        <p className="text-muted" style={{ fontSize: "14px" }}>
          Log in to your account to order delicious meals.
        </p>
      </div>

      {globalError && (
        <div className="alert-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email Input Group */}
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center"
            }}>
              <Mail size={18} />
            </span>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className="input-premium"
              style={{ paddingLeft: "48px" }}
              disabled={isLoading}
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Password Input Group */}
        <div className="form-group" style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <a href="#" style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 500 }}>
              Forgot password?
            </a>
          </div>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center"
            }}>
              <Lock size={18} />
            </span>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              className="input-premium"
              style={{ paddingLeft: "48px" }}
              disabled={isLoading}
            />
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: "100%", gap: "8px", marginBottom: "24px" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="text-center" style={{ fontSize: "14px" }}>
        <span className="text-muted">Don't have an account? </span>
        <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600 }}>
          Sign Up Free
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-form-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "300px" }}>
        <Loader2 size={36} className="animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

