import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/flags";
import { PRODUCTS } from "@/lib/products";

/** Empty while the site is a prototype, so nothing is offered for indexing. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING) return [];

  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, priority: 0.8 },
    ...PRODUCTS.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
