# Real site photography

Drop a correctly named file in this directory and it **silently replaces** the
labelled placeholder on the next build. No code change. The resolver in
`src/lib/images.ts` checks here first.

## Naming

```
{slot-key}.{ext}
```

- `slot-key` — one of the keys in the table below, defined in
  `src/lib/imageSlots.ts`
- `ext` — `.jpg`, `.jpeg`, `.png`, `.webp` or `.avif`
  (checked in that order, first match wins)

### Example

```
craft-printing-table.jpg
```

## The slots

| Key | Size | Ratio | Subject |
| --- | --- | --- | --- |
| `hero-bed` | 2400 x 1350 | 16:9 | A made bed in a Jaipuri printed sheet |
| `craft-printing-table` | 1800 x 1200 | 3:2 | A printer pulling a screen along the printing table |
| `craft-screens` | 1800 x 1200 | 3:2 | Cut screens stacked or racked in the workshop |
| `craft-drying` | 1800 x 1200 | 3:2 | Printed lengths hung or laid out to dry |
| `craft-detail-macro` | 1400 x 1400 | 1:1 | Macro of the print surface showing registration and weave |
| `about-shop-front` | 1800 x 1200 | 3:2 | The unit's entrance at Jai Hanuman Plaza |
| `about-team` | 1800 x 1200 | 3:2 | The people who run the unit, at work |
| `wholesale-packing` | 1800 x 1200 | 3:2 | Finished sheets folded and baled for dispatch |
| `og-default` | 1200 x 630 | 1.91:1 | Social share card, room for a text overlay |

Framing notes for each slot are on the placeholder image itself and in
`ART-PROMPTS.md`.

Match the ratio. The site sets width and height from `imageSlots.ts`, so an
off-ratio file will letterbox or distort rather than break the layout.

## Checking what is in place

```bash
npm run check:images
```

## What is standing in now

Every slot currently renders a placeholder from `public/site/generated/` — sand
ground, slot key, dimensions and intended subject in small type. They are
deliberately plain so nobody mistakes one for finished artwork.
