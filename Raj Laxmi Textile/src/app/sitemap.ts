import type { MetadataRoute } from "next";
import { ALLOW_INDEXING, SITE_URL } from "@/lib/flags";
import { PRODUCTS } from "@/lib/products";
import { populatedFacetPairs } from "@/lib/facetQueries";
import { facetHref } from "@/content/facets";

/** Empty while the site is a prototype, so nothing is offered for indexing. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!ALLOW_INDEXING) return [];

  const now = new Date();

  return [
    { url: `${SITE_URL}/`, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/collections`, lastModified: now, priority: 0.9 },
    ...populatedFacetPairs()
      .filter(({ group }) => !group.pricedOnly || ALLOW_INDEXING)
      .map(({ group, value }) => ({
        url: `${SITE_URL}${facetHref(group.slug, value.slug)}`,
        lastModified: now,
        priority: 0.7,
      })),
    ...PRODUCTS.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      lastModified: now,
      priority: 0.6,
    })),
  ];
}
