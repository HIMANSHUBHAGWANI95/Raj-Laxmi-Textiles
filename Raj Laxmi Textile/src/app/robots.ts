import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/flags";

/**
 * In prototype mode this is a hard disallow-all. The site carries placeholder
 * imagery and indicative rates; having those indexed as the business's real
 * prices would be a commercial problem to unwind.
 */
export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/styleguide"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
