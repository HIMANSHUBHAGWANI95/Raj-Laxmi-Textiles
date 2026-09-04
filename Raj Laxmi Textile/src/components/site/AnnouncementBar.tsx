"use client";

/**
 * Cycles two or three short trade lines above the nav.
 *
 * The register is the Hinglish a Jaipur wholesaler actually speaks — "bulk mein
 * rate", "sample bhijwa denge" — but each line is built so an English-only
 * buyer still gets the meaning from context. No discount claims, no urgency,
 * no counts: just what the unit does.
 */

import * as React from "react";
import { XIcon } from "lucide-react";
import { BUSINESS, formatPhone, telHref } from "@/lib/constants";

const LINES = [
  "Seedha factory se — printed, cut and hemmed in our own unit at Jaipur.",
  "Bulk mein rate kam. Fifty pieces minimum, mixed colourways allowed.",
  "Sample chahiye? Ek hafte mein bhijwa denge — sampling takes about a week.",
];

const INTERVAL_MS = 6000;

export function AnnouncementBar() {
  const [index, setIndex] = React.useState(0);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (dismissed) return;
    // Respect a reduced-motion preference by holding on the first line.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % LINES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="border-b border-ivory/12 bg-indigo-900">
      <div className="mx-auto flex w-full max-w-site items-center gap-4 px-6 py-2 md:px-12">
        {/* Polite: the line changes on its own, so it must not interrupt. */}
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-14 text-ivory/80">
          {LINES[index]}
        </p>

        <a
          href={telHref}
          className="hidden shrink-0 text-14 text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4 sm:inline"
        >
          {formatPhone()}
        </a>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={`Dismiss announcements from ${BUSINESS.name}`}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-[2px] text-ivory/60 transition-colors hover:bg-ivory/10 hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
