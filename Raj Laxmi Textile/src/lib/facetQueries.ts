/**
 * Which products belong to which facet value.
 *
 * The rate facet is derived rather than stored: it reads the entry rate (the
 * per-piece rate at minimum order), so a product cannot drift out of its band
 * when the rate card is replaced.
 */

import { FACET_GROUPS, type FacetGroup, type FacetValue } from "@/content/facets";
import { PRODUCTS, type Product } from "./products";
import { entryBand } from "./content";

/** Inclusive lower bound, exclusive upper — keeps the labels round numbers. */
const RATE_BOUNDS: Record<string, [number, number]> = {
  "under-200": [0, 200],
  "200-300": [200, 300],
  "300-400": [300, 400],
  "above-400": [400, Number.POSITIVE_INFINITY],
};

export function productInFacet(
  product: Product,
  groupId: string,
  valueSlug: string,
): boolean {
  switch (groupId) {
    case "print":
      return product.facets.print === valueSlug;
    case "fabric":
      return product.facets.fabric.includes(valueSlug);
    case "size":
      return product.facets.size.includes(valueSlug);
    case "use":
      return product.facets.use.includes(valueSlug);
    case "rate": {
      const bounds = RATE_BOUNDS[valueSlug];
      if (!bounds) return false;
      const rate = entryBand(product).pricePerPiece;
      return rate >= bounds[0] && rate < bounds[1];
    }
    default:
      return false;
  }
}

export function productsInFacet(groupId: string, valueSlug: string): Product[] {
  return PRODUCTS.filter((p) => productInFacet(p, groupId, valueSlug));
}

export function facetCount(groupId: string, valueSlug: string): number {
  return productsInFacet(groupId, valueSlug).length;
}

/** Every group/value pair that has at least one product. */
export function populatedFacetPairs(): Array<{
  group: FacetGroup;
  value: FacetValue;
  count: number;
}> {
  const pairs: Array<{ group: FacetGroup; value: FacetValue; count: number }> = [];

  for (const group of FACET_GROUPS) {
    for (const value of group.values) {
      const count = facetCount(group.id, value.slug);
      if (count > 0) pairs.push({ group, value, count });
    }
  }

  return pairs;
}

/**
 * Two sibling values from the same group, for the cross-links at the foot of
 * every facet page. Picks the next populated siblings, wrapping around.
 */
export function siblingFacets(
  group: FacetGroup,
  currentSlug: string,
  howMany = 2,
): FacetValue[] {
  const populated = group.values.filter((v) => facetCount(group.id, v.slug) > 0);
  const index = populated.findIndex((v) => v.slug === currentSlug);
  if (index === -1) return populated.slice(0, howMany);

  const siblings: FacetValue[] = [];
  for (let i = 1; siblings.length < howMany && i < populated.length; i += 1) {
    siblings.push(populated[(index + i) % populated.length]);
  }
  return siblings;
}

/**
 * The facet values a given product belongs to, for its detail page.
 *
 * `includePriced` must be false wherever SHOW_PRICES is off: the rate group's
 * labels carry rupee figures and its routes 404 when rates are withheld, so
 * leaving it in both leaks a price and creates a dead link.
 */
export function facetsForProduct(product: Product, includePriced = true) {
  return FACET_GROUPS.filter((group) => includePriced || !group.pricedOnly).flatMap((group) =>
    group.values
      .filter((value) => productInFacet(product, group.id, value.slug))
      .map((value) => ({ group, value })),
  );
}
