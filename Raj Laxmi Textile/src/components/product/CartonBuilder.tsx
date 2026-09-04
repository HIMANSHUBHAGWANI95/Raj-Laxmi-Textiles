"use client";

/**
 * Mixed carton builder.
 *
 * State lives entirely in the URL (`?d=slug:qty,slug:qty&cap=200`), so a buyer
 * can copy the address bar and send the configuration to a colleague and it
 * arrives intact. There is no cart, no checkout and no payment — the output is
 * a WhatsApp message and a pre-filled enquiry.
 */

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { GST_RATE } from "@/lib/pricing";
import { formatQuantity, formatRupees, formatRupeesExact } from "./currency";
import { EnquiryForm } from "@/components/site/EnquiryForm";

export type CartonDesign = {
  slug: string;
  name: string;
  code: string;
  sizeLabel: string;
  bands: Array<{ minQty: number; pricePerPiece: number }>;
  moq: number;
};

type Line = { slug: string; qty: number };

const DEFAULT_CAPACITY = 200;

/** Highest band the quantity reaches, or null below the design's minimum. */
function bandFor(design: CartonDesign, qty: number) {
  if (qty < design.moq) return null;
  let applicable = null as CartonDesign["bands"][number] | null;
  for (const band of design.bands) if (qty >= band.minQty) applicable = band;
  return applicable;
}

function parseLines(raw: string | null): Line[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((part) => {
      const [slug, qty] = part.split(":");
      const n = Number.parseInt(qty ?? "", 10);
      return slug && Number.isFinite(n) && n > 0 ? { slug, qty: n } : null;
    })
    .filter((l): l is Line => l !== null);
}

function serialiseLines(lines: Line[]) {
  return lines.map((l) => `${l.slug}:${l.qty}`).join(",");
}

