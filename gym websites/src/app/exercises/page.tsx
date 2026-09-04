import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExercisesClient from "@/components/ExercisesClient";
import { db } from "@/lib/db";

export const revalidate = 3600; // Cache page for 1 hour

export default async function ExercisesPage() {
  const exercises = await db.exercise.findMany({
    orderBy: { name: "asc" }
  });

  // Extract unique filter categories
  const muscleGroups = Array.from(new Set(exercises.map((e) => e.muscleGroup))).sort();
  const equipmentOptions = Array.from(new Set(exercises.map((e) => e.equipment))).sort();

  return (
    <>
      <Navbar />
      <ExercisesClient 
        exercises={exercises} 
        muscleGroups={muscleGroups} 
        equipmentOptions={equipmentOptions} 
      />
      <Footer />
    </>
  );
}
