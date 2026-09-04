import type { Metadata } from "next";
import { Fraunces, Public_Sans, Tiro_Devanagari_Hindi } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { StickyEnquiryBar } from "@/components/site/StickyEnquiryBar";
import { BUSINESS } from "@/lib/constants";
import { getSiteImage } from "@/lib/images";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/flags";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});

const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: "400",
  display: "swap",
  variable: "--font-tiro-deva",
});

const og = getSiteImage("og-default");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Applies to every route: a prototype with indicative rates stays out of
  // the index entirely.
  robots: ALLOW_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  title: {
    default: `${BUSINESS.name} — Jaipuri Screen-Printed Bedsheets`,
    template: `%s — ${BUSINESS.name}`,
  },
  description: `Wholesale manufacturer of Jaipuri screen-printed bedsheets in ${BUSINESS.address.city}. Bulk orders, custom colourways and trade pricing.`,
  openGraph: {
    type: "website",
    siteName: BUSINESS.name,
    images: [
      {
        url: og.src,
        width: og.width,
        height: og.height,
        alt: `${BUSINESS.name} — Jaipuri screen-printed bedsheets`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable} ${tiroDevanagari.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ivory pb-14 text-ink md:pb-0">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyEnquiryBar />
        <Analytics />
      </body>
    </html>
  );
}
