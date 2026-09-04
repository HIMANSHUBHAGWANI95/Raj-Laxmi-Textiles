/**
 * Pure pricing arithmetic. Numbers only — no strings, no formatting, no flag
 * checks. Formatting lives in the gated components under
 * src/components/product/.
 */

import type { PriceBand, Product } from "./products";

/**
 * Anything with a quantity ladder. Kept narrower than Product so the client
 * calculator can be handed just the bands rather than the whole record.
 */
export type PricedItem = Pick<Product, "priceBands">;

/** GST on cotton made-ups at the time of writing. Confirm before going live. */
export const GST_RATE = 0.05;

/** The minimum order quantity, i.e. the quantity of the first band. */
export function minimumOrder(product: PricedItem): number {
  return product.priceBands[0].minQty;
}

/**
 * The band that applies at `quantity`: the highest band whose minQty the
 * quantity reaches. Returns null below the minimum order.
 */
export function bandForQuantity(product: PricedItem, quantity: number): PriceBand | null {
  if (!Number.isFinite(quantity) || quantity < minimumOrder(product)) return null;

  let applicable: PriceBand | null = null;
  for (const band of product.priceBands) {
    if (quantity >= band.minQty) applicable = band;
  }
  return applicable;
}

/** The next band up, and how many more pieces would unlock it. */
export function nextBand(
  product: PricedItem,
  quantity: number,
): { band: PriceBand; piecesAway: number } | null {
  for (const band of product.priceBands) {
    if (quantity < band.minQty) {
      return { band, piecesAway: band.minQty - quantity };
    }
  }
  return null;
}

export type OrderTotals = {
  quantity: number;
  band: PriceBand;
  ratePerPiece: number;
  subtotal: number;
  gst: number;
  total: number;
};

/** Order arithmetic at `quantity`, or null below the minimum order. */
export function orderTotals(product: PricedItem, quantity: number): OrderTotals | null {
  const band = bandForQuantity(product, quantity);
  if (!band) return null;

  const subtotal = band.pricePerPiece * quantity;
  const gst = subtotal * GST_RATE;

  return {
    quantity,
    band,
    ratePerPiece: band.pricePerPiece,
    subtotal,
    gst,
    total: subtotal + gst,
  };
}

/** The best per-piece rate a product reaches, and the quantity that unlocks it. */
export function volumeBand(product: PricedItem): PriceBand {
  return product.priceBands[product.priceBands.length - 1];
}

/* ------------------------------------------------------------------ *
 * Rate-band filters for the collections grid
 * ------------------------------------------------------------------ */

export type RateBandValue = "all" | "under-200" | "200-350" | "over-350";

export type RateBandFilter = {
  value: RateBandValue;
  /** Inclusive lower bound, or null for open-ended. */
  min: number | null;
  /** Inclusive upper bound, or null for open-ended. */
  max: number | null;
};

/** Thresholds only — the labels are formatted in components/product/. */
export const RATE_BAND_FILTERS: RateBandFilter[] = [
  { value: "all", min: null, max: null },
  { value: "under-200", min: null, max: 200 },
  { value: "200-350", min: 200, max: 350 },
  { value: "over-350", min: 350, max: null },
];

/**
 * An open-ended bound is exclusive ("under 200" means below 200); a closed
 * range is inclusive at both ends. This keeps the labels round numbers.
 */
export function matchesRateBand(rate: number, filter: RateBandFilter): boolean {
  const { min, max } = filter;
  if (min === null && max === null) return true;
  if (min === null) return rate < (max as number);
  if (max === null) return rate > min;
  return rate >= min && rate <= max;
}
