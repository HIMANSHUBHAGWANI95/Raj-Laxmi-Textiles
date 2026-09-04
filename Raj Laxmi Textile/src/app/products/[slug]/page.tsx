import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Section, Container } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { ProductViewer, type ViewerColourway } from "@/components/product/ProductViewer";
import { ProductCard } from "@/components/product/ProductCard";
import { toCardData } from "@/components/product/productCardData";
import { PriceBands, IndicativeRetail } from "@/components/product/PriceBands";
import { OrderCalculator, type CalculatorOption } from "@/components/product/OrderCalculator";
import { getProductImage } from "@/lib/images";
import { productColourways, productsByPrint, printLabel } from "@/lib/content";
import { minimumOrder } from "@/lib/pricing";
import { facetsForProduct } from "@/lib/facetQueries";
import { facetHref } from "@/content/facets";
import { SHOW_PRICES } from "@/lib/flags";
import { COMPANY } from "@/lib/company";
import {
  PRODUCTS,
  SIZE_CONTENTS,
  SIZE_DIMENSIONS,
  SIZE_LABELS,
  type Product,
} from "@/lib/products";
import { BUSINESS, telHref, whatsappHref } from "@/lib/constants";
import { SITE_URL } from "@/lib/flags";

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
    title: `${product.name} (${product.code})`,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

