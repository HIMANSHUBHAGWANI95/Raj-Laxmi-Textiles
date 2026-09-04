import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Section, Container } from "@/components/site/Section";
import { Button } from "@/components/site/Button";
import { BorderRail } from "@/components/site/BorderRail";
import { PriceBands, IndicativeRetail } from "@/components/product/PriceBands";
import {
  OrderCalculator,
  type CalculatorOption,
} from "@/components/product/OrderCalculator";
import { getProductImage, imgProps } from "@/lib/images";
import { productColourways, productsByCategory } from "@/lib/content";
import {
  PRODUCTS,
  SIZE_CONTENTS,
  SIZE_DIMENSIONS,
  SIZE_LABELS,
  CATEGORY_LABELS,
  type Product,
} from "@/lib/products";
import { SHOW_PRICES } from "@/lib/flags";
import { BUSINESS, telHref, whatsappHref } from "@/lib/constants";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

/**
 * The calculator's size select offers the other sizes in the same design
 * family. Where two of them share a size, the design name disambiguates.
 */
function calculatorOptions(product: Product): CalculatorOption[] {
  const siblings = productsByCategory(product.category);
  const sizeCounts = new Map<string, number>();
  for (const sibling of siblings) {
    sizeCounts.set(sibling.size, (sizeCounts.get(sibling.size) ?? 0) + 1);
  }

  const options = siblings.map((sibling) => ({
    slug: sibling.slug,
    name: sibling.name,
    sizeLabel: SIZE_LABELS[sibling.size],
    optionLabel:
      (sizeCounts.get(sibling.size) ?? 0) > 1
        ? `${SIZE_LABELS[sibling.size]} — ${sibling.name}`
        : SIZE_LABELS[sibling.size],
    priceBands: sibling.priceBands,
  }));

  // The product being viewed leads the list.
  return options.sort((a, b) =>
    a.slug === product.slug ? -1 : b.slug === product.slug ? 1 : 0,
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-ink/10 py-2">
      <dt className="w-40 shrink-0 text-16 text-ink/60">{label}</dt>
      <dd className="text-16 text-ink">{value}</dd>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const colourways = productColourways(product);
  const [lead] = colourways;
  const enquiry = `Enquiry from the website. Please send rates for ${product.name} (${SIZE_LABELS[product.size]}).`;

  /**
   * Product structured data carries no `offers`. These rates are indicative
   * placeholders confirmed on enquiry, and publishing them as machine-readable
   * offers would state a price we have not committed to.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: CATEGORY_LABELS[product.category],
    material: product.fabric.composition,
    brand: { "@type": "Brand", name: BUSINESS.name },
    manufacturer: { "@type": "Organization", name: BUSINESS.name },
    size: `${SIZE_LABELS[product.size]}, ${SIZE_DIMENSIONS[product.size]}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-indigo-900 pt-32 pb-12 md:pt-40 md:pb-16">
        <Container>
          <div className="flex flex-col gap-5 md:flex-row md:gap-8">
            <BorderRail orientation="vertical" length={150} tone="indigo" />
            <div>
              <p className="text-16 text-ivory/70">
                <Link
                  href="/products"
                  className="underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                >
                  Products
                </Link>
                <span className="px-2 text-ivory/40">/</span>
                {CATEGORY_LABELS[product.category]}
              </p>
              <h1 className="mt-3 text-36 text-ivory md:text-48">{product.name}</h1>
              <p className="mt-3 text-18 text-ivory/80">
                {SIZE_LABELS[product.size]}, {SIZE_DIMENSIONS[product.size]} —{" "}
                {SIZE_CONTENTS[product.size]}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="ivory">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Image
              {...imgProps(getProductImage(product, lead.slug, "flat"))}
              alt={`${product.name} in ${lead.name}, laid flat`}
              priority
              className="w-full"
            />

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {colourways.map((cw) => (
                <figure key={cw.slug}>
                  <Image
                    {...imgProps(getProductImage(product, cw.slug, "detail"))}
                    alt={`${product.name} in ${cw.name}, close crop`}
                    className="w-full"
                  />
                  <figcaption className="mt-2 text-14 text-ink/70">
                    {cw.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div>
            <p className="measure text-18 text-ink/85">{product.description}</p>

            <div className="mt-8 space-y-4 text-16 text-ink/85">
              <p>
                <span className="font-semibold text-ink">Hand. </span>
                {product.handNote}
              </p>
              <p>
                <span className="font-semibold text-ink">Registration. </span>
                {product.registrationNote}
              </p>
              <p>
                <span className="font-semibold text-ink">Colour fastness. </span>
                {product.fastnessNote}
              </p>
            </div>

            <h2 className="mt-10 text-22 text-indigo-600">Rates</h2>
            <PriceBands product={product} className="mt-4" />
            <IndicativeRetail product={product} className="mt-2" />

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href={whatsappHref(enquiry)} variant="enquiry">
                Send a WhatsApp enquiry
              </Button>
              <Button href={telHref} variant="link-underline">
                Call the unit
              </Button>
            </div>
          </div>
        </div>

        {SHOW_PRICES ? (
          <div className="mt-16">
            <OrderCalculator
              options={calculatorOptions(product)}
              initialSlug={product.slug}
              whatsappBase={whatsappHref()}
            />
          </div>
        ) : null}
      </Section>

      <Section tone="sand" title="Specification">
        <dl className="max-w-2xl">
          <SpecRow label="Composition" value={product.fabric.composition} />
          <SpecRow label="Construction" value={product.fabric.construction} />
          <SpecRow label="Weight" value={`${product.fabric.gsm} GSM`} />
          <SpecRow label="Size" value={SIZE_DIMENSIONS[product.size]} />
          <SpecRow label="Contents" value={SIZE_CONTENTS[product.size]} />
          <SpecRow label="Print" value={product.fabric.print} />
          <SpecRow label="Screens" value={`${product.fabric.screens} colour screens`} />
          <SpecRow label="Shrinkage" value={product.fabric.shrinkage} />
          <SpecRow label="Dyes" value={product.fabric.dyes} />
        </dl>
      </Section>
    </>
  );
}
