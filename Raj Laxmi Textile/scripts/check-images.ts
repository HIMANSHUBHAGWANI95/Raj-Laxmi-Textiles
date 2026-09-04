/**
 * Reports every image slot in the site, whether a real asset exists, and what
 * is standing in when one does not.
 *
 *   npm run check:images
 *
 * Exits non-zero only when a slot has neither a real asset nor a placeholder,
 * which is the one case that actually breaks a page. Missing photography is
 * reported, not treated as a failure — the placeholders are doing their job.
 */

import fs from "node:fs";
import path from "node:path";

import { SITE_IMAGE_SLOTS, PRODUCT_IMAGE_SIZES, REAL_IMAGE_EXTENSIONS } from "../src/lib/imageSlots";
import { PRODUCTS } from "../src/lib/products";
import { COLOURWAY_SETS, type ColourwaySetName } from "../src/lib/colourways";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function exists(publicRelative: string) {
  return fs.existsSync(path.join(PUBLIC_DIR, publicRelative.replace(/^\//, "")));
}

function findReal(dir: string, base: string): string | null {
  for (const ext of REAL_IMAGE_EXTENSIONS) {
    const rel = `${dir}/${base}${ext}`;
    if (exists(rel)) return `/${rel}`;
  }
  return null;
}

type Row = {
  slot: string;
  status: "real" | "placeholder" | "MISSING";
  standingIn: string;
};

function pad(value: string, width: number) {
  return value.length >= width ? value : value + " ".repeat(width - value.length);
}

function printTable(title: string, rows: Row[]) {
  const w0 = Math.max(title.length, ...rows.map((r) => r.slot.length), 4) + 2;
  const w1 = 13;

  console.log(`\n${title}`);
  console.log("-".repeat(w0 + w1 + 40));
  console.log(pad("SLOT", w0) + pad("ASSET", w1) + "STANDING IN");
  console.log("-".repeat(w0 + w1 + 40));

  for (const row of rows) {
    console.log(pad(row.slot, w0) + pad(row.status, w1) + row.standingIn);
  }
}

/* ---------------- site slots ---------------- */

const siteRows: Row[] = SITE_IMAGE_SLOTS.map((slot) => {
  const real = findReal("site/real", slot.key);
  if (real) {
    return { slot: slot.key, status: "real" as const, standingIn: real };
  }

  const placeholder = `/site/generated/${slot.key}.png`;
  if (exists(placeholder)) {
    return {
      slot: `${slot.key} (${slot.ratio})`,
      status: "placeholder" as const,
      standingIn: placeholder,
    };
  }

  return {
    slot: `${slot.key} (${slot.ratio})`,
    status: "MISSING" as const,
    standingIn: "nothing — run: npm run placeholders",
  };
});

/* ---------------- product slots ---------------- */

const productRows: Row[] = [];
let productReal = 0;
let productPlaceholder = 0;
let productMissing = 0;

for (const product of PRODUCTS) {
  const colourways = COLOURWAY_SETS[product.colourwaySet as ColourwaySetName] ?? [];

  for (const cw of colourways) {
    for (const type of Object.keys(PRODUCT_IMAGE_SIZES) as Array<
      keyof typeof PRODUCT_IMAGE_SIZES
    >) {
      const base = `${product.slug}-${cw}-${type}`;
      const real = findReal("products/real", base);
      const generated = `/products/generated/${product.pattern}/${cw}-${type}.webp`;

      if (real) {
        productReal += 1;
        productRows.push({ slot: base, status: "real", standingIn: real });
      } else if (exists(generated)) {
        productPlaceholder += 1;
      } else {
        productMissing += 1;
        productRows.push({
          slot: base,
          status: "MISSING",
          standingIn: `${generated} — run: npm run swatches`,
        });
      }
    }
  }
}

/* ---------------- report ---------------- */

printTable("SITE IMAGERY", siteRows);

console.log("\nPRODUCT IMAGERY");
console.log("-".repeat(72));
console.log(
  `  ${productReal} real photo(s), ${productPlaceholder} generated render(s), ${productMissing} missing.`,
);
console.log(
  "  Real product photos go in public/products/real/ as {product-slug}-{colourway}-{type}.",
);

if (productRows.length > 0) {
  printTable("PRODUCT SLOTS NEEDING ATTENTION (or already real)", productRows);
}

const siteReal = siteRows.filter((r) => r.status === "real").length;
const siteMissing = siteRows.filter((r) => r.status === "MISSING").length;

console.log("\nSUMMARY");
console.log("-".repeat(72));
console.log(`  Site slots:    ${siteReal}/${SITE_IMAGE_SLOTS.length} real photography in place.`);
console.log(`  Product slots: ${productReal}/${productReal + productPlaceholder} real photography in place.`);

if (siteMissing + productMissing > 0) {
  console.error(
    `\nFAIL: ${siteMissing + productMissing} slot(s) have neither a real asset nor a placeholder.\n`,
  );
  process.exit(1);
}

console.log(
  "\nOK: every slot resolves to an image. Placeholders are provisional — see ART-PROMPTS.md.\n",
);
