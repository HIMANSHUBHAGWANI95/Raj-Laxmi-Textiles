/**
 * Build-time validation of the content layer. Runs before `next build`.
 * Any error here fails the build.
 *
 *   npm run validate
 */

import { existsSync } from "node:fs";
import path from "node:path";

import { PRODUCTS, PATTERNS, type Product } from "../src/lib/products";
import { FACET_GROUPS } from "../src/content/facets";
import { facetCount } from "../src/lib/facetQueries";
import { COLOURWAYS, COLOURWAY_SETS, type ColourwaySetName } from "../src/lib/colourways";
import { FAQS } from "../src/lib/faqs";
import { swatchPath } from "../src/lib/products";

const EXPECTED_PRODUCT_COUNT = 12;

/** Print families and how many products each should carry. */
const EXPECTED_PER_PRINT: Record<string, number> = {
  sanganeri: 2,
  "jaipuri-floral": 2,
  "bel-buti": 2,
  "striped-border": 3,
  discharge: 2,
  bagru: 1,
};

const errors: string[] = [];

function fail(message: string) {
  errors.push(message);
}

/* ---------------- products ---------------- */

if (PRODUCTS.length !== EXPECTED_PRODUCT_COUNT) {
  fail(`Expected ${EXPECTED_PRODUCT_COUNT} products, found ${PRODUCTS.length}.`);
}

const slugs = new Set<string>();
for (const product of PRODUCTS) {
  if (slugs.has(product.slug)) fail(`Duplicate product slug: ${product.slug}`);
  slugs.add(product.slug);

  if (!PATTERNS.some((p) => p.slug === product.pattern)) {
    fail(`${product.slug}: unknown pattern "${product.pattern}".`);
  }

  if (!(product.colourwaySet in COLOURWAY_SETS)) {
    fail(`${product.slug}: unknown colourway set "${product.colourwaySet}".`);
  } else {
    for (const cw of COLOURWAY_SETS[product.colourwaySet as ColourwaySetName]) {
      if (!COLOURWAYS.some((c) => c.slug === cw)) {
        fail(`${product.slug}: colourway set references unknown colourway "${cw}".`);
      }
    }
  }

  if (product.currency !== "INR") {
    fail(`${product.slug}: currency must be INR.`);
  }

  if (!product.priceNote.trim()) {
    fail(`${product.slug}: priceNote is empty.`);
  }

  validatePriceBands(product);

  // The generated imagery must exist for every colourway the product claims.
  const set = COLOURWAY_SETS[product.colourwaySet as ColourwaySetName] ?? [];
  for (const cw of set) {
    for (const type of ["flat", "stack", "detail"] as const) {
      const rel = swatchPath(product.pattern, cw, type);
      const abs = path.join(process.cwd(), "public", rel.replace(/^\//, ""));
      if (!existsSync(abs)) {
        fail(`${product.slug}: missing image ${rel} — run "npm run swatches".`);
      }
    }
  }
}

/** Bands must climb in quantity and fall in price. */
function validatePriceBands(product: Product) {
  const bands = product.priceBands;

  if (bands.length === 0) {
    fail(`${product.slug}: priceBands is empty.`);
    return;
  }

  for (let i = 0; i < bands.length; i += 1) {
    const band = bands[i];

    if (!Number.isFinite(band.minQty) || band.minQty <= 0) {
      fail(`${product.slug}: band ${i} has an invalid minQty (${band.minQty}).`);
    }
    if (!Number.isFinite(band.pricePerPiece) || band.pricePerPiece <= 0) {
      fail(`${product.slug}: band ${i} has an invalid pricePerPiece (${band.pricePerPiece}).`);
    }

    if (i === 0) continue;
    const previous = bands[i - 1];

    if (band.minQty <= previous.minQty) {
      fail(
        `${product.slug}: priceBands are not in ascending minQty order — ` +
          `band ${i} (minQty ${band.minQty}) does not exceed band ${i - 1} (minQty ${previous.minQty}).`,
      );
    }

    if (band.pricePerPiece > previous.pricePerPiece) {
      fail(
        `${product.slug}: band ${i} (minQty ${band.minQty}) is priced at ${band.pricePerPiece}, ` +
          `higher than the lower-quantity band ${i - 1} (minQty ${previous.minQty}) at ${previous.pricePerPiece}.`,
      );
    }
  }

  if (product.mrp !== undefined && product.mrp <= bands[0].pricePerPiece) {
    fail(`${product.slug}: mrp (${product.mrp}) is not above the entry rate.`);
  }
}

/* ---------------- category spread ---------------- */

for (const [print, expected] of Object.entries(EXPECTED_PER_PRINT)) {
  const actual = PRODUCTS.filter((p) => p.facets.print === print).length;
  if (actual !== expected) {
    fail(`Expected ${expected} products in print family "${print}", found ${actual}.`);
  }
}

/* ---------------- facets ---------------- */

// Every facet value must have at least one product, or the nav and footer
// would link to a route that 404s. This is what guarantees no dead links.
for (const group of FACET_GROUPS) {
  for (const value of group.values) {
    if (facetCount(group.id, value.slug) === 0) {
      fail(
        `Facet ${group.id}/${value.slug} has no products — its nav and footer links would 404.`,
      );
    }
  }
}

// Facet copy must be distinct: duplicated hero lines or paragraphs across
// facet pages is what makes a catalogue read as machine-generated.
const seenCopy = new Map<string, string>();
for (const group of FACET_GROUPS) {
  for (const value of group.values) {
    for (const [field, text] of [
      ["heroLine", value.heroLine],
      ["title", value.title],
      ["metaDescription", value.metaDescription],
      ["body[0]", value.body[0]],
      ["body[1]", value.body[1]],
    ] as const) {
      const key = text.trim().toLowerCase();
      const where = `${group.id}/${value.slug} ${field}`;
      const previous = seenCopy.get(key);
      if (previous) {
        fail(`Duplicate facet copy: ${where} repeats ${previous}.`);
      } else {
        seenCopy.set(key, where);
      }
    }
  }
}

/* ---------------- copy ---------------- */

const BANNED = [
  "best",
  "finest",
  "world-class",
  "premium quality",
  "certified",
  "iso ",
  "oeko",
  "gots",
];

for (const product of PRODUCTS) {
  const copy = [
    product.description,
    product.handNote,
    product.registrationNote,
    product.fastnessNote,
  ];

  for (const field of copy) {
    if (!field.trim()) fail(`${product.slug}: empty copy field.`);
    const lower = field.toLowerCase();
    for (const banned of BANNED) {
      if (lower.includes(banned)) {
        fail(`${product.slug}: copy contains a superlative or certification claim ("${banned.trim()}").`);
      }
    }
  }
}

if (FAQS.length === 0) fail("FAQS is empty.");

/* ---------------- report ---------------- */

if (errors.length > 0) {
  console.error(`\nContent validation failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`  - ${error}`);
  console.error("");
  process.exit(1);
}

console.log(
  `Content OK: ${PRODUCTS.length} products, ${PATTERNS.length} patterns, ` +
    `${COLOURWAYS.length} colourways, ${FAQS.length} FAQs.`,
);
