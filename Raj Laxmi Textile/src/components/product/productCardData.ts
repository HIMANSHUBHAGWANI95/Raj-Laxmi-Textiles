/**
 * Server-side builder for the catalogue card.
 *
 * Lives in this directory because it formats rate strings — the SHOW_PRICES
 * gate is enforced by keeping every rupee string inside src/components/product/.
 * It also resolves images here, since ProductCard is a client component and the
 * image resolver reads the filesystem.
 */

import { getProductImage } from "@/lib/images";
import { productColourways, entryBand, printLabel } from "@/lib/content";
import { minimumOrder } from "@/lib/pricing";
import { SHOW_PRICES } from "@/lib/flags";
import { SIZE_LABELS, SIZE_DIMENSIONS, type Product } from "@/lib/products";
import { formatQuantity, formatRupees } from "./currency";
import type { ProductCardData } from "./ProductCard";

export function toCardData(product: Product): ProductCardData {
  const colourways = productColourways(product);
  const band = entryBand(product);
  const moq = minimumOrder(product);

  return {
    slug: product.slug,
    name: product.name,
    code: product.code,
    href: `/products/${product.slug}`,
    printLine: `${printLabel(product.facets.print)} on ${product.fabric.composition.toLowerCase()} ${product.fabric.construction.toLowerCase()}`,
    chips: [`${product.fabric.gsm} GSM`, `${product.fabric.screens} colour screens`],
    sizeRange: `${SIZE_LABELS[product.size]}, ${SIZE_DIMENSIONS[product.size]}`,
    moqLine: `${formatQuantity(moq)} pieces`,
    rateLine: SHOW_PRICES
      ? `${formatRupees(band.pricePerPiece)} per piece at ${formatQuantity(moq)}`
      : null,
    retailLine:
      SHOW_PRICES && product.mrp
        ? `Indicative retail ${formatRupees(product.mrp)}`
        : null,
    colourways: colourways.map((cw) => ({
      slug: cw.slug,
      name: cw.name,
      tradeName: cw.tradeName,
      field: cw.field,
      flat: getProductImage(product, cw.slug, "flat"),
      detail: getProductImage(product, cw.slug, "detail"),
    })),
  };
}
