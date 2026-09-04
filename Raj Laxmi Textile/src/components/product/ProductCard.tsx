"use client";

/**
 * Catalogue card at trade density.
 *
 * The image swaps to the border detail on hover or focus, and the colourway
 * squares swap it in place — no navigation, no reload. Everything shown is
 * either a specification or a commercial term. There is deliberately no
 * rating, review count, stock counter or savings badge: we have no review
 * history and no verified numbers, and inventing them on a manufacturer's site
 * is worse than showing nothing.
 */

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import type { ResolvedImage } from "@/lib/images";

export type CardColourway = {
  slug: string;
  name: string;
  tradeName: string;
  field: string;
  flat: ResolvedImage;
  detail: ResolvedImage;
};

export type ProductCardData = {
  slug: string;
  name: string;
  code: string;
  href: string;
  /** "Sanganeri on pure cotton 60x60" */
  printLine: string;
  /** Two chips, both off the spec sheet. */
  chips: [string, string];
  sizeRange: string;
  moqLine: string;
  /** Pre-formatted by the gated price components, or null when rates are off. */
  rateLine: string | null;
  retailLine: string | null;
  colourways: CardColourway[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const [colourwayIndex, setColourwayIndex] = React.useState(0);
  const [showDetail, setShowDetail] = React.useState(false);

  const colourway = product.colourways[colourwayIndex];
  const image = showDetail ? colourway.detail : colourway.flat;

  return (
    <article
      className="flex flex-col"
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
      onFocusCapture={() => setShowDetail(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setShowDetail(false);
        }
      }}
    >
      <Link href={product.href} className="group block">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          alt={`${product.name} in ${colourway.name}, ${showDetail ? "border detail" : "laid flat"}`}
          className="aspect-[4/3] w-full object-cover"
        />
        <h3 className="mt-4 text-22 text-indigo-600 underline decoration-transparent decoration-2 underline-offset-[8px] group-hover:decoration-marigold">
          {product.name}
        </h3>
      </Link>

      <p className="mt-1 text-14 text-ink/70">{product.code}</p>
      <p className="mt-2 text-16 text-ink/75">{product.printLine}</p>

      {/* Colourway squares swap the image in place. */}
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Colourways">
        {product.colourways.map((option, i) => {
          const selected = i === colourwayIndex;
          return (
            <li key={option.slug}>
              <button
                type="button"
                onClick={() => setColourwayIndex(i)}
                aria-pressed={selected}
                title={`${option.tradeName} — ${option.name}`}
                // The swatch stays 28px; the padding makes the tap area 44px.
                className="-m-1 block rounded-[2px] p-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-marigold"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "block size-7 rounded-[2px] border-2 transition-colors",
                    selected ? "border-marigold" : "border-ink/15 hover:border-ink/45",
                  )}
                  style={{ backgroundColor: option.field }}
                />
                <span className="sr-only">
                  Show {option.tradeName}, {option.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-14 text-ink/70">
        {colourway.tradeName} — {colourway.name}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {product.chips.map((chip) => (
          <li
            key={chip}
            className="inline-flex items-center rounded-[2px] border border-ink/15 px-2.5 py-1 text-14 text-ink/70"
          >
            {chip}
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-1 text-14 text-ink/70">
        <div className="flex gap-2">
          <dt className="text-ink/70">Sizes</dt>
          <dd>{product.sizeRange}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-ink/70">Minimum</dt>
          <dd>{product.moqLine}</dd>
        </div>
      </dl>

      {/* Rate and indicative retail. Retail is labelled, never struck through —
          it is margin context for the buyer, not a discount claim. */}
      <div className="mt-4 border-t border-ink/12 pt-3">
        {product.rateLine ? (
          <>
            <p className="text-16 text-ink">{product.rateLine}</p>
            {product.retailLine ? (
              <p className="mt-1 text-14 text-ink/70">{product.retailLine}</p>
            ) : null}
          </>
        ) : (
          <p className="text-16 text-ink/70">Rates on enquiry</p>
        )}
      </div>
    </article>
  );
}
