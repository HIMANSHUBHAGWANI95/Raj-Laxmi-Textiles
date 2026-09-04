import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RestaurantsList from "@/components/RestaurantsList";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function RestaurantsPage() {
  const restaurants = await db.restaurant.findMany({
    include: {
      menuItems: {
        select: {
          id: true,
          isVeg: true
        }
      }
    }
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Suspense fallback={
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
            <Loader2 size={36} className="animate-spin text-primary" />
          </div>
        }>
          <RestaurantsList initialRestaurants={restaurants} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
