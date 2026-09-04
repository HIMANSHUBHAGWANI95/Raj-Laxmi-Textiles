/**
 * Read helpers over the content layer.
 *
 * These return numbers and data, never formatted price strings. Formatting a
 * price is the job of the gated Price components in
 * src/components/site/Price.tsx — see src/lib/flags.ts.
 */

import { PRODUCTS, type PriceBand, type Product, type PrintFacet } from "./products";
import { FACET_GROUPS } from "@/content/facets";
import { colourwaysInSet, type Colourway } from "./colourways";

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function requireProduct(slug: string): Product {
  const product = getProduct(slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return product;
}

export function productsByPrint(print: PrintFacet): Product[] {
  return PRODUCTS.filter((p) => p.facets.print === print);
}

/** The label for a print family, taken from the facet definitions. */
export function printLabel(print: PrintFacet): string {
  const group = FACET_GROUPS.find((g) => g.id === "print");
  return group?.values.find((v) => v.slug === print)?.label ?? print;
}

/** Print families in facet order, each with the products in it. */
export function groupedByPrint(): Array<{
  print: PrintFacet;
  label: string;
  products: Product[];
}> {
  const group = FACET_GROUPS.find((g) => g.id === "print");
  if (!group) return [];

  return group.values
    .map((value) => ({
      print: value.slug as PrintFacet,
      label: value.label,
      products: productsByPrint(value.slug as PrintFacet),
    }))
    .filter((entry) => entry.products.length > 0);
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
