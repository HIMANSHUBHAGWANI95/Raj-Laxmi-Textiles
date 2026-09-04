import React from "react";
import WorkoutLoggerClient from "@/components/WorkoutLoggerClient";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const revalidate = 0; // Live update logger lists

export default async function WorkoutLogPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Load exercises list for selection
  const exercises = await db.exercise.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      muscleGroup: true
    }
  });

  return (
    <div>
      <WorkoutLoggerClient exercises={exercises} />
    </div>
  );
}
