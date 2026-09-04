import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import { toCardData } from "@/components/product/productCardData";
import { RATE_BAND_OPTIONS } from "@/components/product/rateBands";
import { RATE_BAND_FILTERS, matchesRateBand, volumeBand, type RateBandValue } from "@/lib/pricing";
import { SHOW_PRICES } from "@/lib/flags";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";
import { FACET_GROUPS, facetHref } from "@/content/facets";
import { facetCount } from "@/lib/facetQueries";
import { PRODUCTS, type PrintFacet } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catalogue — All Printed Cotton Bedsheets",
  description:
    "The full Raj Laxmi Textiles catalogue: twelve hand screen-printed cotton bedsheet designs from Jaipur, in single, double, queen and king sizes.",
};

type Sort = "name" | "price-asc" | "price-desc";

const SORTS: Array<{ value: Sort; label: string }> = [
  { value: "name", label: "Design name" },
  { value: "price-asc", label: "Rate, low to high" },
  { value: "price-desc", label: "Rate, high to low" },
];

type Query = { print?: string; sort?: string; band?: string };

function hrefWith(current: Query, patch: Query) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(next)) {
    if (!value) continue;
    if (value === "all") continue;
    if (key === "sort" && value === "name") continue;
    params.set(key, value);
  }

  const qs = params.toString();
  return qs ? `/collections?${qs}` : "/collections";
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-[2px] border px-3 text-14 transition-colors sm:min-h-9",
        active
          ? "border-indigo-600 bg-indigo-600 text-ivory"
          : "border-ink/20 text-ink/75 hover:border-ink/45 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;

  const print = (query.print ?? "all") as PrintFacet | "all";
  const sort = (SHOW_PRICES ? query.sort ?? "name" : "name") as Sort;
  const band = (SHOW_PRICES ? query.band ?? "all" : "all") as RateBandValue;

  const current: Query = { print, sort, band };
  const bandFilter = RATE_BAND_FILTERS.find((b) => b.value === band) ?? RATE_BAND_FILTERS[0];
  const printGroup = FACET_GROUPS.find((g) => g.id === "print");

  const visible = PRODUCTS.filter((product) => {
    if (print !== "all" && product.facets.print !== print) return false;
    return matchesRateBand(volumeBand(product).pricePerPiece, bandFilter);
  }).sort((a, b) => {
    if (sort === "price-asc") return volumeBand(a).pricePerPiece - volumeBand(b).pricePerPiece;
    if (sort === "price-desc") return volumeBand(b).pricePerPiece - volumeBand(a).pricePerPiece;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <section className="bg-indigo-900 pt-header pb-12 md:pb-16">
        <div className="mx-auto w-full max-w-site px-6 md:px-12">
          <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "Catalogue" }]} />
          <h1 className="mt-4 text-36 text-ivory md:text-48">The full catalogue</h1>
          <p className="measure mt-3 text-18 text-ivory/80">
            Twelve designs in production across six print families. Minimum order{" "}
            {COMPANY.terms.moqPieces} pieces per design and size, which can be split
            across the colourways shown.
          </p>
        </div>
      </section>

      <Section tone="ivory">
        <div className="space-y-4 border-b border-ink/15 pb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="w-14 text-14 text-ink/70">Print</span>
            <FilterLink href={hrefWith(current, { print: "all" })} active={print === "all"}>
              All
            </FilterLink>
            {printGroup?.values.map((value) => (
              <FilterLink
                key={value.slug}
                href={hrefWith(current, { print: value.slug })}
                active={print === value.slug}
              >
                {value.label}
              </FilterLink>
            ))}
          </div>

          {SHOW_PRICES ? (
            <>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="w-14 text-14 text-ink/70">Rate</span>
                {RATE_BAND_OPTIONS.map((option) => (
                  <FilterLink
                    key={option.value}
                    href={hrefWith(current, { band: option.value })}
                    active={band === option.value}
                  >
                    {option.label}
                  </FilterLink>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="w-14 text-14 text-ink/70">Sort</span>
                {SORTS.map((option) => (
                  <FilterLink
                    key={option.value}
                    href={hrefWith(current, { sort: option.value })}
                    active={sort === option.value}
                  >
                    {option.label}
                  </FilterLink>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <p className="mt-6 text-14 text-ink/70">
          {visible.length} of {PRODUCTS.length} designs
        </p>

        <h2 className="sr-only">Designs</h2>

        {visible.length > 0 ? (
          <div className="mt-8 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={toCardData(product)} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-18 text-ink/75">
            No designs match those filters.{" "}
            <Link
              href="/collections"
              className="text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
            >
              Clear them
            </Link>
            .
          </p>
        )}
      </Section>

      {/* Every facet route, linked once, so the catalogue is crawlable. */}
      <Section tone="sand" title="Browse by">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {FACET_GROUPS.filter((g) => !g.pricedOnly || SHOW_PRICES).map((group) => (
            <div key={group.id}>
              <h3 className="text-18 font-semibold text-ink">{group.menuHeading}</h3>
              <ul className="mt-3 space-y-2">
                {group.values
                  .filter((value) => facetCount(group.id, value.slug) > 0)
                  .map((value) => (
                    <li key={value.slug}>
                      <Link
                        href={facetHref(group.slug, value.slug)}
                        className="text-16 text-cobalt underline decoration-transparent decoration-2 underline-offset-[6px] hover:decoration-marigold"
                      >
                        {value.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
