/**
 * Go-live preflight. Fails loudly if the site is about to ship with prototype
 * scaffolding still in place.
 *
 *   npm run preflight
 *
 * Run this before any production deploy. See PROTOTYPE.md for the full
 * checklist and how to clear each failure.
 */

import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";

// Read .env / .env.local the same way Next does, so a local run reflects the
// same configuration the build would see.
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

import { SITE_IMAGE_SLOTS, REAL_IMAGE_EXTENSIONS, PRODUCT_IMAGE_SIZES } from "../src/lib/imageSlots";
import { PRODUCTS } from "../src/lib/products";
import { COLOURWAY_SETS, type ColourwaySetName } from "../src/lib/colourways";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** The marker comment at the top of products.ts, removed when rates are real. */
const PLACEHOLDER_PRICE_MARKER = "PLACEHOLDER PRICING — NOT SIGNED OFF";

const failures: string[] = [];
const notes: string[] = [];

const fail = (title: string, detail: string) => failures.push(`${title}\n      ${detail}`);

const prototype = process.env.NEXT_PUBLIC_PROTOTYPE === "true";
const nodeEnv = process.env.NODE_ENV ?? "development";

/* 1. Prototype flag must be off in production ------------------------- */

if (prototype && nodeEnv === "production") {
  fail(
    "NEXT_PUBLIC_PROTOTYPE is true in a production build.",
    "Placeholder rates and imagery would go live and the site would be noindex. " +
      "Set NEXT_PUBLIC_PROTOTYPE=false in the Vercel production environment.",
  );
}

/* 2. No placeholder imagery still in use ------------------------------ */

function hasReal(dir: string, base: string) {
  return REAL_IMAGE_EXTENSIONS.some((ext) =>
    fs.existsSync(path.join(PUBLIC_DIR, dir, base + ext)),
  );
}

const missingSiteSlots = SITE_IMAGE_SLOTS.filter(
  (slot) => !hasReal("site/real", slot.key),
).map((slot) => slot.key);

if (missingSiteSlots.length > 0) {
  fail(
    `${missingSiteSlots.length} site image slot(s) are still placeholders.`,
    `Add photographs to public/site/real/ named: ${missingSiteSlots.join(", ")}. ` +
      "Briefs are in ART-PROMPTS.md.",
  );
}

let productSlots = 0;
const missingProductSlots: string[] = [];

for (const product of PRODUCTS) {
  const colourways = COLOURWAY_SETS[product.colourwaySet as ColourwaySetName] ?? [];
  for (const cw of colourways) {
    for (const type of Object.keys(PRODUCT_IMAGE_SIZES)) {
      productSlots += 1;
      const base = `${product.slug}-${cw}-${type}`;
      if (!hasReal("products/real", base)) missingProductSlots.push(base);
    }
  }
}

if (missingProductSlots.length > 0) {
  fail(
    `${missingProductSlots.length} of ${productSlots} product images are still generated renders.`,
    "Add photography to public/products/real/ named {product-slug}-{colourway}-{type}. " +
      `First missing: ${missingProductSlots.slice(0, 3).join(", ")}. ` +
      "Run `npm run check:images` for the full list.",
  );
}

/* 3. Placeholder price marker must be gone ---------------------------- */

const productsSource = fs.readFileSync(
  path.join(process.cwd(), "src", "lib", "products.ts"),
  "utf8",
);

if (productsSource.includes(PLACEHOLDER_PRICE_MARKER)) {
  fail(
    "src/lib/products.ts still carries the placeholder-price marker.",
    "Replace every priceBands and mrp with the real rate card and delete the " +
      `"${PLACEHOLDER_PRICE_MARKER}" banner comment. If the business would rather not ` +
      "publish rates at all, set SHOW_PRICES to false in src/lib/flags.ts and go enquiry-only.",
  );
}

/* 4. Delivery configuration ------------------------------------------- */

if (!prototype) {
  if (!process.env.ENQUIRY_TO_EMAIL) {
    fail(
      "ENQUIRY_TO_EMAIL is not set and PROTOTYPE is off.",
      "Enquiries would fail. Set ENQUIRY_TO_EMAIL in the production environment.",
    );
  }
  if (!process.env.RESEND_API_KEY) {
    fail(
      "RESEND_API_KEY is not set and PROTOTYPE is off.",
      "Enquiries would fail. Set RESEND_API_KEY and verify the sending domain in Resend.",
    );
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    notes.push(
      "NEXT_PUBLIC_SITE_URL is unset, so sitemap, robots and QR codes will use the fallback origin.",
    );
  }
  if (fs.existsSync(path.join(process.cwd(), "src", "app", "styleguide"))) {
    notes.push(
      "src/app/styleguide still exists. It is noindex and disallowed, but PROTOTYPE.md asks for it to be removed before launch.",
    );
  }
}

/* Report --------------------------------------------------------------- */

console.log(`\nPreflight — NEXT_PUBLIC_PROTOTYPE=${prototype} NODE_ENV=${nodeEnv}\n`);

for (const note of notes) console.log(`  note: ${note}`);
if (notes.length > 0) console.log("");

if (failures.length > 0) {
  console.error(`FAILED — ${failures.length} blocker(s) before this can go live:\n`);
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}\n`));
  console.error("See PROTOTYPE.md for the checklist.\n");
  process.exit(1);
}

console.log("OK — no prototype scaffolding detected.\n");
