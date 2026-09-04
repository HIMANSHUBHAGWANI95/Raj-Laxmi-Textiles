import Image from "next/image";
import Link from "next/link";

import { Section, Container } from "@/components/site/Section";
import { BorderRail } from "@/components/site/BorderRail";
import { Button } from "@/components/site/Button";
import { DesignSlider, type SlideDesign } from "@/components/site/DesignSlider";
import { FabricStack } from "@/components/site/FabricStack";
import { BazaarNavigation } from "@/components/site/BazaarNavigation";
import { EnquiryForm } from "@/components/site/EnquiryForm";

import { getProductImage, getSiteImage, imgProps } from "@/lib/images";
import { productColourways, entryBand } from "@/lib/content";
import { formatRupees, formatQuantity } from "@/components/product/currency";
import { SHOW_PRICES } from "@/lib/flags";
import { COMPANY } from "@/lib/company";
import { FACET_GROUPS, facetHref } from "@/content/facets";
import { facetCount } from "@/lib/facetQueries";
import {
  PRODUCTS,
  SIZE_DIMENSIONS,
  SIZE_LABELS,
  type Product,
} from "@/lib/products";
import { BUSINESS, addressLines, formatPhone, telHref, whatsappHref } from "@/lib/constants";

/* ------------------------------------------------------------------ *
 * Slider data. Chips come off the spec sheet — never an adjective.
 * ------------------------------------------------------------------ */

function toSlide(product: Product): SlideDesign {
  const [lead] = productColourways(product);
  const band = entryBand(product);

  return {
    slug: product.slug,
    name: product.name,
    fabricLine: `${product.fabric.composition} ${product.fabric.construction}, ${product.fabric.print.toLowerCase()}`,
    chips: [
      `${product.fabric.gsm} GSM`,
      `${product.fabric.screens} colour screens`,
    ],
    // Formatting a price is only allowed behind the flag.
    rateLine: SHOW_PRICES
      ? `${formatRupees(band.pricePerPiece)} per piece at ${formatQuantity(band.minQty)} pieces`
      : null,
    href: `/products/${product.slug}`,
    hero: getProductImage(product, lead.slug, "flat"),
    thumb: getProductImage(product, lead.slug, "detail"),
  };
}

const PRINT_FAMILY_NOTES: Record<string, [string, string]> = {
  sanganeri: [
    "Small floral jaal, printed dark on light, nothing over twelve millimetres.",
    "Moves steadily off a household counter and photographs cleanly for a catalogue.",
  ],
  "jaipuri-floral": [
    "The drawing opened out — flower heads sixty to ninety millimetres, widely spaced.",
    "Goes to queen and king buyers who want the sheet to hold the room on its own.",
  ],
  "bel-buti": [
    "A climbing vine down the border and a scattered buti field, cut from one drawing.",
    "The house style, nine to eleven screens. Buyers who take it once reorder it.",
  ],
  "striped-border": [
    "All the pattern in the border band, the field left quiet. Fewest screens we run.",
    "The volume line, taken in mixed bales by price-sensitive counters.",
  ],
  discharge: [
    "Ground dyed first, motif bleached back out of it, so the white is the cloth.",
    "Export buyers take it for the softer motif edge; lead time runs longer.",
  ],
  bagru: [
    "Earth grounds, black and madder, drawn deliberately irregular in the Bagru manner.",
    "Sells where a buyer wants hand-made character without true dabu prices.",
  ],
};

