# Deployment

Hosted on Vercel, deployed from the **CLI**, not the GitHub integration.

The GitHub repo (`HIMANSHUBHAGWANI95/Raj-Laxmi-Textiles`) is owned by someone
else, and connecting it to a Vercel project needs owner permission. `vercel
link` attempts the connection and fails with:

```
Error: Failed to connect HIMANSHUBHAGWANI95/Raj-Laxmi-Textiles to project.
```

That is expected and harmless — the project is created and CLI deploys work
normally. **Consequence: pushes to GitHub do not deploy anything.** Every
deploy is a manual `vercel` command until the repo owner connects the project
in the Vercel dashboard.

- Vercel project: `moral-turpetude/raj-laxmi-textiles`
- **Production:** https://raj-laxmi-textiles.vercel.app (public)
- Latest preview: https://raj-laxmi-textiles-85vdt80he-moral-turpetude.vercel.app
  (SSO-protected, see below)
- CI (`.github/workflows/ci.yml`) runs typecheck, lint, validation and build on
  push. It deliberately does **not** deploy.

## Commands

```bash
npx vercel link          # once per machine, links this directory to the project
npx vercel               # deploy a preview
npx vercel --prod        # deploy to production
npx vercel ls            # list recent deployments
npx vercel inspect <url> # details for one deployment
npx vercel logs <url>    # runtime logs
```

Run them from the project directory (the one holding `package.json`).

## Environment variables

Set with `printf '%s' "<value>" | npx vercel env add <NAME> <environment>`,
or in the dashboard under Settings → Environment Variables.

| Variable | Environments | Value | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_PROTOTYPE` | Production, Preview | `true` | Drives the preview banner, `noindex`, disallow-all robots, empty sitemap, and no-send enquiries. **Set to `false` only when going live** — see PROTOTYPE.md. |
| `NEXT_PUBLIC_SITE_URL` | Production, Preview | production origin | Feeds `metadataBase`, canonicals, sitemap and robots. |
| `ENQUIRY_TO_EMAIL` | Production, Preview | business inbox | Where enquiries land once `NEXT_PUBLIC_PROTOTYPE=false`. Ignored while it is `true`. |
| `RESEND_API_KEY` | Production | *(not set yet)* | Required before enquiries can send. |
| `NEXT_PUBLIC_GA_ID` | Production | *(not set yet)* | Analytics; unused while unset. |

**Vercel rejects empty-string values**, so `RESEND_API_KEY` and
`NEXT_PUBLIC_GA_ID` are left *unset* rather than set to `""`. The code treats
unset and empty identically (`src/lib/flags.ts`, `src/app/api/enquiry/route.ts`),
so nothing breaks — the enquiry route returns a clear "not configured" error
instead of attempting a send.

These are inlined at build time. **Changing one requires a redeploy**, not just
a save.

## Node version

Pinned in `package.json`:

```json
"engines": { "node": "22.x" }
```

Vercel reads the runtime from that field — there is no `vercel.json` setting
for it on framework builds. CI reads the same field via
`node-version-file: package.json`, so both stay in step.

## Headers

`vercel.json` applies to every route:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Promoting a preview to production

Preview and production builds are identical here (same env values), so a
preview that looks right can be promoted rather than rebuilt:

```bash
npx vercel promote <preview-deployment-url>
```

Or redeploy from source:

```bash
npx vercel --prod
```

## Rolling back

```bash
npx vercel ls                      # find the last good deployment
npx vercel rollback <deployment-url>
```

`rollback` repoints the production alias at an earlier deployment. It is
instant and does not rebuild. To confirm:

```bash
curl -sI https://<production-domain>/ | grep -i x-vercel-id
```

## Deployment protection

Vercel Authentication (Standard Protection) is **already enabled** on this
project, and it was on by default — nothing needed changing. Verified
behaviour:

| URL | Response |
| --- | --- |
| `https://raj-laxmi-textiles.vercel.app` (production alias) | `200` — public |
| `https://raj-laxmi-textiles-<hash>-moral-turpetude.vercel.app` (any preview) | `302` → `vercel.com/sso-api` |
| `https://raj-laxmi-textiles-<hash>-moral-turpetude.vercel.app` (production deployment URL) | `302` → `vercel.com/sso-api` |

So **every hashed deployment URL requires a Vercel login**, and only the
production alias is publicly reachable. A forwarded preview link leaks nothing:
the recipient hits an SSO wall unless they are a member of the
`moral-turpetude` team.

Check it at any time:

```bash
curl -s -o /dev/null -w '%{http_code}\n' <deployment-url>   # expect 302
curl -s -o /dev/null -w '%{http_code}\n' https://raj-laxmi-textiles.vercel.app  # expect 200
```

Settings → Deployment Protection changes this. Do not turn it off.

**The production alias is public and does carry placeholder rates.** What
protects that is the prototype guard, not authentication:

- `NEXT_PUBLIC_PROTOTYPE=true` serves `Disallow: /` and `noindex, nofollow` on
  every route, so nothing is indexable.
- The preview banner appears on every page.

Anyone given the production URL can read the indicative rates. That is the
accepted trade-off for having a shareable link; if it is not acceptable, add
Password Protection to production under the same settings page.

## Adding a custom domain later

1. Add both hostnames:

   ```bash
   npx vercel domains add rajlaxmitextiles.com
   npx vercel domains add www.rajlaxmitextiles.com
   ```

2. DNS at the registrar:

   | Type | Name | Value |
   | --- | --- | --- |
   | `A` | `@` | `76.76.21.21` |
   | `CNAME` | `www` | `cname.vercel-dns.com` |

   Verify the current targets with `npx vercel domains inspect <domain>` —
   Vercel's published IP can change.

3. Pick the canonical host in the dashboard (Settings → Domains). Set the apex
   as primary and mark `www` as **Redirect to** the apex; Vercel then issues a
   308 and handles certificates for both.

4. Update `NEXT_PUBLIC_SITE_URL` to `https://rajlaxmitextiles.com` in
   Production **and** Preview, then redeploy. Canonicals, `metadataBase`,
   `sitemap.xml` and `robots.txt` all read from it and will otherwise keep
   emitting the `.vercel.app` origin.

5. Regenerate any printed QR codes against the new domain and test-scan the
   print — see PROTOTYPE.md step 7.

## Verified on production

```
$ curl -s https://raj-laxmi-textiles.vercel.app/robots.txt
User-Agent: *
Disallow: /

$ curl -s https://raj-laxmi-textiles.vercel.app/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>
```

Every route carries `<meta name="robots" content="noindex, nofollow, nocache">`,
and all four security headers are present on every response.

## Upload size

`.vercelignore` excludes `.next` and the source SVGs behind the generated
renders. The product renders are WebP, not PNG: the same imagery is ~134MB as
PNG and ~18MB as WebP, and the PNG payload was large enough to make
`vercel deploy` fail with `fetch failed` partway through the upload.

If a deploy starts failing on upload again, check the payload size first:

```bash
du -sh public .next
```
