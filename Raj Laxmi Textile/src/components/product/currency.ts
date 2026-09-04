/**
 * Currency and quantity formatting for the price components.
 *
 * Only the gated components in this directory may import this. If a price
 * string appears anywhere outside src/components/product/, the SHOW_PRICES
 * flag no longer controls the whole site.
 */

const rupees = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const rupeesWithPaise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const quantities = new Intl.NumberFormat("en-IN");

/** ₹1,23,456 — Indian digit grouping, no decimals. */
export function formatRupees(value: number) {
  return rupees.format(value);
}

/** ₹1,23,456.78 — for tax lines, where rounding would not add up. */
export function formatRupeesExact(value: number) {
  return rupeesWithPaise.format(value);
}

/** 1,23,456 */
export function formatQuantity(value: number) {
  return quantities.format(value);
}
