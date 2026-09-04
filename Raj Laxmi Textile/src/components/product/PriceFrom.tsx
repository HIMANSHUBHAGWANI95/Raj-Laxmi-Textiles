/**
 * The compact price for cards and grids. Always Public Sans — a rate is
 * information, not a headline, and never takes the display face.
 */

import { cn } from "@/lib/utils";
import { RATES_ON_ENQUIRY, SHOW_PRICES } from "@/lib/flags";
import { volumeBand } from "@/lib/pricing";
import type { Product } from "@/lib/products";
import { formatQuantity, formatRupees } from "./currency";

export function PriceFrom({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  if (!SHOW_PRICES) {
    return (
      <p className={cn("font-sans text-16 text-ink/70", className)}>
        {RATES_ON_ENQUIRY}
      </p>
    );
  }

  const band = volumeBand(product);

  return (
    <p className={cn("font-sans text-16 text-ink", className)}>
      <span className="tabular-nums">{formatRupees(band.pricePerPiece)}</span>
      <span className="text-ink/60">
        {" "}
        per piece at {formatQuantity(band.minQty)}+
      </span>
    </p>
  );
}
