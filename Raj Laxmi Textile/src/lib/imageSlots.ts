/**
 * The site's photographic slots.
 *
 * Each slot is a fixed shape in the layout that needs a real photograph.
 * Until one exists, a labelled placeholder stands in at exactly these
 * dimensions, so a missing photo never collapses a layout.
 *
 * Pure data — no filesystem access, so this is safe to import anywhere.
 * The brief for each slot is in ART-PROMPTS.md.
 */

export type SiteImageKey =
  | "hero-bed"
  | "craft-printing-table"
  | "craft-screens"
  | "craft-drying"
  | "craft-detail-macro"
  | "about-shop-front"
  | "about-team"
  | "wholesale-packing"
  | "og-default";

export type SiteImageSlot = {
  key: SiteImageKey;
  /** Human-readable aspect, e.g. "16:9". */
  ratio: string;
  width: number;
  height: number;
  /** What the photograph should show. Shown on the placeholder. */
  subject: string;
  /** How it should be framed, for the photographer. */
  crop: string;
};

export const SITE_IMAGE_SLOTS: SiteImageSlot[] = [
  {
    key: "hero-bed",
    ratio: "16:9",
    width: 2400,
    height: 1350,
    subject: "A made bed in a Jaipuri printed sheet",
    crop: "Bed fills the lower two-thirds, shot slightly above eye level, border panel running down the left of frame. Leave clear space top-left for the headline.",
  },
  {
    key: "craft-printing-table",
    ratio: "3:2",
    width: 1800,
    height: 1200,
    subject: "A printer pulling a screen along the printing table",
    crop: "Table running diagonally away from camera, printer mid-pull, hands and screen frame sharp. Show the length of the table.",
  },
  {
    key: "craft-screens",
    ratio: "3:2",
    width: 1800,
    height: 1200,
    subject: "Cut screens stacked or racked in the workshop",
    crop: "Screens stacked at an angle so several designs are readable at once. Workshop light, no flash.",
  },
  {
    key: "craft-drying",
    ratio: "3:2",
    width: 1800,
    height: 1200,
    subject: "Printed lengths hung or laid out to dry",
    crop: "Wide enough to show several lengths in different colourways. Daylight.",
  },
  {
    key: "craft-detail-macro",
    ratio: "1:1",
    width: 1400,
    height: 1400,
    subject: "Macro of the print surface showing registration and weave",
    crop: "Close enough to read the white outline sitting against the fill and the individual threads of the cloth.",
  },
  {
    key: "about-shop-front",
    ratio: "3:2",
    width: 1800,
    height: 1200,
    subject: "The unit's entrance at Jai Hanuman Plaza",
    crop: "Straight-on, whole frontage in shot including signage. Daylight, no people blocking the door.",
  },
  {
    key: "about-team",
    ratio: "3:2",
    width: 1800,
    height: 1200,
    subject: "The people who run the unit, at work",
    crop: "Environmental, not a lined-up group portrait. Working posture, in the unit.",
  },
  {
    key: "wholesale-packing",
    ratio: "3:2",
    width: 1800,
    height: 1200,
    subject: "Finished sheets folded and baled for dispatch",
    crop: "Stacked bales with folded sheets visible, so quantity and finish both read.",
  },
  {
    key: "og-default",
    ratio: "1.91:1",
    width: 1200,
    height: 630,
    subject: "Social share card: printed cloth, room for an overlay",
    crop: "Flat-on cloth filling frame, no important detail in the centre third where text may overlay.",
  },
];

export const SITE_IMAGE_KEYS = SITE_IMAGE_SLOTS.map((slot) => slot.key);

export function getSlot(key: SiteImageKey): SiteImageSlot {
  const slot = SITE_IMAGE_SLOTS.find((s) => s.key === key);
  if (!slot) throw new Error(`Unknown site image slot: ${key}`);
  return slot;
}

/** Intrinsic size of each generated product render. */
export const PRODUCT_IMAGE_SIZES = {
  flat: { width: 1600, height: 1200 },
  stack: { width: 1600, height: 1200 },
  detail: { width: 1200, height: 1200 },
  drape: { width: 1400, height: 1050 },
} as const;

export type ProductImageType = keyof typeof PRODUCT_IMAGE_SIZES;

/** Extensions a real asset may use, in the order they win. */
export const REAL_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
