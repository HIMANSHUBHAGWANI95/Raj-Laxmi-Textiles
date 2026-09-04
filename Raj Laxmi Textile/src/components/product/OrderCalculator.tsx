"use client";

/**
 * Order-value calculator.
 *
 * The most useful thing on the page for a working buyer: pick a size, type a
 * quantity, read the total, send it. Quiet by design — one row on desktop, no
 * animation, no reveal.
 *
 * Only ever mounted when SHOW_PRICES is true; the server page decides.
 */

import * as React from "react";
import type { PriceBand } from "@/lib/products";
import { GST_RATE, minimumOrder, nextBand, orderTotals } from "@/lib/pricing";
import { formatQuantity, formatRupees, formatRupeesExact } from "./currency";

export type CalculatorOption = {
  slug: string;
  name: string;
  sizeLabel: string;
  /** What the select shows — includes the design name when sizes collide. */
  optionLabel: string;
  priceBands: PriceBand[];
};

export function OrderCalculator({
  options,
  initialSlug,
  whatsappBase,
}: {
  options: CalculatorOption[];
  initialSlug: string;
  /** wa.me link without the text parameter. */
  whatsappBase: string;
}) {
  const [slug, setSlug] = React.useState(initialSlug);
  const selected = options.find((o) => o.slug === slug) ?? options[0];

  const moq = minimumOrder(selected);
  const [quantity, setQuantity] = React.useState<string>(String(moq));

  const parsed = Number.parseInt(quantity, 10);
  const qty = Number.isFinite(parsed) ? parsed : 0;

  const totals = orderTotals(selected, qty);
  const upgrade = totals ? nextBand(selected, qty) : null;

  const message = totals
    ? [
        `Enquiry from the website.`,
        `Design: ${selected.name} (${selected.sizeLabel})`,
        `Quantity: ${formatQuantity(totals.quantity)} pieces`,
        `Rate: ${formatRupees(totals.ratePerPiece)} per piece`,
        `Subtotal: ${formatRupees(totals.subtotal)}`,
        `GST at 5%: ${formatRupeesExact(totals.gst)}`,
        `Total: ${formatRupeesExact(totals.total)}`,
        ``,
        `Please confirm availability and rates.`,
      ].join("\n")
    : `Enquiry from the website. Please send rates for ${selected.name} (${selected.sizeLabel}).`;

  const href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
  const quantityId = React.useId();
  const sizeId = React.useId();

  return (
    <section
      aria-labelledby={`${quantityId}-heading`}
      className="border border-ink/15 bg-sand p-5"
    >
      <h3 id={`${quantityId}-heading`} className="text-16 font-semibold text-ink">
        Work out an order
      </h3>

      <div className="mt-4 grid gap-4 md:grid-cols-[7rem_minmax(0,1fr)_auto_auto] md:items-end md:gap-5">
        <div>
          <label htmlFor={quantityId} className="block text-14 text-ink/70">
            Quantity
          </label>
          <input
            id={quantityId}
            type="number"
            inputMode="numeric"
            min={moq}
            step={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="mt-1 w-full rounded-[2px] border border-ink/25 bg-ivory px-3 py-2 text-16 tabular-nums text-ink outline-none focus-visible:border-marigold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marigold"
          />
        </div>

        <div>
          <label htmlFor={sizeId} className="block text-14 text-ink/70">
            Size
          </label>
          <select
            id={sizeId}
            value={selected.slug}
            onChange={(event) => setSlug(event.target.value)}
            className="mt-1 w-full rounded-[2px] border border-ink/25 bg-ivory px-3 py-2 text-16 text-ink outline-none focus-visible:border-marigold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marigold"
          >
            {options.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.optionLabel}
              </option>
            ))}
          </select>
        </div>

        <dl className="text-14 md:min-w-52">
          {totals ? (
            <>
              <div className="flex justify-between gap-6">
                <dt className="text-ink/70">
                  {formatQuantity(totals.quantity)} x{" "}
                  {formatRupees(totals.ratePerPiece)}
                </dt>
                <dd className="tabular-nums text-ink">
                  {formatRupees(totals.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-ink/70">GST at {GST_RATE * 100}%</dt>
                <dd className="tabular-nums text-ink/70">
                  {formatRupeesExact(totals.gst)}
                </dd>
              </div>
              <div className="mt-1 flex justify-between gap-6 border-t border-ink/20 pt-1">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="tabular-nums font-semibold text-indigo-600">
                  {formatRupeesExact(totals.total)}
                </dd>
              </div>
            </>
          ) : (
            <p className="text-ink/70">
              Minimum order is {formatQuantity(moq)} pieces.
            </p>
          )}
        </dl>

        <a
          href={href}
          className="inline-flex min-h-11 items-center justify-center rounded-[2px] bg-indigo-600 px-5 text-16 font-semibold text-ivory transition-colors hover:bg-indigo-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          Send this to us
        </a>
      </div>

      {upgrade ? (
        <p className="mt-4 text-14 text-ink/60">
          {formatQuantity(upgrade.piecesAway)} more pieces reaches{" "}
          {formatRupees(upgrade.band.pricePerPiece)} per piece.
        </p>
      ) : null}
    </section>
  );
}
