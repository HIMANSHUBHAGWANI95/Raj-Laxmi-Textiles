/**
 * Read helpers over the content layer.
 *
 * These return numbers and data, never formatted price strings. Formatting a
 * price is the job of the gated Price components in
 * src/components/site/Price.tsx — see src/lib/flags.ts.
 */

import {
  CATEGORY_LABELS,
  PRODUCTS,
  type PriceBand,
  type Product,
  type ProductCategory,
} from "./products";
import { colourwaysInSet, type Colourway } from "./colourways";

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function requireProduct(slug: string): Product {
  const product = getProduct(slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
}

export function productsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** Categories in display order, each with the products in it. */
export function groupedByCategory(): Array<{
  category: ProductCategory;
  label: string;
  products: Product[];
}> {
  return (Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    products: productsByCategory(category),
  }));
}

export function productColourways(product: Product): Colourway[] {
  return colourwaysInSet(product.colourwaySet);
}

/** The lowest per-piece rate a product reaches, i.e. its largest band. */
export function bestBand(product: Product): PriceBand {
  return product.priceBands[product.priceBands.length - 1];
}

/** The rate at the minimum order quantity. */
export function entryBand(product: Product): PriceBand {
  return product.priceBands[0];
}

export function moq(product: Product): number {
  return entryBand(product).minQty;
}

/** Indicative margin against MRP at the entry band, as a multiple. */
export function mrpMultiple(product: Product): number | null {
  if (!product.mrp) return null;
  return product.mrp / entryBand(product).pricePerPiece;
}
