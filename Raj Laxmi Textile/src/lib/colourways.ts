/**
 * The standing colourways, and the named sets a product can be printed in.
 * The swatch generator renders one image per pattern and colourway, so a
 * product's set decides which images exist for it.
 */

export type Colourway = {
  slug: string;
  name: string;
  /** The saturated ground the field is printed in. */
  field: string;
  /** Pinstripe colour laid over the field. */
  stripe: string;
  /** The light cloth left unprinted for the border panel. */
  panel: string;
  /** Main motif fill — the white screen pulled over the field. */
  motif: string;
  /** Secondary dye for motif centres and border detail. */
  accent: string;
};

export const COLOURWAYS: Colourway[] = [
  {
    slug: "indigo",
    name: "Indigo",
    field: "#1E3A6B",
    stripe: "#14243F",
    panel: "#F6F2E8",
    motif: "#FCFBF8",
    accent: "#E39A15",
  },
  {
    slug: "madder",
    name: "Madder Red",
    field: "#9E2B2B",
    stripe: "#7A1F1F",
    panel: "#F8F0E6",
    motif: "#FCFBF8",
    accent: "#E39A15",
  },
  {
    slug: "marigold",
    name: "Marigold",
    field: "#DE9412",
    stripe: "#B4760C",
    panel: "#FBF6EA",
    motif: "#FCFBF8",
    accent: "#3F6B39",
  },
  {
    slug: "leaf",
    name: "Leaf Green",
    field: "#3F6B39",
    stripe: "#2C4E28",
    panel: "#F4F3E6",
    motif: "#FCFBF8",
    accent: "#E39A15",
  },
  {
    slug: "cobalt",
    name: "Cobalt",
    field: "#2F5AA8",
    stripe: "#234682",
    panel: "#F2F5FA",
    motif: "#FCFBF8",
    accent: "#E39A15",
  },
];

export type ColourwaySetName = "full" | "cool" | "warm" | "indigo-pair";

/** Which colourways each set covers, in the order they are shown. */
export const COLOURWAY_SETS: Record<ColourwaySetName, string[]> = {
  full: ["indigo", "madder", "marigold", "leaf", "cobalt"],
  cool: ["indigo", "cobalt", "leaf"],
  warm: ["madder", "marigold", "leaf"],
  "indigo-pair": ["indigo", "cobalt"],
};

export function colourwayBySlug(slug: string): Colourway {
  const found = COLOURWAYS.find((c) => c.slug === slug);
  if (!found) throw new Error(`Unknown colourway: ${slug}`);
  return found;
}

export function colourwaysInSet(set: ColourwaySetName): Colourway[] {
  return COLOURWAY_SETS[set].map(colourwayBySlug);
}
