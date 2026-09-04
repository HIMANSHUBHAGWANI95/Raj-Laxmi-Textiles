"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Form Fields State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("");

  // Validation & Loading UI State
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    defaultAddress?: string;
  }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Client Validation Logic
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

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

    if (phone && !/^\+?[0-9\s-]{10,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (!defaultAddress.trim()) {
      newErrors.defaultAddress = "Delivery address is required";
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
      // 1. Call Register API
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
          defaultAddress: defaultAddress.trim(),
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setGlobalError(registerData.error || "Failed to register account.");
        setIsLoading(false);
        return;
      }

      // 2. Auto Login on Success
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (loginRes?.error) {
        setGlobalError("Account created, but automatic login failed. Please log in manually.");
        setIsLoading(false);
        router.push("/login");
      } else {
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setGlobalError("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-card" style={{ padding: "30px 40px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontFamily: "var(--font-outfit)", marginBottom: "4px" }}>
          Create Account
        </h1>
        <p className="text-muted" style={{ fontSize: "14px" }}>
          Join CraveBite to order and track premium meals.
        </p>
      </div>

      {globalError && (
        <div className="alert-error" style={{ marginBottom: "20px" }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{globalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Input Group */}
        <div className="form-group" style={{ margin: "0 0 16px 0" }}>
          <label className="form-label" htmlFor="name">
            Full Name
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
              <User size={18} />
            </span>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className="input-premium"
              style={{ paddingLeft: "48px", paddingTop: "12px", paddingBottom: "12px" }}
              disabled={isLoading}
            />
          </div>
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Email Input Group */}
        <div className="form-group" style={{ margin: "0 0 16px 0" }}>
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
              style={{ paddingLeft: "48px", paddingTop: "12px", paddingBottom: "12px" }}
              disabled={isLoading}
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Password Input Group */}
        <div className="form-group" style={{ margin: "0 0 16px 0" }}>
          <label className="form-label" htmlFor="password">
            Password
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
              <Lock size={18} />
            </span>
            <input
              id="password"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              className="input-premium"
              style={{ paddingLeft: "48px", paddingTop: "12px", paddingBottom: "12px" }}
              disabled={isLoading}
            />
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        {/* Phone Input Group */}
        <div className="form-group" style={{ margin: "0 0 16px 0" }}>
          <label className="form-label" htmlFor="phone">
            Phone Number (Optional)
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
              <Phone size={18} />
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: undefined });
              }}
              className="input-premium"
              style={{ paddingLeft: "48px", paddingTop: "12px", paddingBottom: "12px" }}
              disabled={isLoading}
            />
          </div>
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* Address Input Group */}
        <div className="form-group" style={{ margin: "0 0 24px 0" }}>
          <label className="form-label" htmlFor="address">
            Default Delivery Address
          </label>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "16px",
              top: "14px",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center"
            }}>
              <MapPin size={18} />
            </span>
            <textarea
              id="address"
              placeholder="Enter your flat/house no., building, street name, and city details..."
              value={defaultAddress}
              onChange={(e) => {
                setDefaultAddress(e.target.value);
                if (errors.defaultAddress) setErrors({ ...errors, defaultAddress: undefined });
              }}
              className="input-premium"
              style={{ 
                paddingLeft: "48px", 
                paddingTop: "12px", 
                paddingBottom: "12px",
                minHeight: "80px",
                resize: "none"
              }}
              disabled={isLoading}
            />
          </div>
          {errors.defaultAddress && <span className="error-text">{errors.defaultAddress}</span>}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          style={{ width: "100%", gap: "8px", marginBottom: "20px" }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Sign Up</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="text-center" style={{ fontSize: "14px" }}>
        <span className="text-muted">Already have an account? </span>
        <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
          Log In
        </Link>
      </div>
    </div>
  );
}
