import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationsClient from "@/components/LocationsClient";
import { db } from "@/lib/db";

export const revalidate = 3600; // Cache page for 1 hour since gym location details rarely change

export default async function LocationsPage() {
  const locations = await db.gymLocation.findMany({
    where: { active: true },
    orderBy: { name: "asc" }
  });

  // Extract unique list of cities for the filter dropdown
  const cities = Array.from(new Set(locations.map((loc) => loc.city))).sort();

  return (
    <>
      <Navbar />
      <LocationsClient locations={locations} cities={cities} />
      <Footer />
    </>
  );
}
