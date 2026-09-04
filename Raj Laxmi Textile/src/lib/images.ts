/**
 * The single place that decides whether an image is a real photograph or a
 * generated placeholder.
 *
 * Real assets win. Drop a correctly named file into public/products/real/ or
 * public/site/real/ and it replaces the placeholder on the next build, with no
 * code change anywhere.
 *
 * SERVER ONLY — this reads the filesystem at render time. Every page here is a
 * server component, so that is fine. Do not import it from a "use client"
 * module; pass the resolved object down as a prop instead.
 */

import fs from "node:fs";
import path from "node:path";

import {
  PRODUCT_IMAGE_SIZES,
  REAL_IMAGE_EXTENSIONS,
  getSlot,
  type ProductImageType,
  type SiteImageKey,
} from "./imageSlots";
import type { Product } from "./products";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export type ResolvedImage = {
  /** Path to use as an <Image> src. */
  src: string;
  width: number;
  height: number;
  /** True when a real asset was found, false when a placeholder is standing in. */
  isReal: boolean;
};

/** The subset of a ResolvedImage that next/image accepts, without `isReal`. */
export function imgProps(image: ResolvedImage) {
  return { src: image.src, width: image.width, height: image.height };
}

/**
 * Look for `<base>.<ext>` in `dir` for each allowed extension.
 * Returns the public-relative path, or null.
 */
function findReal(publicRelativeDir: string, base: string): string | null {
  const dir = path.join(PUBLIC_DIR, publicRelativeDir);
  for (const ext of REAL_IMAGE_EXTENSIONS) {
    if (fs.existsSync(path.join(dir, base + ext))) {
      return `/${publicRelativeDir}/${base}${ext}`;
    }
  }
  return null;
}

/* ------------------------------------------------------------------ *
 * Product imagery
 * ------------------------------------------------------------------ */

/**
 * Real product photography is per product (a specific SKU was photographed),
 * while generated renders are per pattern, since several products share one
 * piece of artwork.
 */
export function productRealBase(
  productSlug: string,
  colourwaySlug: string,
  type: ProductImageType,
) {
  return `${productSlug}-${colourwaySlug}-${type}`;
}

export function generatedProductPath(
  patternSlug: string,
  colourwaySlug: string,
  type: ProductImageType,
) {
  return `/products/generated/${patternSlug}/${colourwaySlug}-${type}.webp`;
}

export function getProductImage(
  product: Product,
  colourwaySlug: string,
  type: ProductImageType = "flat",
): ResolvedImage {
  const size = PRODUCT_IMAGE_SIZES[type];
  const real = findReal(
    "products/real",
    productRealBase(product.slug, colourwaySlug, type),
  );

  if (real) {
    return { src: real, width: size.width, height: size.height, isReal: true };
  }

  return {
    src: generatedProductPath(product.pattern, colourwaySlug, type),
    width: size.width,
    height: size.height,
    isReal: false,
  };
}

/* ------------------------------------------------------------------ *
 * Site imagery
 * ------------------------------------------------------------------ */

export function generatedSitePath(key: SiteImageKey) {
  return `/site/generated/${key}.png`;
}

export function getSiteImage(key: SiteImageKey): ResolvedImage {
  const slot = getSlot(key);
  const real = findReal("site/real", key);

  if (real) {
    return { src: real, width: slot.width, height: slot.height, isReal: true };
  }

  return {
    src: generatedSitePath(key),
    width: slot.width,
    height: slot.height,
    isReal: false,
  };
}
