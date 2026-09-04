/**
 * ============================================================================
 * PLACEHOLDER PRICING — NOT SIGNED OFF.
 *
 * Every number in `priceBands`, `mrp` and every MOQ in this file is invented
 * placeholder data, written to make the prototype read like a real rate card.
 * None of it has been quoted or approved by Raj Laxmi Textiles. Replace the
 * whole table with the real rate card before this site is shown to a buyer.
 *
 * Prices are only ever rendered when NEXT_PUBLIC_PROTOTYPE === "true"
 * (see src/lib/flags.ts). See HANDOVER.md, "Prototype data".
 * ============================================================================
 *
 * A product is a catalogue item: a design, in one size, printed in a named
 * colourway set. `pattern` points at the artwork the swatch generator draws.
 */

import type { ColourwaySetName } from "./colourways";

/* -------------------------------------------------------------------- *
 * Patterns — the artwork the generator renders. One image set per
 * pattern and colourway, so several products can share a pattern.
 * -------------------------------------------------------------------- */

export type MotifName =
  | "flowerRosette"
  | "leafSpray"
  | "tulipBud"
  | "scallopRosette"
  | "belButi";

export type Pattern = {
  slug: string;
  name: string;
  /** Motifs scattered across the printed field. */
  motifs: MotifName[];
  /** Density of the motif grid across the field, in px per cell. */
  cell: number;
  /** Pinstripe pitch across the field, in px. */
  stripePitch: number;
  colourways: string[];
};

export const PATTERNS: Pattern[] = [
  {
    slug: "jaipuri-buti",
    name: "Jaipuri Buti",
    motifs: ["flowerRosette", "leafSpray"],
    cell: 330,
    stripePitch: 15,
    colourways: ["indigo", "madder", "marigold", "leaf", "cobalt"],
  },
  {
    slug: "tulip-bel",
    name: "Tulip Bel",
    motifs: ["tulipBud", "leafSpray"],
    cell: 300,
    stripePitch: 12,
    colourways: ["indigo", "madder", "marigold", "leaf", "cobalt"],
  },
  {
    slug: "sanganeri-floral",
    name: "Sanganeri Floral",
    motifs: ["flowerRosette", "tulipBud", "leafSpray"],
    cell: 380,
    stripePitch: 19,
    colourways: ["indigo", "madder", "marigold", "leaf", "cobalt"],
  },
  {
    slug: "lehariya-wave",
    name: "Lehariya Wave",
    motifs: ["scallopRosette", "flowerRosette"],
    cell: 290,
    stripePitch: 10,
    colourways: ["indigo", "madder", "marigold", "leaf", "cobalt"],
  },
];

