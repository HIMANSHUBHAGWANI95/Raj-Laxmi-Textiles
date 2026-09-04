import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { BorderRail } from "@/components/site/BorderRail";
import { Button } from "@/components/site/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { toCardData } from "@/components/product/productCardData";
import { getFacetValue, facetHref, FACET_GROUPS } from "@/content/facets";
import { productsInFacet, populatedFacetPairs, siblingFacets } from "@/lib/facetQueries";
import { SHOW_PRICES } from "@/lib/flags";
import { COMPANY } from "@/lib/company";
import { whatsappHref } from "@/lib/constants";

type Params = { facetGroup: string; facetValue: string };

/** Only combinations that actually have products become routes. */
export function generateStaticParams(): Params[] {
  return populatedFacetPairs()
    .filter(({ group }) => !group.pricedOnly || SHOW_PRICES)
    .map(({ group, value }) => ({
      facetGroup: group.slug,
      facetValue: value.slug,
    }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { facetGroup, facetValue } = await params;
  const found = getFacetValue(facetGroup, facetValue);
  if (!found) return {};

  return {
    title: found.value.title,
    description: found.value.metaDescription,
    alternates: { canonical: facetHref(facetGroup, facetValue) },
  };
}

export default async function FacetPage({ params }: { params: Promise<Params> }) {
  const { facetGroup, facetValue } = await params;
  const found = getFacetValue(facetGroup, facetValue);
  if (!found) notFound();

  const { group, value } = found;
  if (group.pricedOnly && !SHOW_PRICES) notFound();

  const products = productsInFacet(group.id, value.slug);
  if (products.length === 0) notFound();

  const siblings = siblingFacets(group, value.slug, 2);
  const enquiry = `Enquiry from the website. Please send rates for ${value.label} bedsheets.`;

  return (
    <>
      <section className="bg-indigo-900 pt-header pb-12 md:pb-16">
        <div className="mx-auto w-full max-w-site px-6 md:px-12">
          <Breadcrumbs
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Catalogue", href: "/collections" },
              { label: group.label },
              { label: value.label },
            ]}
          />

          <div className="mt-6 flex flex-col gap-5 md:flex-row md:gap-8">
            <BorderRail orientation="vertical" length={140} tone="indigo" />
            <div>
              <h1 className="text-36 text-ivory md:text-48">{value.label}</h1>
              <p className="measure mt-3 text-18 text-ivory/80">{value.heroLine}</p>
            </div>
          </div>
        </div>
      </section>

      <Section tone="ivory">
        <div className="measure space-y-5 text-18 text-ink/85">
          {value.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>

        <p className="mt-10 text-14 text-ink/70">
          {products.length} design{products.length === 1 ? "" : "s"} in this
          collection. Minimum order {COMPANY.terms.moqPieces} pieces.
        </p>

        <div className="mt-8 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={toCardData(product)} />
          ))}
        </div>
      </Section>

      {/* Sibling facets, so a buyer who is close but not right has somewhere to go. */}
      <Section tone="sand" title={`Other ${group.label.toLowerCase()} options`}>
        <div className="grid gap-8 md:grid-cols-2">
          {siblings.map((sibling) => (
            <article key={sibling.slug} className="border-t-2 border-marigold pt-6">
              <h3 className="text-22 text-indigo-600">
                <Link
                  href={facetHref(group.slug, sibling.slug)}
                  className="underline decoration-transparent decoration-2 underline-offset-[8px] hover:decoration-marigold"
                >
                  {sibling.label}
                </Link>
              </h3>
              <p className="measure mt-3 text-16 text-ink/80">{sibling.heroLine}</p>
            </article>
          ))}
        </div>

        <nav aria-label="Other collections" className="mt-12">
          <h3 className="text-16 font-semibold text-ink">Browse another way</h3>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {FACET_GROUPS.filter((g) => g.id !== group.id)
              .filter((g) => !g.pricedOnly || SHOW_PRICES)
              .map((other) => (
                <li key={other.id}>
                  <Link
                    href={facetHref(other.slug, other.values[0].slug)}
                    className="text-16 text-cobalt underline decoration-transparent decoration-2 underline-offset-[6px] hover:decoration-marigold"
                  >
                    {other.menuHeading}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </Section>

      <Section tone="indigo" title="Ask for rates on this collection">
        <div className="measure">
          <p className="text-18 text-ivory/80">
            Tell us the design, the colourways and the quantity, and we will send
            rates the same day. {COMPANY.terms.quoteBasis}.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href={whatsappHref(enquiry)} variant="enquiry" size="lg">
              Send a WhatsApp enquiry
            </Button>
            <Button href="/#contact" variant="link-underline-inverse" size="lg">
              Use the enquiry form
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
