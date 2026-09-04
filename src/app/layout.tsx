import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: {
    default: "CraveBite | Premium Food Delivery & Ordering",
    template: "%s | CraveBite"
  },
  description: "Cravings delivered fast! Satisfy your appetite with organic, fresh, and hot gourmet meals from your favorite local restaurants.",
  keywords: ["food delivery", "online food ordering", "gourmet food", "fresh meals", "local restaurants", "CraveBite"],
  authors: [{ name: "CraveBite Dev Team" }],
  openGraph: {
    title: "CraveBite | Premium Food Delivery & Ordering",
    description: "Cravings delivered fast! Satisfy your appetite with organic, fresh, and hot gourmet meals from your favorite local restaurants.",
    type: "website",
    locale: "en_US",
    siteName: "CraveBite",
  },
  twitter: {
    card: "summary_large_image",
    title: "CraveBite | Premium Food Delivery & Ordering",
    description: "Cravings delivered fast! Satisfy your appetite with organic, fresh, and hot gourmet meals from your favorite local restaurants.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
