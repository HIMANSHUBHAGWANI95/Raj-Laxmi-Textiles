import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { FileText, Calendar, PlusCircle, CheckCircle, Clock } from "lucide-react";

export const revalidate = 0; // Prevent caching to show fresh database queries upon payment

export default async function PrescriptionsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return null;

  // Retrieve user's prescriptions list
  const prescriptions = await db.prescription.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="dashboard-section-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1
            className="title-sm"
            style={{
              fontSize: "1.75rem",
              background: "linear-gradient(135deg, #ffffff 60%, var(--color-primary) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Prescriptions
          </h1>
          <p className="text-muted" style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Track validation statuses of your uploaded medical slips.
          </p>
        </div>
        <Link href="/upload-prescription" className="btn btn-primary btn-sm">
          <PlusCircle size={16} />
          Upload New Rx
        </Link>
      </div>

      {prescriptions.length === 0 ? (
        <div
          className="card-glass"
          style={{
            padding: "5rem 2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "3rem", marginBottom: "1rem" }}>📄</span>
          <h3 className="title-sm" style={{ color: "white", marginBottom: "0.5rem" }}>
            No Prescriptions Uploaded
          </h3>
          <p className="text-muted" style={{ maxWidth: "400px", marginBottom: "1.5rem" }}>
            You haven&apos;t uploaded any doctor certificates yet. Uploading a valid prescription is required to dispatch Rx-labeled drugs.
          </p>
          <Link href="/upload-prescription" className="btn btn-primary">
            Upload Prescription
          </Link>
        </div>
      ) : (
        <div className="prescription-grid">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="prescription-card">
              {/* Image Preview thumbnail */}
              <div className="prescription-image-thumbnail">
                {rx.imageUrl.startsWith("data:") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={rx.imageUrl}
                    alt="Prescription document"
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                ) : (
                  <FileText size={32} style={{ color: "var(--text-muted)" }} />
                )}
              </div>

              {/* Info Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={12} />
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`badge-status status-${rx.status.toLowerCase()}`}>
                    {rx.status}
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem", borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
                  <strong style={{ color: "white", display: "block", marginBottom: "0.25rem" }}>User Notes:</strong>
                  <p style={{ color: "var(--text-secondary)", fontStyle: "italic", lineBreak: "anywhere" }}>
                    {rx.notes || "No additional instructions entered."}
                  </p>
                </div>

                {rx.status === "APPROVED" && (
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.05)",
                      border: "1px solid rgba(16, 185, 129, 0.15)",
                      borderRadius: "6px",
                      padding: "0.5rem",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: "#a7f3d0",
                      marginTop: "0.25rem",
                    }}
                  >
                    <CheckCircle size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
                    <span>Verified by pharmacist.</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
