# Going live

This site is currently a **prototype**. It carries drawn placeholder imagery
and invented rates, and it is deliberately hidden from search engines.

Work through this list in order — the steps build on each other. Run
`npm run preflight` at any point to see what is still outstanding.

```bash
npm run preflight
```

---

## 1. Replace the generated fabric renders with product photography

**Files:** `public/products/real/` (add), `public/products/generated/` (drawn stand-ins)
**Reference:** `public/products/real/README.md`, `scripts/generate-swatches.ts`

Every product image is a procedural drawing, not a photograph. Shoot the real
cloth and drop files into `public/products/real/` named:

```
{product-slug}-{colourway}-{type}.{jpg|jpeg|png|webp|avif}
```

Slugs come from `src/lib/products.ts`; types are `flat`, `stack`, `detail`.
The resolver in `src/lib/images.ts` picks up a real file automatically — no
code change. Target sizes are in the README.

Check progress with `npm run check:images`.

Once every slot is real, delete `scripts/generate-swatches.ts`,
`public/products/generated/` and the `swatches` script in `package.json`.

## 2. Replace the generated room imagery with real shots

**Files:** `public/site/real/` (add), `public/site/generated/` (placeholders)
**Reference:** `ART-PROMPTS.md`, `public/site/real/README.md`, `src/lib/imageSlots.ts`

Nine slots need photographs. Name each file by its slot key, e.g.
`craft-printing-table.jpg`.

**Two of these must never be filled with generated imagery:**
`about-shop-front` and `about-team`. A fabricated shop front is a fabricated
business address, and generated people presented as staff is misrepresentation.
Leave the placeholder in until someone takes the real photograph.

Once every slot is real, delete `scripts/generate-placeholders.ts`,
`public/site/generated/` and the `placeholders` script.

## 3. Replace every price band with the real rate card

**File:** `src/lib/products.ts`
**Alternative:** `src/lib/flags.ts` → `SHOW_PRICES`

All 36 rates, every `mrp` and every MOQ in `src/lib/products.ts` are invented.
Replace them with the real rate card, then delete the banner comment at the top
of that file — the one beginning `PLACEHOLDER PRICING — NOT SIGNED OFF`.
Preflight fails while that marker is present.

Also confirm the GST rate in `src/lib/pricing.ts` (`GST_RATE`, currently 5%).

**If the business would rather not publish trade rates at all** — many
wholesalers do not — set `SHOW_PRICES = false` in `src/lib/flags.ts` and skip
the rate card entirely. Every price is then replaced by "Rates on enquiry" and
the order calculator disappears. The site is designed to work that way.

## 4. Turn the prototype flag off in production

**Env var:** `NEXT_PUBLIC_PROTOTYPE`
**Where:** Vercel → Project → Settings → Environment Variables → Production

Set `NEXT_PUBLIC_PROTOTYPE=false` (or remove it). This single change:

- removes the preview banner (`src/components/site/PrototypeBanner.tsx`)
- re-enables indexing (`src/lib/flags.ts` → `ALLOW_INDEXING`)
- starts actually delivering enquiries (`SEND_ENQUIRIES`)
- keeps prices visible only if `SHOW_PRICES` is still true

Redeploy after changing it — it is inlined at build time, not read at runtime.

## 5. Re-enable indexing and submit the sitemap

**Files:** `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`
**Env var:** `NEXT_PUBLIC_SITE_URL`

These already switch automatically off the prototype flag — robots goes from
`Disallow: /` to allow, the sitemap fills in, and the global `noindex, nofollow`
in `src/app/layout.tsx` becomes `index, follow`. Nothing to edit.

You must, however:

1. Set `NEXT_PUBLIC_SITE_URL` to the production origin, or the sitemap and
   robots will emit the fallback domain.
2. Deploy, then confirm `https://<domain>/robots.txt` allows crawling and
   `https://<domain>/sitemap.xml` lists the pages.
3. Submit the sitemap in Google Search Console.

**Do not submit the sitemap before step 3 is done.** Indicative rates getting
indexed as this business's real prices is a commercial problem to unwind, not a
technical one.

## 6. Verify the sending domain and test an enquiry end to end

**Files:** `src/app/api/enquiry/route.ts`, `src/components/site/EnquiryForm.tsx`
**Env vars:** `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`

1. Verify the sending domain in Resend and set `ENQUIRY_FROM_EMAIL` to an
   address on it. An unverified domain fails silently into spam.
2. Set `ENQUIRY_TO_EMAIL` to the address the business actually reads.
3. Set `RESEND_API_KEY` in Vercel production.
4. Submit a real enquiry through the live form and confirm it arrives, that
   Reply-To is the sender's address, and that it is not in the spam folder.

While `NEXT_PUBLIC_PROTOTYPE` is true the route logs the payload and returns
success **without sending**, so demos cannot spam the business inbox.

## 7. Regenerate the QR codes against the production domain

**Dependency:** `qrcode` (installed, not yet used)
**Env var:** `NEXT_PUBLIC_SITE_URL`

Any QR code printed on cards, bale tags or catalogues must point at the
production domain, not a preview URL. Generate them only after the domain is
final, then **test-scan the printed piece**, not the screen — print size,
contrast and paper stock all break scans that work fine on a monitor.

## 8. Remove the styleguide route

**Directory:** `src/app/styleguide/`

Delete it. It is noindex and disallowed in robots, so it is not an indexing
risk, but it exposes internal design scaffolding and every generated swatch on
a public URL.

---

## What the prototype flag controls

| Behaviour | Prototype (`true`) | Live (`false`) |
| --- | --- | --- |
| Preview banner | Shown, dismissible per session | Absent |
| Prices and calculator | Shown (`SHOW_PRICES`) | Shown only if `SHOW_PRICES` stays true |
| `robots.txt` | `Disallow: /` | Allows all, disallows `/styleguide` |
| `sitemap.xml` | Empty | All routes |
| Page metadata | `noindex, nofollow` | `index, follow` |
| Enquiry form | Logs payload, shows success, sends nothing | Sends via Resend |

All of it derives from `PROTOTYPE` in `src/lib/flags.ts`.

## Preflight

`npm run preflight` fails if:

- `NEXT_PUBLIC_PROTOTYPE` is true while `NODE_ENV` is production
- any site or product image is still a placeholder
- `src/lib/products.ts` still contains the placeholder-price marker
- `ENQUIRY_TO_EMAIL` or `RESEND_API_KEY` is missing while the flag is off

It reads `.env` / `.env.local` the same way Next does, so a local run reflects
what the build would see. Wire it into the deploy step once the site is close
to launch.
