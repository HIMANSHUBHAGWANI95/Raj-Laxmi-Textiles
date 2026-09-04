"use client";

/**
 * Says plainly that this is a preview build.
 *
 * It renders as the first row inside the fixed header, above the nav row,
 * rather than as its own fixed layer. That way it can never overlap the nav,
 * and dismissing it changes nothing in the document flow — no page content is
 * offset by it, so nothing below moves.
 *
 * Dismissal is deliberately held in component state only, with no storage
 * behind it. It survives client-side navigation (this lives in the root
 * layout) but any reload brings the notice back. Nobody gets to permanently
 * dismiss the fact that the rates on screen are indicative.
 */

import * as React from "react";
import { XIcon } from "lucide-react";
import { PROTOTYPE } from "@/lib/flags";

export function PrototypeBanner() {
  const [dismissed, setDismissed] = React.useState(false);

  if (!PROTOTYPE || dismissed) return null;

  return (
    <div className="border-b border-ivory/15 bg-indigo-900">
      <div className="mx-auto flex w-full max-w-site items-center gap-4 px-6 py-2 md:px-12">
        <p className="text-14 text-ivory/85">
          <span className="font-semibold text-ivory">Preview build.</span>{" "}
          Imagery is placeholder artwork and rates are indicative — final rates
          are confirmed on enquiry.
        </p>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss preview notice"
          className="ml-auto inline-flex size-7 shrink-0 items-center justify-center rounded-[2px] text-ivory/70 transition-colors hover:bg-ivory/10 hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
        >
          <XIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