export function CartonBuilder({
  designs,
  whatsappBase,
  showPrices,
}: {
  designs: CartonDesign[];
  whatsappBase: string;
  showPrices: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const lines = parseLines(searchParams.get("d"));
  const capacity = Math.max(
    1,
    Number.parseInt(searchParams.get("cap") ?? "", 10) || DEFAULT_CAPACITY,
  );

  const byslug = React.useMemo(
    () => new Map(designs.map((d) => [d.slug, d])),
    [designs],
  );

  /** Every mutation goes through the URL — that is the whole state store. */
  const update = React.useCallback(
    (nextLines: Line[], nextCapacity = capacity) => {
      const params = new URLSearchParams();
      const serialised = serialiseLines(nextLines);
      if (serialised) params.set("d", serialised);
      if (nextCapacity !== DEFAULT_CAPACITY) params.set("cap", String(nextCapacity));
      const qs = params.toString();
      router.replace(qs ? `/carton?${qs}` : "/carton", { scroll: false });
    },
    [capacity, router],
  );

  const [pending, setPending] = React.useState(designs[0]?.slug ?? "");

  const rows = lines
    .map((line) => {
      const design = byslug.get(line.slug);
      if (!design) return null;
      const band = bandFor(design, line.qty);
      const rate = band?.pricePerPiece ?? null;
      return {
        ...line,
        design,
        band,
        rate,
        lineTotal: rate === null ? null : rate * line.qty,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const pieces = rows.reduce((sum, r) => sum + r.qty, 0);
  const priced = rows.every((r) => r.lineTotal !== null);
  const subtotal = rows.reduce((sum, r) => sum + (r.lineTotal ?? 0), 0);
  const gst = subtotal * GST_RATE;
  const fill = Math.min(100, Math.round((pieces / capacity) * 100));

  const messageLines = [
    "Mixed carton enquiry from the website.",
    "",
    ...rows.map((r) => {
      const base = `${r.design.name} (${r.design.code}), ${r.design.sizeLabel} — ${formatQuantity(r.qty)} pcs`;
      return showPrices && r.rate !== null
        ? `${base} @ ${formatRupees(r.rate)} = ${formatRupees(r.lineTotal ?? 0)}`
        : base;
    }),
    "",
    `Total pieces: ${formatQuantity(pieces)}`,
    ...(showPrices && priced && rows.length > 0
      ? [
          `Subtotal: ${formatRupees(subtotal)}`,
          `GST at 5%: ${formatRupeesExact(gst)}`,
          `Grand total: ${formatRupeesExact(subtotal + gst)}`,
        ]
      : []),
    "",
    "Please confirm rates and a despatch date.",
  ];

  const message = messageLines.join("\n");
  const whatsappHref = `${whatsappBase}?text=${encodeURIComponent(message)}`;

  const addPending = () => {
    const design = byslug.get(pending);
    if (!design) return;
    const existing = lines.find((l) => l.slug === pending);
    const next = existing
      ? lines.map((l) => (l.slug === pending ? { ...l, qty: l.qty + design.moq } : l))
      : [...lines, { slug: pending, qty: design.moq }];
    update(next);
  };

  return (
    <>
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-14">
      <div>
        {/* Add a design */}
        <div className="flex flex-wrap items-end gap-4 border border-ink/15 bg-sand p-5">
          <div className="min-w-56 flex-1">
            <label htmlFor="carton-design" className="block text-14 text-ink/70">
              Design
            </label>
            <select
              id="carton-design"
              value={pending}
              onChange={(e) => setPending(e.target.value)}
              className="mt-1 w-full rounded-[2px] border border-ink/25 bg-ivory px-3 py-2 text-16 text-ink focus-visible:border-marigold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marigold"
            >
              {designs.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name} ({d.code}), {d.sizeLabel}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={addPending}
            className="min-h-11 rounded-[2px] bg-indigo-600 px-5 text-16 font-semibold text-ivory hover:bg-indigo-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
          >
            Add to carton
          </button>
        </div>

        {/* Lines */}
        {rows.length === 0 ? (
          <p className="mt-8 text-18 text-ink/70">
            Nothing in the carton yet. Add a design above — the minimum for each is
            its own MOQ, and you can change the quantity after adding.
          </p>
        ) : (
          <table className="mt-8 w-full border-collapse text-16">
            <caption className="sr-only">Designs in this carton</caption>
            <thead>
              <tr className="text-14 text-ink/70">
                <th scope="col" className="border-b border-ink/15 py-2 pr-4 text-left font-normal">
                  Design
                </th>
                <th scope="col" className="border-b border-ink/15 py-2 pr-4 text-left font-normal">
                  Pieces
                </th>
                <th scope="col" className="border-b border-ink/15 py-2 pr-4 text-left font-normal">
                  Tier
                </th>
                {showPrices ? (
                  <th scope="col" className="border-b border-ink/15 py-2 pr-4 text-right font-normal">
                    Line total
                  </th>
                ) : null}
                <th scope="col" className="border-b border-ink/15 py-2 text-right font-normal">
                  <span className="sr-only">Remove</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.slug}>
                  <td className="border-b border-ink/10 py-3 pr-4">
                    <span className="block text-ink">{row.design.name}</span>
                    <span className="block text-14 text-ink/70">
                      {row.design.code}, {row.design.sizeLabel}
                    </span>
                  </td>
                  <td className="border-b border-ink/10 py-3 pr-4">
                    <label className="sr-only" htmlFor={`qty-${row.slug}`}>
                      Pieces of {row.design.name}
                    </label>
                    <input
                      id={`qty-${row.slug}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      value={row.qty}
                      onChange={(e) => {
                        const n = Number.parseInt(e.target.value, 10);
                        const next = Number.isFinite(n) && n > 0
                          ? lines.map((l) => (l.slug === row.slug ? { ...l, qty: n } : l))
                          : lines.filter((l) => l.slug !== row.slug);
                        update(next);
                      }}
                      className="w-24 rounded-[2px] border border-ink/25 bg-ivory px-2 py-1.5 text-16 tabular-nums text-ink focus-visible:border-marigold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marigold"
                    />
                  </td>
                  <td className="border-b border-ink/10 py-3 pr-4 text-14 text-ink/70">
                    {row.band
                      ? `${formatQuantity(row.band.minQty)}+ tier`
                      : `below ${formatQuantity(row.design.moq)} minimum`}
                  </td>
                  {showPrices ? (
                    <td className="border-b border-ink/10 py-3 pr-4 text-right tabular-nums text-ink">
                      {row.lineTotal === null ? "—" : formatRupees(row.lineTotal)}
                    </td>
                  ) : null}
                  <td className="border-b border-ink/10 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => update(lines.filter((l) => l.slug !== row.slug))}
                      className="rounded-[2px] px-2 py-1 text-14 text-madder underline decoration-2 underline-offset-[4px] hover:decoration-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
                    >
                      Remove
                      <span className="sr-only"> {row.design.name} from the carton</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <aside className="border border-ink/15 bg-sand p-5">
        <h2 className="text-18 font-semibold text-ink">This carton</h2>

        <div className="mt-4">
          <label htmlFor="carton-cap" className="block text-14 text-ink/70">
            Carton capacity (pieces)
          </label>
          <input
            id="carton-cap"
            type="number"
            inputMode="numeric"
            min={1}
            step={10}
            value={capacity}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10);
              update(lines, Number.isFinite(n) && n > 0 ? n : DEFAULT_CAPACITY);
            }}
            className="mt-1 w-28 rounded-[2px] border border-ink/25 bg-ivory px-2 py-1.5 text-16 tabular-nums text-ink focus-visible:border-marigold focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marigold"
          />
        </div>

        <p className="mt-5 text-16 text-ink">
          {formatQuantity(pieces)} of {formatQuantity(capacity)} pieces
        </p>
        <div
          role="progressbar"
          aria-valuenow={fill}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Carton fill"
          className="mt-2 h-3 w-full border border-ink/20 bg-ivory"
        >
          <div
            className={cn("h-full", fill >= 100 ? "bg-leaf" : "bg-indigo-600")}
            style={{ width: `${fill}%` }}
          />
        </div>
        <p className="mt-2 text-14 text-ink/70">
          {fill >= 100
            ? "Carton full. Anything more starts a second carton."
            : `${formatQuantity(Math.max(0, capacity - pieces))} pieces to fill the carton.`}
        </p>

        {showPrices && rows.length > 0 ? (
          <dl className="mt-6 space-y-1 border-t border-ink/15 pt-4 text-16">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/70">Subtotal</dt>
              <dd className="tabular-nums text-ink">{formatRupees(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/70">GST at {GST_RATE * 100}%</dt>
              <dd className="tabular-nums text-ink/70">{formatRupeesExact(gst)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-ink/20 pt-1">
              <dt className="font-semibold text-ink">Grand total</dt>
              <dd className="tabular-nums font-semibold text-indigo-600">
                {formatRupeesExact(subtotal + gst)}
              </dd>
            </div>
          </dl>
        ) : null}

        {!showPrices ? (
          <p className="mt-6 border-t border-ink/15 pt-4 text-16 text-ink/70">
            Rates on enquiry
          </p>
        ) : null}

        <a
          href={whatsappHref}
          className={cn(
            "mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[2px] px-5 text-16 font-semibold text-ivory transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold",
            rows.length > 0
              ? "bg-madder hover:bg-[#822323]"
              : "pointer-events-none bg-ink/25",
          )}
          aria-disabled={rows.length === 0}
        >
          Send this carton to us
        </a>

        <p className="mt-3 text-14 text-ink/70">
          The address bar holds this carton. Copy it to send the configuration to a
          colleague.
        </p>
      </aside>
    </div>

    {/* The same list, pre-filled, for buyers who would rather email than message. */}
    <div className="mt-16 border-t-2 border-marigold pt-10">
      <h2 className="text-22 text-indigo-600">Or send it as an enquiry</h2>
      <p className="measure mt-2 text-16 text-ink/70">
        The carton above is already written into the message. Add anything else we
        should know before you send it.
      </p>
      <div className="mt-6 max-w-3xl">
        <EnquiryForm defaultMessage={rows.length > 0 ? message : ""} />
      </div>
    </div>
    </>
  );
}
