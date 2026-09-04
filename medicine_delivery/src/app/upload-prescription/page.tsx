"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export default function UploadPrescriptionPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file size (max 4MB base64 is reasonable for SQLite limits)
      if (file.size > 4 * 1024 * 1024) {
        setError("File is too large. Please upload an image smaller than 4MB.");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Invalid file type. Please upload a PNG, JPG, or JPEG image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!filePreview) {
      setError("Please select and upload a prescription image.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: filePreview,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to upload prescription.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard/prescriptions");
          router.refresh();
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main style={{ flexGrow: 1, padding: "4rem 0" }}>
        <div className="container" style={{ display: "flex", justifyContent: "center" }}>
          <div className="card-glass" style={{ width: "100%", maxWidth: "600px" }}>
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <div
                style={{
                  background: "rgba(14, 165, 233, 0.15)",
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-primary)",
                  margin: "0 auto 1rem auto",
                }}
              >
                <FileText size={28} />
              </div>
              <h1
                className="title-sm"
                style={{
                  fontSize: "1.75rem",
                  marginBottom: "0.5rem",
                  background: "linear-gradient(135deg, #ffffff 60%, var(--color-primary) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Upload Digital Prescription
              </h1>
              <p className="text-muted" style={{ fontSize: "0.95rem" }}>
                Our licensed pharmacist will review and verify your prescription within 15 minutes.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
                <AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "2rem 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <CheckCircle2 size={56} style={{ color: "var(--color-accent)" }} />
                <h3 className="title-sm" style={{ color: "white" }}>
                  Upload Successful!
                </h3>
                <p className="text-muted">
                  Your prescription is saved. Redirecting to your dashboard to track verification status...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* File box trigger */}
                <div className="input-group">
                  <label className="input-label">Prescription Image (PNG, JPG, JPEG)</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                    disabled={isLoading}
                  />
                  
                  {filePreview ? (
                    <div
                      style={{
                        border: "1px solid var(--color-primary)",
                        borderRadius: "10px",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem",
                        background: "rgba(14, 165, 233, 0.03)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={filePreview}
                        alt="Prescription preview"
                        style={{
                          maxHeight: "200px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          borderRadius: "6px",
                          border: "1px solid var(--border-color)",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={handleFileBoxClick}
                        disabled={isLoading}
                      >
                        Change Image
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={handleFileBoxClick}
                      style={{
                        border: "2px dashed var(--border-color)",
                        borderRadius: "10px",
                        padding: "3rem 1.5rem",
                        textAlign: "center",
                        cursor: "pointer",
                        background: "rgba(255, 255, 255, 0.01)",
                        transition: "all var(--transition-fast)",
                      }}
                      className="upload-dropzone"
                    >
                      <Upload
                        size={36}
                        style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}
                      />
                      <p style={{ fontWeight: 600, color: "white", marginBottom: "0.25rem" }}>
                        Click to upload your file
                      </p>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        Supports PNG, JPG, JPEG files up to 4MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="input-group">
                  <label className="input-label" htmlFor="notes">
                    Pharmacist Instructions / Doctor Notes
                  </label>
                  <textarea
                    id="notes"
                    placeholder="Enter any doctor directions, dosage queries, or specific details for the pharmacist..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                    style={{ minHeight: "100px", resize: "vertical" }}
                    disabled={isLoading}
                  />
                </div>

                {/* Actions */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", height: "48px", marginTop: "1rem" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting prescription..." : "Submit Prescription"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Dropzone CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .upload-dropzone:hover {
          border-color: var(--color-primary) !important;
          background: rgba(14, 165, 233, 0.04) !important;
        }
      `}} />
    </>
  );
}
