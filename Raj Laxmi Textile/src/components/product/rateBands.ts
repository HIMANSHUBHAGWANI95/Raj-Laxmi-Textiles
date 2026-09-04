/**
 * Labels for the collections-grid rate filter.
 *
 * The thresholds live in src/lib/pricing.ts as plain numbers; the money
 * formatting happens here, so every rupee string in the codebase stays inside
 * src/components/product/ and disappears with the SHOW_PRICES flag.
 */

import { RATE_BAND_FILTERS, type RateBandFilter } from "@/lib/pricing";
import { formatRupees } from "./currency";

export function rateBandLabel(filter: RateBandFilter): string {
  if (filter.min === null && filter.max === null) return "All rates";
  if (filter.min === null) return `Under ${formatRupees(filter.max as number)}`;
  if (filter.max === null) return `Over ${formatRupees(filter.min)}`;
  return `${formatRupees(filter.min)} to ${formatRupees(filter.max)}`;
}

export const RATE_BAND_OPTIONS = RATE_BAND_FILTERS.map((filter) => ({
  value: filter.value,
  label: rateBandLabel(filter),
}));
