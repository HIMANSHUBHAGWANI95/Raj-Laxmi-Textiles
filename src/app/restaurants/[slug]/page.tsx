import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantDetailClient from "@/components/RestaurantDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      menuItems: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <RestaurantDetailClient restaurant={restaurant} />
      </main>
      <Footer />
    </div>
  );
}