export default function HomePage() {
  const sliderDesigns = PRODUCTS.slice(0, 10).map(toSlide);
  const running = PRODUCTS.slice(0, 4);

  const sizeGroup = FACET_GROUPS.find((g) => g.id === "size");
  const rateGroup = FACET_GROUPS.find((g) => g.id === "rate");
  const printGroup = FACET_GROUPS.find((g) => g.id === "print");

  const bazaarStalls = [
    { label: "Sanganeri", note: "Chhoti booti, light grounds", href: facetHref("print", "sanganeri") },
    { label: "Bel buti", note: "Vine border, house style", href: facetHref("print", "bel-buti") },
    { label: "Striped border", note: "Sasta aur chalta — the volume line", href: facetHref("print", "striped-border") },
    { label: "Double / Queen", note: "90 x 100 in, sabse zyada chalta hai", href: facetHref("size", "double") },
    { label: "Hotel supply", note: "Heavy cloth, hot wash", href: facetHref("use", "hotel-institutional") },
    { label: "Export", note: "Swatch-matched repeats", href: facetHref("use", "export") },
  ];

  return (
    <>
      {/* 1. DESIGN SLIDER HERO ---------------------------------------- */}
      <section className="bg-indigo-900 pt-header pb-14 md:pb-20">
        <Container>
          <DesignSlider designs={sliderDesigns} />
        </Container>
      </section>

      {/* 2. RUNNING DESIGNS ------------------------------------------- */}
      <Section
        tone="ivory"
        title="Abhi table par — running designs"
        intro="Printing this week. Every one of these can ship inside the standing lead time."
      >
        {/* Horizontal scroll on mobile with a visible edge, 4-up from lg. */}
        <div className="-mx-6 overflow-x-auto px-6 pb-3 md:mx-0 md:overflow-visible md:px-0">
          <div className="grid w-max grid-flow-col auto-cols-[72vw] gap-6 sm:auto-cols-[45vw] md:w-auto md:grid-flow-row md:auto-cols-auto md:grid-cols-2 lg:grid-cols-4">
            {running.map((product) => {
              const [lead] = productColourways(product);
              return (
                <FabricStack
                  key={product.slug}
                  image={getProductImage(product, lead.slug, "stack")}
                  name={product.name}
                  meta={`${SIZE_LABELS[product.size]}, ${product.fabric.gsm} GSM, ${product.fabric.screens} screens`}
                  href={`/products/${product.slug}`}
                  colourwayCount={productColourways(product).length}
                />
              );
            })}
          </div>
        </div>
        <p className="mt-3 text-14 text-ink/70 md:hidden">Scroll for more designs</p>
      </Section>

      {/* 3. BAZAAR NAVIGATION ----------------------------------------- */}
      <Section
        tone="sand"
        title="Bazaar mein ghoomiye"
        intro="Six counters, the way you would walk them in the old city. Each one opens a collection."
      >
        <BazaarNavigation stalls={bazaarStalls} />
      </Section>

      {/* 4. SHOP BY SIZE ---------------------------------------------- */}
      <Section
        tone="ivory"
        title="Size dekhiye"
        intro="Cut with the three to four per cent shrinkage allowance already built in."
      >
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {sizeGroup?.values
            .filter((value) => facetCount("size", value.slug) > 0)
            .map((value) => {
              const dimension = Object.entries(SIZE_DIMENSIONS).find(([key]) =>
                value.slug === "double" || value.slug === "queen"
                  ? key === "double-queen"
                  : value.slug === "super-king"
                    ? key === "king"
                    : key === value.slug,
              )?.[1];

              return (
                <li key={value.slug}>
                  <Link
                    href={facetHref("size", value.slug)}
                    className="group flex h-full flex-col justify-between border border-ink/15 p-5 transition-colors hover:border-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
                  >
                    <span className="text-22 text-indigo-600">{value.label}</span>
                    <span className="mt-3 text-14 text-ink/65">
                      {value.slug === "super-king" ? "Above 108 x 108 in, to order" : dimension}
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      </Section>

      {/* 5. RATE BANDS ------------------------------------------------ */}
      {SHOW_PRICES && rateGroup ? (
        <Section
          tone="sand"
          title="Rate dekhiye"
          intro={`Per piece at minimum order. ${COMPANY.terms.quoteBasis}.`}
        >
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {rateGroup.values.map((value) => (
              <li key={value.slug}>
                <Link
                  href={facetHref("rate", value.slug)}
                  className="group flex h-full flex-col justify-between border border-ink/15 bg-ivory p-5 transition-colors hover:border-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
                >
                  <span className="text-22 text-indigo-600">{value.label}</span>
                  <span className="mt-3 text-14 text-ink/65">
                    {facetCount("rate", value.slug)} designs
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* 6. PRINT FAMILIES -------------------------------------------- */}
      <Section
        tone="ivory"
        title="Print families"
        intro="Six drawings families, each with its own counter and its own buyer."
      >
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-6">
          {printGroup?.values.map((value, i) => {
            const notes = PRINT_FAMILY_NOTES[value.slug];
            // Asymmetric: alternating wide and narrow blocks.
            const wide = i % 3 === 0;
            const sample = PRODUCTS.find((p) => p.facets.print === value.slug);

            return (
              <article
                key={value.slug}
                className={wide ? "md:col-span-4" : "md:col-span-2"}
              >
                {sample ? (
                  <Link href={facetHref("print", value.slug)} className="group block">
                    <Image
                      {...imgProps(
                        getProductImage(
                          sample,
                          productColourways(sample)[0].slug,
                          wide ? "flat" : "detail",
                        ),
                      )}
                      sizes="(min-width: 768px) 45vw, 92vw"
              alt={`${value.label} print`}
                      className="w-full"
                    />
                    <h3 className="mt-4 text-28 text-indigo-600 underline decoration-transparent decoration-2 underline-offset-[8px] group-hover:decoration-marigold">
                      {value.label}
                    </h3>
                  </Link>
                ) : null}
                {notes ? (
                  <div className="measure mt-3 space-y-1 text-16 text-ink/80">
                    <p>{notes[0]}</p>
                    <p>{notes[1]}</p>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </Section>

      {/* 7. THE PRINTING FLOOR ---------------------------------------- */}
      <Section
        tone="indigo"
        title="Chhapai ka kaam — the printing floor"
        intro="Everything we ship is printed by hand on the table. Nothing is rotary."
      >
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="grid grid-cols-2 gap-4">
            <Image
              {...imgProps(getSiteImage("craft-printing-table"))}
              sizes="(min-width: 1024px) 24vw, 46vw"
              alt="A printer pulling a screen along the printing table"
              className="w-full"
            />
            <Image
              {...imgProps(getSiteImage("craft-screens"))}
              alt="Cut screens racked in the workshop"
              className="w-full"
            />
            <Image
              {...imgProps(getSiteImage("craft-drying"))}
              sizes="(min-width: 1024px) 24vw, 46vw"
              alt="Printed lengths laid out to dry"
              className="w-full"
            />
            <Image
              {...imgProps(getSiteImage("craft-detail-macro"))}
              alt="Macro of the printed surface showing registration and weave"
              className="w-full"
            />
          </div>

          <div className="measure space-y-5 text-18 text-ivory/80">
            <p>
              A screen is cut for every colour in a design, from the original buti
              drawing rather than from a scan. The cloth is pinned along a
              forty-metre table and the printer walks each screen down its length in
              turn, waiting for one colour to dry before the next goes down. A
              ten-screen double is ten walks of that table.
            </p>
            <p>
              That is why the white outline sits a hair proud of the fill, and why no
              two lengths are identical. We check registration against the table at
              the start of every run, and mid-length on the king sizes. Small
              variance is the register of hand work, and we do not treat it as a
              defect.
            </p>
            <div>
              <Button href="/craft" variant="link-underline-inverse">
                See how we print
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* 8. WHY BUY FROM US ------------------------------------------- */}
      <Section
        tone="ivory"
        title="Humse kyun — four straight facts"
        intro="No awards, no counts, nothing we cannot show you at the unit."
      >
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              term: "Minimum order",
              detail: `${COMPANY.terms.moqPieces} pieces per design and size, splittable across colourways.`,
            },
            {
              term: "Lead time",
              detail: `Sampling ${COMPANY.terms.samplingLeadTime.toLowerCase()}, production ${COMPANY.terms.productionLeadTime}.`,
            },
            {
              term: "Custom colourways",
              detail: "Matched to a physical swatch you send, with a strike-off approved before the run.",
            },
            {
              term: "Despatch",
              detail: `${COMPANY.terms.dispatch}.`,
            },
          ].map((fact) => (
            <div key={fact.term}>
              <BorderRail
                orientation="horizontal"
                length={200}
                tone="ivory"
                responsive={false}
                className="w-full"
              />
              <dt className="mt-4 text-18 font-semibold text-ink">{fact.term}</dt>
              <dd className="mt-2 text-16 text-ink/75">{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 9. MIXED CARTON --------------------------------------------- */}
      <Section tone="sand">
        <div className="flex flex-col gap-4 border-y-2 border-marigold py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-22 text-ink">
            Ek design, saare rang — split the fifty across a design&apos;s colourways
            at the same rate.
          </p>
          <Button href="/carton" variant="ghost" className="shrink-0">
            How mixed cartons work
          </Button>
        </div>
      </Section>

      {/* 10. ENQUIRY -------------------------------------------------- */}
      <Section
        id="contact"
        tone="ivory"
        title="Rate list mangwaiye"
        intro="Tell us the design, the colourways and the quantity. Rates the same day."
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <dl className="space-y-6 text-18">
              <div>
                <dt className="text-16 font-semibold text-ink">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={telHref}
                    className="text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                  >
                    {formatPhone()}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-16 font-semibold text-ink">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href={whatsappHref()}
                    className="text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                  >
                    {formatPhone()}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-16 font-semibold text-ink">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="break-all text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                  >
                    {BUSINESS.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-16 font-semibold text-ink">The unit</dt>
                <dd className="mt-1 text-ink/80">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <Button href={whatsappHref()} variant="enquiry" size="lg">
                Send a WhatsApp enquiry
              </Button>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </Section>
    </>
  );
}
