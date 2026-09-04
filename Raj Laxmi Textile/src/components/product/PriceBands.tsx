/**
 * The quantity ladder, as a wholesale rate card.
 *
 * The volume tier carries the emphasis, not the entry tier — the point of the
 * table is to show what buying more is worth.
 */

import { cn } from "@/lib/utils";
import { RATES_ON_ENQUIRY, SHOW_PRICES } from "@/lib/flags";
import type { Product } from "@/lib/products";
import { formatQuantity, formatRupees } from "./currency";

export function PriceBands({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  if (!SHOW_PRICES) {
    return (
      <div className={className}>
        <p className="text-18 text-ink/70">{RATES_ON_ENQUIRY}</p>
      </div>
    );
  }

  const lastIndex = product.priceBands.length - 1;

  return (
    <div className={className}>
      <table className="w-full border-collapse text-16">
        <caption className="sr-only">
          Quantity bands for {product.name}, rate per piece
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="border-b border-ink/15 py-2 pr-8 text-left text-14 font-normal text-ink/70"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="border-b border-ink/15 py-2 text-right text-14 font-normal text-ink/70"
            >
              Per piece
            </th>
          </tr>
        </thead>
        <tbody>
          {product.priceBands.map((band, index) => {
            const isVolume = index === lastIndex;
            return (
              <tr key={band.minQty}>
                <td
                  className={cn(
                    "border-b border-ink/10 py-2 pr-8",
                    isVolume ? "text-ink" : "text-ink/70",
                  )}
                >
                  {formatQuantity(band.minQty)}
                  {isVolume ? " and above" : "+"}
                </td>
                <td
                  className={cn(
                    "border-b border-ink/10 py-2 text-right tabular-nums",
                    isVolume ? "font-semibold text-indigo-600" : "text-ink/70",
                  )}
                >
                  {formatRupees(band.pricePerPiece)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="mt-3 text-14 text-ink/70">
        {product.priceNote}. Rates indicative and confirmed on enquiry.
      </p>
    </div>
  );
}

/** Indicative retail, as margin context. Renders nothing without an mrp. */
export function IndicativeRetail({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  if (!SHOW_PRICES || !product.mrp) return null;

  return (
    <p className={cn("text-14 text-ink/70", className)}>
      Typical retail: {formatRupees(product.mrp)}
    </p>
  );
}
