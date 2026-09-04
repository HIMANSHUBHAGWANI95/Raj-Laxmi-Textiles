"use client";

/**
 * Owns the selected colourway, so choosing a shade swaps the whole gallery in
 * place rather than navigating. Colourways are labelled by the trade name the
 * floor actually uses, with the English name alongside.
 */

import * as React from "react";

import { cn } from "@/lib/utils";
import { ProductGallery, type GalleryView } from "./ProductGallery";

export type ViewerColourway = {
  slug: string;
  name: string;
  tradeName: string;
  field: string;
  views: GalleryView[];
};

export function ProductViewer({
  colourways,
  productName,
}: {
  colourways: ViewerColourway[];
  productName: string;
}) {
  const [index, setIndex] = React.useState(0);
  const active = colourways[index];

  return (
    <div>
      {/* Remounting on colourway change resets the gallery to the flat view,
          which is the right starting point for a newly chosen shade. */}
      <ProductGallery
        key={active.slug}
        views={active.views}
        colourwayName={`${active.tradeName} — ${active.name}`}
      />

      <div className="mt-8">
        <h2 className="text-16 font-semibold text-ink">
          Colourway
          <span className="ml-2 font-normal text-ink/70">
            {active.tradeName} — {active.name}
          </span>
        </h2>

        <ul className="mt-3 flex flex-wrap gap-3">
          {colourways.map((cw, i) => {
            const selected = i === index;
            return (
              <li key={cw.slug}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-pressed={selected}
                  className={cn(
                    "flex items-center gap-2 rounded-[2px] border px-2.5 py-1.5 text-14 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold",
                    selected
                      ? "border-indigo-600 text-ink"
                      : "border-ink/15 text-ink/70 hover:border-ink/45 hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-5 rounded-[2px] border",
                      selected ? "border-marigold" : "border-ink/20",
                    )}
                    style={{ backgroundColor: cw.field }}
                  />
                  {cw.tradeName}
                  <span className="sr-only">
                    — {cw.name}, show {productName} in this colourway
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
