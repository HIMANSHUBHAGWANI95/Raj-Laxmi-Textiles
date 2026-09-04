import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CheckoutClient from "@/components/CheckoutClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  // Fetch user default address from db
  const user = await db.user.findUnique({
    where: { id: (session.user as any).id },
    select: { defaultAddress: true },
  });

  const defaultAddress = user?.defaultAddress || "";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <CheckoutClient defaultAddress={defaultAddress} />
      </main>
      <Footer />
    </div>
  );
}
