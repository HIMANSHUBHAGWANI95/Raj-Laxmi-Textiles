/**
 * Hard build-time flags.
 *
 * NEXT_PUBLIC_PROTOTYPE gates everything that is placeholder data rather than
 * signed-off business fact. Set it to "false" (or unset it) and every price
 * disappears from every route, replaced by "Rates on enquiry".
 *
 * See PROTOTYPE.md for the full go-live checklist.
 */

export const PROTOTYPE = process.env.NEXT_PUBLIC_PROTOTYPE === "true";

export const SHOW_PRICES = PROTOTYPE;

/**
 * A prototype carrying placeholder rates must never be indexed. If a search
 * engine caches indicative rates as this business's real prices, unwinding
 * that is a commercial problem, not a technical one.
 */
export const ALLOW_INDEXING = !PROTOTYPE;

/** Enquiries are only actually delivered outside prototype mode. */
export const SEND_ENQUIRIES = !PROTOTYPE;

/** The single copy string shown wherever a price is withheld. */
export const RATES_ON_ENQUIRY = "Rates on enquiry";

/** Canonical origin, used for sitemap, robots and QR codes. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rajlaxmitextiles.example"
).replace(/\/$/, "");

/** Server-only. Where enquiries are delivered once PROTOTYPE is false. */
export const ENQUIRY_TO_EMAIL = process.env.ENQUIRY_TO_EMAIL ?? "";

/** Server-only. The verified Resend sending address. */
export const ENQUIRY_FROM_EMAIL =
  process.env.ENQUIRY_FROM_EMAIL ?? "enquiries@rajlaxmitextiles.example";
