"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const INDIAN_CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Chennai",
  "Ahmedabad",
  "Kolkata",
  "Gurugram",
  "Noida",
  "Lucknow",
  "Jaipur",
  "Indore",
  "Goa",
  "Chandigarh",
  "Kochi"
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    city?: string;
  }>({});

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!name.trim()) {
      errors.name = "Name is required";
    }
    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,12}$/.test(phone.replace(/\s+/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!city) {
      errors.city = "Please select a city";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email.toLowerCase(),
          password,
          phone,
          city,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong during registration.");
      } else {
        // Auto sign in user after successful registration
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: email.toLowerCase(),
          password,
        });

        if (signInResult?.error) {
          router.push("/login?registered=true");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Failed to register. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">
          Already have an account?{" "}
          <Link href="/login" className="auth-link">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="auth-global-error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          {fieldErrors.name && (
            <span className="form-error">{fieldErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          {fieldErrors.email && (
            <span className="form-error">{fieldErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {fieldErrors.password && (
            <span className="form-error">{fieldErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            placeholder="9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
          {fieldErrors.phone && (
            <span className="form-error">{fieldErrors.phone}</span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="city">
            City Location
          </label>
          <select
            id="city"
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"white\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundPosition: "right 12px center", backgroundRepeat: "no-repeat" }}
          >
            <option value="" disabled>Select your primary city</option>
            {INDIAN_CITIES.map((c) => (
              <option key={c} value={c} style={{ color: "black" }}>
                {c}
              </option>
            ))}
          </select>
          {fieldErrors.city && (
            <span className="form-error">{fieldErrors.city}</span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary auth-submit-btn"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
