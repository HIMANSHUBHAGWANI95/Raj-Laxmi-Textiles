import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "MediQuick | Premium Online Medicine Delivery & Prescription Portal",
  description: "Get genuine prescription drugs, wellness supplements, and medical devices delivered to your doorstep instantly. Secure signature checks and Razorpay checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col" style={{ minHeight: "100vh" }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

