# Real product photography

Drop a correctly named file in this directory and it **silently replaces** the
generated render on the next build. No code change, no import to update, no
config. The resolver in `src/lib/images.ts` checks here first.

## Naming

```
{product-slug}-{colourway-slug}-{type}.{ext}
```

- `product-slug` — the `slug` field from `src/lib/products.ts`
  (e.g. `sanganeri-booti-jaal-double`)
- `colourway-slug` — one of `indigo`, `madder`, `marigold`, `leaf`, `cobalt`
- `type` — `flat`, `stack` or `detail`
- `ext` — `.jpg`, `.jpeg`, `.png`, `.webp` or `.avif`
  (checked in that order, first match wins)

### Examples

```
sanganeri-booti-jaal-double-indigo-flat.jpg
jaipuri-bel-buti-double-madder-detail.jpg
dhari-border-classic-single-leaf-stack.webp
```

Note that real photos are named per **product**, while generated renders are
stored per **pattern** — several products share one piece of artwork, but a
photograph is always of one specific SKU.

## Target dimensions

| Type | Size | Ratio | What it shows |
| --- | --- | --- | --- |
| `flat` | 1600 x 1200 | 4:3 | The sheet laid flat, top-down, border panel down the left |
| `stack` | 1600 x 1200 | 4:3 | Four to five folded bolts of the design in different colourways |
| `detail` | 1200 x 1200 | 1:1 | Close crop showing print registration, outline and weave |

Match the ratio. The site sets width and height from the table above, so an
off-ratio file will letterbox or distort rather than break the layout.

## Checking what is in place

```bash
npm run check:images
```

Lists every slot, whether a real asset exists, and what is standing in.

## Before going live

Every product image on the site is currently a **procedurally generated
drawing**, not a photograph. See `ART-PROMPTS.md` and `HANDOVER.md`.