/** The calculator offers the other sizes in the same print family. */
function calculatorOptions(product: Product): CalculatorOption[] {
  const siblings = productsByPrint(product.facets.print);
  const sizeCounts = new Map<string, number>();
  for (const sibling of siblings) {
    sizeCounts.set(sibling.size, (sizeCounts.get(sibling.size) ?? 0) + 1);
  }

  return siblings
    .map((sibling) => ({
      slug: sibling.slug,
      name: sibling.name,
      code: sibling.code,
      sizeLabel: SIZE_LABELS[sibling.size],
      optionLabel:
        (sizeCounts.get(sibling.size) ?? 0) > 1
          ? `${SIZE_LABELS[sibling.size]} — ${sibling.name}`
          : SIZE_LABELS[sibling.size],
      priceBands: sibling.priceBands,
    }))
    .sort((a, b) => (a.slug === product.slug ? -1 : b.slug === product.slug ? 1 : 0));
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-ink/12 py-2.5">
      <dt className="w-44 shrink-0 text-16 text-ink/70">{label}</dt>
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
  const moq = minimumOrder(product);
  const enquiry = `Enquiry from the website. Please send rates for ${product.name} (${product.code}), ${SIZE_LABELS[product.size]}.`;

  const viewerColourways: ViewerColourway[] = colourways.map((cw) => ({
    slug: cw.slug,
    name: cw.name,
    tradeName: cw.tradeName,
    field: cw.field,
    views: [
      {
        key: "flat",
        label: "Laid flat",
        image: getProductImage(product, cw.slug, "flat"),
        alt: `${product.name} in ${cw.name}, laid flat`,
      },
      {
        key: "detail",
        label: "Border detail",
        image: getProductImage(product, cw.slug, "detail"),
        alt: `${product.name} in ${cw.name}, border and print detail`,
      },
      {
        key: "drape",
        label: "Draped",
        image: getProductImage(product, cw.slug, "drape"),
        alt: `${product.name} in ${cw.name}, hanging in folds`,
      },
      {
        key: "stack",
        label: "Folded stack",
        image: getProductImage(product, cw.slug, "stack"),
        alt: `${product.name} folded in its standing colourways`,
      },
    ],
  }));

  // Related: same print family, then same colourway set.
  const samePrint = PRODUCTS.filter(
    (p) => p.facets.print === product.facets.print && p.slug !== product.slug,
  ).slice(0, 3);

  const sameColourway = PRODUCTS.filter(
    (p) =>
      p.colourwaySet === product.colourwaySet &&
      p.facets.print !== product.facets.print &&
      p.slug !== product.slug,
  ).slice(0, 3);

  /**
   * No `offers` block. These rates are indicative placeholders confirmed on
   * enquiry; publishing them as machine-readable offers would state a price the
   * business has not committed to.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    description: product.description,
    category: printLabel(product.facets.print),
    material: product.fabric.composition,
    color: colourways.map((cw) => cw.name),
    image: colourways
      .slice(0, 3)
      .map((cw) => `${SITE_URL}${getProductImage(product, cw.slug, "flat").src}`),
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

      <section className="bg-indigo-900 pt-header pb-10">
        <Container>
          <Breadcrumbs
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Catalogue", href: "/collections" },
              {
                label: printLabel(product.facets.print),
                href: facetHref("print", product.facets.print),
              },
              { label: product.name },
            ]}
          />
        </Container>
      </section>

      <Section tone="ivory" className="pt-10 md:pt-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left: gallery */}
          <ProductViewer colourways={viewerColourways} productName={product.name} />

          {/* Right: identity, specification, terms */}
          <div>
            <h1 className="text-36 text-indigo-600 md:text-48">{product.name}</h1>
            <p lang="hi" className="deva mt-2 text-22 text-ink/70">
              {product.nameHindi}
            </p>

            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-16">
              <div className="flex gap-2">
                <dt className="text-ink/70">Design code</dt>
                <dd className="text-ink">{product.code}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink/70">Print family</dt>
                <dd>
                  <Link
                    href={facetHref("print", product.facets.print)}
                    className="text-cobalt underline decoration-transparent decoration-2 underline-offset-[6px] hover:decoration-marigold"
                  >
                    {printLabel(product.facets.print)}
                  </Link>
                </dd>
              </div>
            </dl>

            <p className="measure mt-6 text-18 text-ink/85">{product.description}</p>

            <h2 className="mt-10 text-22 text-indigo-600">Specification</h2>
            <dl className="mt-3">
              <SpecRow label="Fabric" value={product.fabric.composition} />
              <SpecRow label="Construction" value={product.fabric.construction} />
              <SpecRow label="Thread count" value={`${product.fabric.threadCount} TC`} />
              <SpecRow label="Weight" value={`${product.fabric.gsm} GSM`} />
              <SpecRow label="Print" value={`${product.fabric.print}, ${product.fabric.screens} screens`} />
              <SpecRow label="Dye" value={product.fabric.dyes} />
              <SpecRow label="Shrinkage" value={product.fabric.shrinkage} />
              <SpecRow label="Colour fastness" value={product.fastnessNote} />
            </dl>

            <h2 className="mt-10 text-22 text-indigo-600">Size and set contents</h2>
            <table className="mt-3 w-full border-collapse text-16">
              <thead>
                <tr className="text-14 text-ink/70">
                  <th scope="col" className="border-b border-ink/15 py-2 pr-6 text-left font-normal">
                    Size
                  </th>
                  <th scope="col" className="border-b border-ink/15 py-2 pr-6 text-left font-normal">
                    Inches
                  </th>
                  <th scope="col" className="border-b border-ink/15 py-2 text-left font-normal">
                    Set contents
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-ink/10 py-2.5 pr-6 text-ink">
                    {SIZE_LABELS[product.size]}
                  </td>
                  <td className="border-b border-ink/10 py-2.5 pr-6 tabular-nums text-ink/80">
                    {SIZE_DIMENSIONS[product.size]}
                  </td>
                  <td className="border-b border-ink/10 py-2.5 text-ink/80">
                    {SIZE_CONTENTS[product.size]}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-14 text-ink/70">
              Other sizes in this family are listed under{" "}
              <Link
                href={facetHref("print", product.facets.print)}
                className="text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
              >
                {printLabel(product.facets.print)}
              </Link>
              .
            </p>

            <h2 className="mt-10 text-22 text-indigo-600">Order terms</h2>
            <dl className="mt-3">
              <SpecRow label="Minimum order" value={`${moq} pieces, splittable across colourways`} />
              <SpecRow label="Packing" value="Folded, poly-wrapped per piece, baled by colour assortment" />
              <SpecRow label="Sampling" value={COMPANY.terms.samplingLeadTime} />
              <SpecRow label="Production" value={COMPANY.terms.productionLeadTime} />
              <SpecRow label="Despatch" value={COMPANY.terms.dispatch} />
            </dl>
            <p className="measure mt-4 text-16 text-ink/70">
              Custom colourways are matched to a physical swatch you send, with a
              strike-off approved before the run. We keep the original drawing on
              file so a reorder in two years matches the first delivery.
            </p>

            <h2 className="mt-10 text-22 text-indigo-600">Rates</h2>
            <PriceBands product={product} className="mt-3" />
            <IndicativeRetail product={product} className="mt-2" />

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href={whatsappHref(enquiry)} variant="enquiry">
                Ask for rates
              </Button>
              <Button href={telHref} variant="link-underline">
                Call the unit
              </Button>
            </div>
          </div>
        </div>

        {SHOW_PRICES ? (
          <div className="mt-14">
            <OrderCalculator
              options={calculatorOptions(product)}
              initialSlug={product.slug}
              whatsappBase={whatsappHref()}
            />
          </div>
        ) : null}

        <div className="mt-10">
          <h2 className="text-16 font-semibold text-ink">Collections this design is in</h2>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
            {facetsForProduct(product, SHOW_PRICES).map(({ group, value }) => (
              <li key={`${group.id}-${value.slug}`}>
                <Link
                  href={facetHref(group.slug, value.slug)}
                  className="inline-flex min-h-9 items-center rounded-[2px] border border-ink/20 px-3 text-14 text-ink/75 transition-colors hover:border-ink/45 hover:text-ink"
                >
                  {value.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {samePrint.length > 0 ? (
        <Section tone="sand" title={`More ${printLabel(product.facets.print)}`}>
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {samePrint.map((p) => (
              <ProductCard key={p.slug} product={toCardData(p)} />
            ))}
          </div>
        </Section>
      ) : null}

      {sameColourway.length > 0 ? (
        <Section
          tone="ivory"
          title={`Also in ${lead.tradeName}`}
          intro={`Other designs printed in the same standing colourways, including ${lead.tradeName} — ${lead.name}.`}
        >
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {sameColourway.map((p) => (
              <ProductCard key={p.slug} product={toCardData(p)} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
