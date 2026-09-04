import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The border of a Jaipuri bedsheet, redrawn as a UI element: marigold
 * pinstripes, a leaf-green scalloped wave, a cobalt band and a column of
 * white-outlined bel-buti. The 32px cross-section is authored once in vertical
 * space; the horizontal rail is the same paths under a rotation matrix.
 */

export type RailTone = "ivory" | "sand" | "indigo";

const GROUND: Record<RailTone, string> = {
  ivory: "#FCFBF8",
  sand: "#F1EBDF",
  indigo: "#14243F",
};

/** On indigo the buti outline carries the drawing; on light grounds the fill does. */
const OUTLINE: Record<RailTone, string> = {
  ivory: "#FCFBF8",
  sand: "#FCFBF8",
  indigo: "#FCFBF8",
};

const RAIL_W = 32;
const TILE_H = 32;

/** One vertical repeat of the border rhythm, drawn in a 32 x 32 cell. */
function RailTile({ tone }: { tone: RailTone }) {
  const ground = GROUND[tone];
  const outline = OUTLINE[tone];
  const butiFill = tone === "indigo" ? "#2F5AA8" : "#3F6B39";

  return (
    <>
      <rect x="0" y="0" width={RAIL_W} height={TILE_H} fill={ground} />

      {/* two thin marigold pinstripes at the outer selvedge */}
      <rect x="0" y="0" width="1.2" height={TILE_H} fill="#E39A15" />
      <rect x="2.2" y="0" width="1.2" height={TILE_H} fill="#E39A15" />

      {/* the solid cobalt band */}
      <rect x="4.4" y="0" width="4" height={TILE_H} fill="#2F5AA8" />

      {/* leaf-green scalloped wave, one full period per tile */}
      <path
        d={`M 12.4 0
            C 9.6 4, 9.6 12, 12.4 16
            C 15.2 20, 15.2 28, 12.4 32`}
        fill="none"
        stroke="#3F6B39"
        strokeWidth="1.6"
        strokeLinecap="square"
      />

      {/* repeating bel-buti: a curved leaf spray on a short stem */}
      <g transform="translate(22.5 16)">
        <path
          d="M 0 9 L 0 1"
          stroke={butiFill}
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
        {/* left leaf */}
        <path
          d="M 0 1 C -5 -1, -5.6 -6, -0.4 -9 C 1 -5.4, 1 -2, 0 1 Z"
          fill={butiFill}
          stroke={outline}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        {/* right leaf, slightly shorter so the repeat reads as hand-cut */}
        <path
          d="M 0 1 C 4.6 -0.6, 5.2 -5.2, 0.6 -7.8 C -0.7 -4.6, -0.7 -1.6, 0 1 Z"
          fill={butiFill}
          stroke={outline}
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        {/* bud at the tip */}
        <circle cx="0.1" cy="-10.2" r="1.25" fill="#E39A15" stroke={outline} strokeWidth="0.5" />
      </g>

      {/* inner marigold pinstripe closing the border */}
      <rect x="30.4" y="0" width="1.2" height={TILE_H} fill="#E39A15" />
    </>
  );
}

/** The compact 6px rule the rail collapses to on narrow screens. */
function CompactRule({ tone, className }: { tone: RailTone; className?: string }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      className={cn("h-[6px] w-full", className)}
      preserveAspectRatio="none"
      viewBox="0 0 24 6"
      role="presentation"
    >
      <defs>
        <pattern
          id={`rule-${id}`}
          width="24"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <rect width="24" height="6" fill={GROUND[tone]} />
          <rect y="0" width="24" height="1.4" fill="#E39A15" />
          <rect y="1.8" width="24" height="2.4" fill="#2F5AA8" />
          <path
            d="M 0 5.2 C 3 3.6, 9 3.6, 12 5.2 C 15 6.8, 21 6.8, 24 5.2"
            fill="none"
            stroke="#3F6B39"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>
      <rect width="24" height="6" fill={`url(#rule-${id})`} />
    </svg>
  );
}

export type BorderRailProps = {
  orientation?: "vertical" | "horizontal";
  /** Length along the rail's running axis, in px. */
  length?: number;
  tone?: RailTone;
  /** Collapse to a 6px rule below md. Defaults to true for vertical rails. */
  responsive?: boolean;
  className?: string;
};

export function BorderRail({
  orientation = "vertical",
  length = 160,
  tone = "ivory",
  responsive = orientation === "vertical",
  className,
}: BorderRailProps) {
  const id = React.useId().replace(/:/g, "");
  const patternId = `rail-${id}`;
  const isVertical = orientation === "vertical";

  const svg = (
    <svg
      aria-hidden="true"
      role="presentation"
      width={isVertical ? RAIL_W : length}
      height={isVertical ? length : RAIL_W}
      viewBox={isVertical ? `0 0 ${RAIL_W} ${length}` : `0 0 ${length} ${RAIL_W}`}
      className={cn("block shrink-0", responsive ? "hidden md:block" : undefined, className)}
    >
      <defs>
        <pattern
          id={patternId}
          width={RAIL_W}
          height={TILE_H}
          patternUnits="userSpaceOnUse"
        >
          <RailTile tone={tone} />
        </pattern>
      </defs>
      {/* Horizontal rails reuse the vertical artwork: (x,y) -> (y, 32 - x). */}
      <g transform={isVertical ? undefined : `matrix(0 -1 1 0 0 ${RAIL_W})`}>
        <rect
          x="0"
          y="0"
          width={RAIL_W}
          height={length}
          fill={`url(#${patternId})`}
        />
      </g>
    </svg>
  );

  if (!responsive) return svg;

  return (
    <>
      {svg}
      <CompactRule tone={tone} className="md:hidden" />
    </>
  );
}
