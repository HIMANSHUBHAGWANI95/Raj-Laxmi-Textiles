"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { name, email, password, phone, address, city } = formData;

    // Simple validation checks
    if (!name || !email || !password || !phone || !address || !city) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (phone.length < 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsLoading(true);

    try {
      // POST to our register API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        setIsLoading(false);
        return;
      }

      // Automatically sign in the user on success
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        setError("Account created, but automatic sign-in failed. Please login manually.");
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred during registration.");
      setIsLoading(false);
    }
  };

  return (
    <div className="card-glass" style={{ width: "100%", padding: "1.75rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
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
          Create Account
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Join MediQuick for instant delivery & prescription verification
        </p>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: "1.25rem" }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="grid grid-2" style={{ gap: "1rem" }}>
          <div className="input-group">
            <label className="input-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="grid grid-2" style={{ gap: "1rem" }}>
          <div className="input-group">
            <label className="input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              disabled={isLoading}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="10 digit number"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="address">
            Delivery Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Apartment, Street Address"
            value={formData.address}
            onChange={handleChange}
            className="input-field"
            disabled={isLoading}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="city">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
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
          {isLoading ? "Creating Account..." : "Register Now"}
        </button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.9rem" }}>
        <span style={{ color: "var(--text-secondary)" }}>Already have an account? </span>
        <Link
          href="/login"
          style={{
            color: "var(--color-primary)",
            fontWeight: 600,
            textDecoration: "underline",
          }}
        >
          Login here
        </Link>
      </div>
    </div>
  );
}
