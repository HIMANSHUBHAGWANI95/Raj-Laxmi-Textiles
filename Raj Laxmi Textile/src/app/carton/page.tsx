import type { Metadata } from "next";
import { Suspense } from "react";

import { Section, Container } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BorderRail } from "@/components/site/BorderRail";
import { CartonBuilder, type CartonDesign } from "@/components/product/CartonBuilder";
import { minimumOrder } from "@/lib/pricing";
import { SHOW_PRICES } from "@/lib/flags";
import { COMPANY } from "@/lib/company";
import { COLOURWAYS } from "@/lib/colourways";
import { PRODUCTS, SIZE_LABELS } from "@/lib/products";
import { whatsappHref } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mixed Carton Builder — Split a Bale Across Designs",
  description:
    "Build a mixed carton: add designs and quantities, see the tier each line qualifies for and the carton fill, then send the list to us on WhatsApp.",
};

const designs: CartonDesign[] = PRODUCTS.map((product) => ({
  slug: product.slug,
  name: product.name,
  code: product.code,
  sizeLabel: SIZE_LABELS[product.size],
  bands: product.priceBands.map((b) => ({
    minQty: b.minQty,
    pricePerPiece: b.pricePerPiece,
  })),
  moq: minimumOrder(product),
}));

export default function CartonPage() {
  return (
    <>
      <section className="bg-indigo-900 pt-header pb-12 md:pb-16">
        <Container>
          <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Mixed cartons" }]} />
          <div className="mt-6 flex flex-col gap-5 md:flex-row md:gap-8">
            <BorderRail orientation="vertical" length={140} tone="indigo" />
            <div>
              <h1 className="text-36 text-ivory md:text-48">Carton banaiye</h1>
              <p className="measure mt-3 text-18 text-ivory/80">
                Ek carton, kai design — add what you want and how many, and send us
                the list. No cart, no checkout; we quote and confirm by hand.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="ivory">
        <Suspense
          fallback={<p className="text-18 text-ink/70">Loading the carton builder…</p>}
        >
          <CartonBuilder
            designs={designs}
            whatsappBase={whatsappHref()}
            showPrices={SHOW_PRICES}
          />
        </Suspense>
      </Section>

      <Section tone="sand" title="How mixed cartons work">
        <div className="measure space-y-5 text-18 text-ink/85">
          <p>
            The minimum is {COMPANY.terms.moqPieces} pieces per design and size, and
            those pieces do not have to be one shade. Each line above shows which
            quantity tier it has reached, so you can see what another twenty pieces
            would be worth before you commit to them.
          </p>
          <p>
            What a mixed carton buys you is information. A counter tells you within a
            fortnight which shade moves in your market, and the reorder can go deep
            on that one instead of guessing.
          </p>
        </div>

        <h3 className="mt-12 text-22 text-indigo-600">The standing colourways</h3>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {COLOURWAYS.map((cw) => (
            <li key={cw.slug} className="inline-flex items-center gap-3 text-16 text-ink/80">
              <span
                aria-hidden="true"
                className="size-5 border border-ink/15"
                style={{ backgroundColor: cw.field }}
              />
              {cw.tradeName} — {cw.name}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