export function patternBySlug(slug: string): Pattern {
  const found = PATTERNS.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown pattern: ${slug}`);
  return found;
}

/* -------------------------------------------------------------------- *
 * Products
 * -------------------------------------------------------------------- */

/** The print family a product belongs to — the primary taxonomy. */
export type PrintFacet =
  | "sanganeri"
  | "jaipuri-floral"
  | "bel-buti"
  | "striped-border"
  | "discharge"
  | "bagru";

/**
 * Facet tags. `print` is single-valued; the rest are arrays because a product
 * genuinely belongs under several (a 90x100 sheet is both double and queen).
 * The rate facet is not stored — it is derived from the entry rate.
 */
export type ProductFacets = {
  print: PrintFacet;
  fabric: string[];
  size: string[];
  use: string[];
};

export type ProductSize = "single" | "double-queen" | "king";

export const SIZE_LABELS: Record<ProductSize, string> = {
  single: "Single",
  "double-queen": "Double / Queen",
  king: "King",
};

export const SIZE_DIMENSIONS: Record<ProductSize, string> = {
  single: "60 x 90 in",
  "double-queen": "90 x 100 in",
  king: "108 x 108 in",
};

export const SIZE_CONTENTS: Record<ProductSize, string> = {
  single: "1 sheet + 1 pillow cover",
  "double-queen": "1 sheet + 2 pillow covers",
  king: "1 sheet + 2 pillow covers",
};

export type FabricSpec = {
  composition: string;
  construction: string;
  /** Threads per square inch, warp plus weft. */
  threadCount: number;
  gsm: number;
  print: string;
  screens: number;
  shrinkage: string;
  dyes: string;
};

/** 120 GSM standard quality. */
const STANDARD = (screens: number): FabricSpec => ({
  composition: "100% cotton",
  construction: "60 x 60 combed",
  threadCount: 120,
  gsm: 120,
  print: "Hand screen print, table printed",
  screens,
  shrinkage: "Pre-shrunk, 3–4% residual shrinkage",
  dyes: "Reactive dyes",
});

/** 144 GSM premium quality. */
const PREMIUM = (screens: number): FabricSpec => ({
  composition: "100% cotton",
  construction: "60 x 60 combed",
  threadCount: 144,
  gsm: 144,
  print: "Hand screen print, table printed",
  screens,
  shrinkage: "Pre-shrunk, 3–4% residual shrinkage",
  dyes: "Reactive dyes",
});

/** Discharge printing: the ground is dyed first, then bleached back to white. */
const DISCHARGE = (screens: number): FabricSpec => ({
  composition: "100% cotton",
  construction: "60 x 60 combed",
  threadCount: 144,
  gsm: 144,
  print: "Discharge screen print on a piece-dyed ground",
  screens,
  shrinkage: "Pre-shrunk, 3–4% residual shrinkage",
  dyes: "Reactive ground, discharge paste for the white",
});

/** Weave variants. Same cotton, different construction — see the fabric facet. */
const SATEEN = (screens: number): FabricSpec => ({
  ...PREMIUM(screens),
  construction: "Cotton sateen, 60s combed warp",
  threadCount: 210,
});

const TWILL = (screens: number): FabricSpec => ({
  ...STANDARD(screens),
  construction: "Cotton twill, 3/1 weave",
  threadCount: 144,
});

const PERCALE_STANDARD = (screens: number): FabricSpec => ({
  ...STANDARD(screens),
  construction: "Percale, close plain weave",
  threadCount: 180,
});

const PERCALE_PREMIUM = (screens: number): FabricSpec => ({
  ...PREMIUM(screens),
  construction: "Percale, close plain weave",
  threadCount: 200,
});

const DISCHARGE_TWILL = (screens: number): FabricSpec => ({
  ...DISCHARGE(screens),
  construction: "Cotton twill, 3/1 weave",
  threadCount: 152,
});

export type PriceBand = {
  /** Minimum pieces for this rate. Bands run ascending. */
  minQty: number;
  /** Placeholder rate per piece, ex-Jaipur, before GST. */
  pricePerPiece: number;
};

export type Product = {
  slug: string;
  name: string;
  /** Order code used on the rate list and the bale tag. */
  code: string;
  /** The name the design is called by on the floor. */
  nameHindi: string;
  facets: ProductFacets;
  size: ProductSize;
  /** The artwork the swatch generator draws for this product. */
  pattern: string;
  colourwaySet: ColourwaySetName;
  fabric: FabricSpec;
  /** Buyer-facing copy: hand, registration, fastness. */
  description: string;
  handNote: string;
  registrationNote: string;
  fastnessNote: string;

  // --- placeholder commercial data, see the header of this file ---
  priceBands: PriceBand[];
  mrp?: number;
  currency: "INR";
  priceNote: string;
};

const EX_JAIPUR = "Ex-Jaipur, exclusive of GST";

export const PRODUCTS: Product[] = [
  /* ---------------- Sanganeri floral (4) ---------------- */
  {
    slug: "sanganeri-booti-jaal-double",
    name: "Sanganeri Booti Jaal",
    code: "RLT-SBJ-90",
    nameHindi: "सांगानेरी बूटी जाल",
    facets: {
      print: "sanganeri",
      fabric: ["pure-cotton", "combed-60x60"],
      size: ["double", "queen"],
      use: ["retail-counter", "hotel-institutional"],
    },
    size: "double-queen",
    pattern: "sanganeri-floral",
    colourwaySet: "full",
    fabric: STANDARD(9),
    description:
      "A close floral jaal on a fine pinstriped ground, with the unprinted border left wide enough to tuck. The standing double for most of our repeat buyers.",
    handNote:
      "120 GSM 60x60 combed cotton. Crisp out of the bale and softens noticeably after two or three washes; it does not feel starched in hand.",
    registrationNote:
      "Nine screens. The white outline is pulled last, so on a close look you will see it sit a hair proud of the fill — that is the register of a hand-pulled table print, not a fault.",
    fastnessNote:
      "Reactive dyes. Expect slight lightening over the first two washes as loose dye clears, then the shade holds through normal domestic washing. Wash dark colourways separately the first time.",
    priceBands: [
      { minQty: 50, pricePerPiece: 345 },
      { minQty: 200, pricePerPiece: 320 },
      { minQty: 500, pricePerPiece: 295 },
    ],
    mrp: 949,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "sanganeri-phool-bel-single",
    name: "Sanganeri Phool Bel",
    code: "RLT-SPB-60",
    nameHindi: "सांगानेरी फूल बेल",
    facets: {
      print: "sanganeri",
      fabric: ["pure-cotton", "combed-60x60"],
      size: ["single"],
      use: ["retail-counter", "hotel-institutional"],
    },
    size: "single",
    pattern: "sanganeri-floral",
    colourwaySet: "warm",
    fabric: STANDARD(8),
    description:
      "The same floral drawing scaled down for a single bed, with a narrower border so the field carries more of the sheet.",
    handNote:
      "120 GSM 60x60 combed cotton. Light enough for summer use; the hand is smooth rather than slubby.",
    registrationNote:
      "Eight screens. The bud centres are printed on a separate screen from the petals, so a small overlap at the centre is normal across a run.",
    fastnessNote:
      "Reactive dyes. Colour holds through repeated washing at 30–40°C. Marigold grounds shift very slightly warmer after the first wash.",
    priceBands: [
      { minQty: 50, pricePerPiece: 198 },
      { minQty: 200, pricePerPiece: 182 },
      { minQty: 500, pricePerPiece: 168 },
    ],
    mrp: 549,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "sanganeri-angoor-vine-king",
    name: "Sanganeri Angoor Vine",
    code: "RLT-SAV-108",
    nameHindi: "सांगानेरी अंगूर बेल",
    facets: {
      print: "jaipuri-floral",
      fabric: ["pure-cotton", "cotton-satin"],
      size: ["king", "super-king"],
      use: ["festive-gifting", "export"],
    },
    size: "king",
    pattern: "sanganeri-floral",
    colourwaySet: "cool",
    fabric: SATEEN(11),
    description:
      "A trailing vine repeat drawn large for king sizes, where a small buti would read as noise across the width.",
    handNote:
      "144 GSM 60x60 combed cotton. Heavier and denser than our standard cloth, with more body when it drapes over a king mattress.",
    registrationNote:
      "Eleven screens, the most in the range. The vine stem crosses three screens, so registration is checked at the start of every table length.",
    fastnessNote:
      "Reactive dyes on a heavier cloth, which takes dye more evenly. Wash fastness is good; the indigo ground is the slowest to release loose dye.",
    priceBands: [
      { minQty: 50, pricePerPiece: 448 },
      { minQty: 200, pricePerPiece: 421 },
      { minQty: 500, pricePerPiece: 389 },
    ],
    mrp: 1199,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "bagru-chhoti-booti-double",
    name: "Bagru Chhoti Booti",
    code: "RLT-BCB-90",
    nameHindi: "बगरू छोटी बूटी",
    facets: {
      print: "bagru",
      fabric: ["pure-cotton", "combed-60x60"],
      size: ["double", "queen"],
      use: ["retail-counter", "export"],
    },
    size: "double-queen",
    pattern: "jaipuri-buti",
    colourwaySet: "full",
    fabric: STANDARD(8),
    description:
      "A small-scale booti in the Bagru manner: black and madder on an ochre ground, drawn slightly irregular so it reads as resist work rather than a clean screen.",
    handNote:
      "120 GSM 60x60 combed cotton, the same base as our other standard doubles. The ochre ground is piece-dyed before printing, so the cloth carries slightly more body than a white-ground sheet.",
    registrationNote:
      "Eight screens, cut deliberately loose. A true Bagru is block-printed with mud resist and never lands perfectly; the drawing here imitates that irregularity, and we do not claim it as dabu work.",
    fastnessNote:
      "Reactive dyes. Holds shade through domestic washing; avoid drying dark colourways in direct sun for long periods.",
    priceBands: [
      { minQty: 50, pricePerPiece: 328 },
      { minQty: 200, pricePerPiece: 304 },
      { minQty: 500, pricePerPiece: 281 },
    ],
    mrp: 949,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },

  /* ---------------- Striped border (3) ---------------- */
  {
    slug: "dhari-border-classic-single",
    name: "Dhari Border Classic",
    code: "RLT-DBC-60",
    nameHindi: "धारी बॉर्डर क्लासिक",
    facets: {
      print: "striped-border",
      fabric: ["pure-cotton", "percale"],
      size: ["single"],
      use: ["retail-counter", "hotel-institutional"],
    },
    size: "single",
    pattern: "lehariya-wave",
    colourwaySet: "full",
    fabric: PERCALE_STANDARD(8),
    description:
      "A plain striped field with the printed border doing all the work. The cheapest sheet we make that still uses eight screens.",
    handNote:
      "120 GSM 60x60 combed cotton. Softens quickly because the printed area is smaller and the cloth carries less paste.",
    registrationNote:
      "Eight screens. The border stripes are the tightest register in the range; the pinstripes are printed as one screen to keep them parallel.",
    fastnessNote:
      "Reactive dyes. Straightforward wash behaviour with little loose dye, as the ground is lighter than our jaal designs.",
    priceBands: [
      { minQty: 50, pricePerPiece: 186 },
      { minQty: 200, pricePerPiece: 172 },
      { minQty: 500, pricePerPiece: 158 },
    ],
    mrp: 469,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "dhari-border-wide-double",
    name: "Dhari Border Wide",
    code: "RLT-DBW-90",
    nameHindi: "धारी बॉर्डर चौड़ा",
    facets: {
      print: "striped-border",
      fabric: ["pure-cotton", "combed-60x60"],
      size: ["double", "queen"],
      use: ["retail-counter", "hotel-institutional"],
    },
    size: "double-queen",
    pattern: "lehariya-wave",
    colourwaySet: "cool",
    fabric: STANDARD(9),
    description:
      "The classic border widened for doubles, with a second scalloped wave inside the stripe block.",
    handNote:
      "120 GSM 60x60 combed cotton. Smooth hand; the wide border area is slightly stiffer than the field until it has been washed.",
    registrationNote:
      "Nine screens. The scalloped wave is printed over the stripe block, so the wave sits marginally raised where the two overlap.",
    fastnessNote:
      "Reactive dyes. Cobalt and indigo grounds release the most loose dye on the first wash; wash separately once.",
    priceBands: [
      { minQty: 50, pricePerPiece: 332 },
      { minQty: 200, pricePerPiece: 308 },
      { minQty: 500, pricePerPiece: 284 },
    ],
    mrp: 899,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "dhari-border-king",
    name: "Dhari Border King",
    code: "RLT-DBK-108",
    nameHindi: "धारी बॉर्डर किंग",
    facets: {
      print: "striped-border",
      fabric: ["pure-cotton", "twill-cotton"],
      size: ["king"],
      use: ["hotel-institutional", "export"],
    },
    size: "king",
    pattern: "lehariya-wave",
    colourwaySet: "warm",
    fabric: TWILL(9),
    description:
      "The border design at king width, where the stripe block is proportionally narrower against the field.",
    handNote:
      "120 GSM 60x60 combed cotton. At king size the lighter cloth is deliberate — it keeps the finished weight manageable.",
    registrationNote:
      "Nine screens across a wider table. Registration is re-checked mid-length because the run is longer than our other sizes.",
    fastnessNote:
      "Reactive dyes. Shade holds well; madder grounds are the most stable of the three colourways in this set.",
    priceBands: [
      { minQty: 50, pricePerPiece: 412 },
      { minQty: 200, pricePerPiece: 388 },
      { minQty: 500, pricePerPiece: 358 },
    ],
    mrp: 1049,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },

  /* ---------------- Jaipuri bel-buti (3) ---------------- */
  {
    slug: "jaipuri-bel-buti-double",
    name: "Jaipuri Bel Buti",
    code: "RLT-JBB-90",
    nameHindi: "जयपुरी बेल बूटी",
    facets: {
      print: "bel-buti",
      fabric: ["pure-cotton", "combed-60x60"],
      size: ["double", "queen"],
      use: ["retail-counter", "festive-gifting"],
    },
    size: "double-queen",
    pattern: "jaipuri-buti",
    colourwaySet: "full",
    fabric: PREMIUM(10),
    description:
      "The house bel-buti: a climbing vine down the border and a large flower buti across the field, on our heavier cloth.",
    handNote:
      "144 GSM 60x60 combed cotton. Distinctly denser than the standard double; buyers who compare the two usually notice it by hand alone.",
    registrationNote:
      "Ten screens. The vine and the buti are drawn from the same original, so the border and field motifs match in weight across the sheet.",
    fastnessNote:
      "Reactive dyes on 144 GSM cloth, which holds the print more sharply over time. Colour is stable through normal domestic washing.",
    priceBands: [
      { minQty: 50, pricePerPiece: 368 },
      { minQty: 200, pricePerPiece: 342 },
      { minQty: 500, pricePerPiece: 316 },
    ],
    mrp: 1049,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "jaipuri-kali-buti-single",
    name: "Jaipuri Kali Buti",
    code: "RLT-JKB-60",
    nameHindi: "जयपुरी कली बूटी",
    facets: {
      print: "bel-buti",
      fabric: ["pure-cotton", "percale"],
      size: ["single"],
      use: ["retail-counter", "festive-gifting"],
    },
    size: "single",
    pattern: "tulip-bel",
    colourwaySet: "full",
    fabric: PERCALE_PREMIUM(9),
    description:
      "A bud repeat on a close stripe, printed on premium cloth. Our only single in the 144 GSM quality.",
    handNote:
      "144 GSM 60x60 combed cotton. Heavier than buyers expect in a single; it sits flatter on the bed and creases less.",
    registrationNote:
      "Nine screens. The bud cup and the outer petals are separate screens, and a small halo where they meet is characteristic of the design.",
    fastnessNote:
      "Reactive dyes. Good shade retention; the leaf-green colourway is the most consistent across production lots.",
    priceBands: [
      { minQty: 50, pricePerPiece: 215 },
      { minQty: 200, pricePerPiece: 199 },
      { minQty: 500, pricePerPiece: 183 },
    ],
    mrp: 629,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "jaipuri-bel-grand-king",
    name: "Jaipuri Bel Grand",
    code: "RLT-JBG-108",
    nameHindi: "जयपुरी बेल ग्रैंड",
    facets: {
      print: "jaipuri-floral",
      fabric: ["pure-cotton", "cotton-satin"],
      size: ["king", "super-king"],
      use: ["festive-gifting", "export"],
    },
    size: "king",
    pattern: "tulip-bel",
    colourwaySet: "cool",
    fabric: SATEEN(11),
    description:
      "The bel-buti drawing enlarged for king beds, with a deeper border and a wider spacing between butis.",
    handNote:
      "144 GSM 60x60 combed cotton. The heaviest sheet in the range by finished weight, given the size.",
    registrationNote:
      "Eleven screens. Enlarging the drawing widens every outline, so registration variance is proportionally less visible than on the smaller sizes.",
    fastnessNote:
      "Reactive dyes. Wash behaviour matches the double in the same design; loose dye clears in the first two washes.",
    priceBands: [
      { minQty: 50, pricePerPiece: 436 },
      { minQty: 200, pricePerPiece: 410 },
      { minQty: 500, pricePerPiece: 379 },
    ],
    mrp: 1199,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },

  /* ---------------- Discharge print (2) ---------------- */
  {
    slug: "discharge-indigo-buti-double",
    name: "Discharge Indigo Buti",
    code: "RLT-DIB-90",
    nameHindi: "डिस्चार्ज नील बूटी",
    facets: {
      print: "discharge",
      fabric: ["pure-cotton", "twill-cotton"],
      size: ["double", "queen"],
      use: ["export", "hotel-institutional"],
    },
    size: "double-queen",
    pattern: "jaipuri-buti",
    colourwaySet: "indigo-pair",
    fabric: DISCHARGE_TWILL(9),
    description:
      "The cloth is dyed indigo first and the motif bleached back out of it, so the white comes from the ground rather than a white screen.",
    handNote:
      "144 GSM 60x60 combed cotton. The discharged areas feel very slightly softer than the dyed ground — a normal result of the process.",
    registrationNote:
      "Nine screens. Because the white is discharged rather than printed, the motif edge is softer than on our reactive prints. This is the look of the technique.",
    fastnessNote:
      "The indigo ground is piece-dyed and releases loose dye over the first two or three washes. The discharged white does not yellow with normal washing.",
    priceBands: [
      { minQty: 50, pricePerPiece: 385 },
      { minQty: 200, pricePerPiece: 358 },
      { minQty: 500, pricePerPiece: 331 },
    ],
    mrp: 1129,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
  {
    slug: "discharge-madder-jaal-double",
    name: "Discharge Madder Jaal",
    code: "RLT-DMJ-90",
    nameHindi: "डिस्चार्ज मजीठ जाल",
    facets: {
      print: "discharge",
      fabric: ["pure-cotton", "combed-60x60"],
      size: ["double", "queen"],
      use: ["export", "festive-gifting"],
    },
    size: "double-queen",
    pattern: "sanganeri-floral",
    colourwaySet: "warm",
    fabric: DISCHARGE(10),
    description:
      "A dense jaal discharged out of a madder ground, with a marigold screen added back over the cleared areas.",
    handNote:
      "144 GSM 60x60 combed cotton. Slightly firmer than the indigo discharge because more of the surface carries a second colour.",
    registrationNote:
      "Ten screens. The marigold is printed into the discharged area, so any registration drift shows as a thin red line at the motif edge.",
    fastnessNote:
      "Madder grounds are the most prone to shade variation between lots; we match to an approved swatch on repeat orders rather than to the previous delivery.",
    priceBands: [
      { minQty: 50, pricePerPiece: 379 },
      { minQty: 200, pricePerPiece: 352 },
      { minQty: 500, pricePerPiece: 325 },
    ],
    mrp: 929,
    currency: "INR",
    priceNote: EX_JAIPUR,
  },
];

/**
 * Path to a generated render. Prefer getProductImage() from lib/images.ts,
 * which falls back to this only when no real photograph exists.
 */
export function swatchPath(
  patternSlug: string,
  colourwaySlug: string,
  type: "flat" | "stack" | "detail",
) {
  return `/products/generated/${patternSlug}/${colourwaySlug}-${type}.webp`;
}
