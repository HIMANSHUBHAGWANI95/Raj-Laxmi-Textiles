# Raj Laxmi Textiles — handover

Prototype website for a Jaipur-based B2B wholesale manufacturer of Jaipuri
screen-printed bedsheets.

## Running it

```bash
npm install
npm run swatches       # product renders -> public/products/generated
npm run placeholders   # site slot placeholders -> public/site/generated
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Validates content, then builds. Validation failure fails the build. |
| `npm run validate` | Content validation on its own |
| `npm run swatches` | Regenerates every product render (deterministic) |
| `npm run placeholders` | Regenerates the labelled site-slot placeholders |
| `npm run check:images` | Table of every image slot: real, placeholder or missing |
| `npm run preflight` | Go-live gate. Fails on any remaining prototype scaffolding |
| `npm run typecheck` | `tsc --noEmit` |

## Going live

**`PROTOTYPE.md` is the ordered checklist**, with the exact file or env var for
each step. Run `npm run preflight` to see what is still outstanding — it fails
if the prototype flag is on in a production build, if any placeholder image is
still in use, or if the placeholder-price marker is still in `products.ts`.

## Prototype data

**Everything in this section is placeholder data. None of it has been quoted,
photographed or approved by Raj Laxmi Textiles. It exists so the prototype
reads like a real site.**

### Placeholder prices

| File | What is placeholder |
| --- | --- |
| `src/lib/products.ts` | Every `priceBands` entry, every `mrp`, and every MOQ. Twelve products, three quantity bands each — 36 invented rates. |

The numbers were written to sit in a plausible range for this trade (per piece,
ex-Jaipur, before GST) and were varied by design so the table does not read as
a formula. They are **not** quotes.

Prices are gated behind one flag:

```ts
// src/lib/flags.ts
export const PROTOTYPE = process.env.NEXT_PUBLIC_PROTOTYPE === "true";
export const SHOW_PRICES = PROTOTYPE;
```

`src/components/product/` holds every component that renders a price, and
`src/components/product/currency.ts` is the only file that formats one into a
string. Each component falls back to **"Rates on enquiry"** when `SHOW_PRICES`
is false. Nothing outside that directory may format a price.

| Component | Where it is used |
| --- | --- |
| `PriceBands` | Product page, above the actions |
| `IndicativeRetail` | Product page — renders nothing when a product has no `mrp` |
| `PriceFrom` | Collections grid cards |
| `OrderCalculator` | Product page; only mounted when `SHOW_PRICES` is true |

`src/lib/pricing.ts` holds the arithmetic (band selection, GST, totals) as pure
numbers with no strings and no flag checks, so it can be reasoned about and
tested on its own.

**GST is set to 5% in `src/lib/pricing.ts`.** Confirm the correct rate for
cotton made-ups before going live.

Prices never appear in structured data. Product JSON-LD is emitted without an
`offers` block, because these rates are indicative and confirmed on enquiry —
publishing them as machine-readable offers would state a price the business has
not committed to. Keep it that way even once real rates land, unless the
business explicitly wants to publish firm prices.

To turn all pricing off site-wide, set `NEXT_PUBLIC_PROTOTYPE=false` (or remove
it) and rebuild. Verified with the flag off: zero currency symbols, zero "per
piece" strings, no calculator, no indicative-retail line, and the rate sort and
rate filter drop off the collections grid. All 128 images still render at full
size, so nothing collapses.

One known wart: with the flag off, the `OrderCalculator` component's *code*
still ships in the `/products/[slug]` client chunk, because the page imports it
statically and only branches at render time. It never renders and carries **no
rate data** (verified: no rupee symbols or band values in any JS chunk) — it is
dead code, roughly a couple of KB, not a leak. Removing it entirely would need a
conditional dynamic import; not worth the complexity for a prototype, but worth
knowing.

### Placeholder imagery

| File / directory | What is placeholder |
| --- | --- |
| `scripts/generate-swatches.ts` | Draws bedsheets procedurally as SVG and rasterises with sharp. |
| `public/products/generated/**` | All 60 product renders (4 patterns x 5 colourways x 3 views), plus source SVGs. |
| `scripts/generate-placeholders.ts` | Draws the labelled site-slot placeholders. |
| `public/site/generated/**` | All 9 site placeholders. |

Product renders are **drawings, not photographs**. They are convincing at a
glance but will not survive a buyer comparing them to real cloth. Site slots
are labelled placeholders that state their own dimensions and intended
subject — they cannot be mistaken for final artwork.

**Read `ART-PROMPTS.md` before commissioning any of this.** Two slots
(`about-shop-front`, `about-team`) must never be filled with generated imagery
under any circumstances.

### How images resolve

`src/lib/images.ts` is the single place that decides whether an image is real
or generated. It checks for a real asset first and falls back to the generated
one:

| Slot kind | Real asset | Generated fallback |
| --- | --- | --- |
| Product | `public/products/real/{product-slug}-{colourway}-{type}.{ext}` | `public/products/generated/{pattern}/{colourway}-{type}.png` |
| Site | `public/site/real/{slot-key}.{ext}` | `public/site/generated/{slot-key}.png` |

Dropping a correctly named file into either `real/` directory replaces the
placeholder on the next build, **with no code change**. Extensions are checked
in the order `.jpg .jpeg .png .webp .avif`.

Real product photos are named per **product**; generated renders are stored per
**pattern**, since several products share one piece of artwork. So photographing
one SKU overrides only that SKU, not everything drawn from the same pattern.

`src/lib/images.ts` reads the filesystem, so it is **server-only**. Do not
import it from a `"use client"` module — resolve in a server component and pass
the result down.

Both `real/` directories carry a README with the naming convention and target
dimensions. To see the current state:

```bash
npm run check:images
```

### Placeholder copy

| File | What is placeholder |
| --- | --- |
| `src/lib/products.ts` | Product names, descriptions, and the hand / registration / fastness notes. |
| `src/lib/faqs.ts` | All ten FAQs. |
| `src/lib/company.ts` | Lead times, capabilities list and terms. |

The copy is deliberately specific and avoids superlatives and invented
certifications — `scripts/validate-content.ts` fails the build if a banned word
such as "certified", "OEKO" or "finest" appears in product copy. Facts such as
lead times and GSM still need confirming with the business.

## Before going live

1. **Replace the rate card.** Get the real rates and MOQs and replace every
   `priceBands` and `mrp` in `src/lib/products.ts`. Delete the placeholder
   warning at the top of that file once they are real.
2. **Decide whether prices belong on a public site at all.** Many wholesalers
   do not publish trade rates. If not, leave `NEXT_PUBLIC_PROTOTYPE` unset in
   production and every route falls back to "Rates on enquiry" — the site is
   designed to work that way.
3. **Shoot the real product photography and the site photography.** Drop files
   into `public/products/real/` and `public/site/real/` using the naming in
   those directories' READMEs; no code changes are needed. `npm run check:images`
   tracks what is still outstanding. Once every slot is real, the generators and
   their `swatches` / `placeholders` scripts can be deleted.
4. **Confirm the fabric specs** — composition, construction, GSM, screen counts,
   shrinkage and dye type — with the unit. They are plausible for the trade but
   unverified.
5. **Confirm the product range.** The twelve products, their sizes and their
   colourway sets are invented. Real SKUs will differ.
6. **Confirm company facts** in `src/lib/company.ts`: lead times, MOQ, quote
   basis and the capability list.
7. **Check the contact details** in `src/lib/constants.ts`. This is the single
   source for phone, WhatsApp, email and address — nothing else hardcodes them.
8. **Add legal pages** if trading terms are to be published (GST number, terms
   of sale). Nothing of the sort exists yet.

## Content layer

| File | Holds |
| --- | --- |
| `src/lib/constants.ts` | The single `BUSINESS` object: name, phone, WhatsApp, email, address. |
| `src/lib/company.ts` | Company narrative, capabilities, terms, quality options. |
| `src/lib/colourways.ts` | The five standing colourways and the named sets products reference. |
| `src/lib/products.ts` | `PATTERNS` (artwork the generator draws) and `PRODUCTS` (12 catalogue items). |
| `src/lib/faqs.ts` | Buyer FAQs. |
| `src/lib/content.ts` | Read helpers. Returns data, never formatted price strings. |
| `src/lib/flags.ts` | `PROTOTYPE` / `SHOW_PRICES`. |
| `src/lib/pricing.ts` | Band selection, GST and order totals. Pure numbers. |
| `src/lib/nav.ts` | Nav links (kept out of the client Nav component so the server Footer can import it). |
| `src/lib/imageSlots.ts` | The nine photographic slots, their ratios, dimensions and briefs. Pure data. |
| `src/lib/images.ts` | The resolver. Server-only; decides real vs generated for every image. |

A product references a `pattern` (which artwork to show) and a `colourwaySet`
(which colourways it is printed in), so several products can share one pattern
and the generator does not need to render per-product imagery.

### Validation

`scripts/validate-content.ts` runs before every build and fails it on:

- product count not 12, or the category spread not 4 / 3 / 3 / 2
- duplicate product slugs
- unknown pattern or colourway-set references
- **`priceBands` not in ascending `minQty` order**
- **any band priced higher than a lower-quantity band**
- invalid or non-positive quantities and prices
- `mrp` not above the entry rate
- missing generated imagery for any colourway a product claims
- superlatives or certification claims in product copy

## A trap to know about: `cn()` and the type scale

The type scale is `text-14` … `text-88`. tailwind-merge does not recognise
those as font sizes out of the box — it reads `text-18` as a text *colour* and
silently drops any real colour merged alongside it, so `cn("text-ivory",
"text-18")` rendered without the ivory. This shipped invisibly for a while and
was only caught by looking at the page in a browser.

`src/lib/utils.ts` now registers the scale with `extendTailwindMerge`. **If you
add a new size to the scale in `globals.css`, add it there too**, or colours
will start disappearing again wherever that size is used.

## Design system

`/styleguide` (noindex) renders every colour token, type size, button state,
`BorderRail` orientation, the current pricing state, and a grid of every
generated swatch. It is the fastest way to see the whole system at once.

Button variants are `primary`, `enquiry`, `ghost`, `link-underline` and
`link-underline-inverse`. Use the inverse one on indigo surfaces — the cobalt
of the standard link variant fails contrast against `indigo-900`.

### Checking layouts

The pages have been reviewed in a headless browser at 1440px and 390px.
Playwright is not a project dependency; to repeat it:

```bash
npm i -D playwright && npx playwright install chromium
```

then drive `npm run start` and screenshot the routes.

## Routes

| Route | Rendering | Notes |
| --- | --- | --- |
| `/` | Static | Hero, range, process, about, FAQs, contact |
| `/products` | Dynamic | Collections grid. Family, rate-band and sort filters are URL-synced via plain links, so they work without JavaScript. Dynamic because it reads `searchParams`. |
| `/products/[slug]` | SSG | One page per product, prerendered from `generateStaticParams` |
| `/styleguide` | Static | noindex |

## Known gaps

- The `select` and `dialog` primitives are installed and styled but unused
  outside the styleguide.
- Nav links to `/#process`, `/#about` and `/#contact` are anchors on the home
  page rather than separate routes.
- `qrcode` is installed but unused; QR codes are step 7 of PROTOTYPE.md.
