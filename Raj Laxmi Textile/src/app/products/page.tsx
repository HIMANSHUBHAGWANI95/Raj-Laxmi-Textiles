import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/site/Section";
import { PriceFrom } from "@/components/product/PriceFrom";
import { RATE_BAND_OPTIONS } from "@/components/product/rateBands";
import { getProductImage, imgProps } from "@/lib/images";
import { productColourways } from "@/lib/content";
import {
  RATE_BAND_FILTERS,
  matchesRateBand,
  volumeBand,
  type RateBandValue,
} from "@/lib/pricing";
import { SHOW_PRICES } from "@/lib/flags";
import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  PRODUCTS,
  SIZE_LABELS,
  type Product,
  type ProductCategory,
} from "@/lib/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Twelve Jaipuri screen-printed bedsheet designs in production, in single, double and king sizes.",
};

type Sort = "name" | "price-asc" | "price-desc";
type Band = RateBandValue;

const SORTS: Array<{ value: Sort; label: string }> = [
  { value: "name", label: "Design name" },
  { value: "price-asc", label: "Rate, low to high" },
  { value: "price-desc", label: "Rate, high to low" },
];

type Query = { category?: string; sort?: string; band?: string };

/** Build an href that keeps the other filters intact and drops defaults. */
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
  return qs ? `/products?${qs}` : "/products";
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
        "inline-flex min-h-9 items-center rounded-[2px] border px-3 text-14 transition-colors",
        active
          ? "border-indigo-600 bg-indigo-600 text-ivory"
          : "border-ink/20 text-ink/75 hover:border-ink/45 hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [lead] = productColourways(product);

  return (
    <article>
      <Link href={`/products/${product.slug}`} className="group block">
        <Image
          {...imgProps(getProductImage(product, lead.slug, "flat"))}
          alt={`${product.name}, laid flat`}
          className="w-full"
        />
        <h3 className="mt-4 text-22 text-indigo-600 underline decoration-transparent decoration-2 underline-offset-[8px] group-hover:decoration-marigold">
          {product.name}
        </h3>
      </Link>

      <PriceFrom product={product} className="mt-2" />

      <p className="mt-2 text-14 text-ink/65">
        {CATEGORY_LABELS[product.category]}, {SIZE_LABELS[product.size]},{" "}
        {product.fabric.gsm} GSM
      </p>
    </article>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Query>;
}) {
  const query = await searchParams;

  const category = (query.category ?? "all") as ProductCategory | "all";
  // Sorting and filtering by rate are meaningless when rates are withheld.
  const sort = (SHOW_PRICES ? query.sort ?? "name" : "name") as Sort;
  const band = (SHOW_PRICES ? query.band ?? "all" : "all") as Band;

  const current: Query = { category, sort, band };
  const bandFilter =
    RATE_BAND_FILTERS.find((b) => b.value === band) ?? RATE_BAND_FILTERS[0];

  const visible = PRODUCTS.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    return matchesRateBand(volumeBand(product).pricePerPiece, bandFilter);
  }).sort((a, b) => {
    if (sort === "price-asc") {
      return volumeBand(a).pricePerPiece - volumeBand(b).pricePerPiece;
    }
    if (sort === "price-desc") {
      return volumeBand(b).pricePerPiece - volumeBand(a).pricePerPiece;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <Section
        tone="indigo"
        headingLevel="h1"
        title="Designs in production"
        intro={`Twelve designs across four families. Minimum order ${COMPANY.terms.moqPieces} pieces per design and size, which can be split across the colourways shown.`}
        className="pt-32 md:pt-40"
      />

      <Section tone="ivory">
        <div className="space-y-4 border-b border-ink/15 pb-8">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="w-14 text-14 text-ink/60">Family</span>
            <FilterLink
              href={hrefWith(current, { category: "all" })}
              active={category === "all"}
            >
              All
            </FilterLink>
            {(Object.keys(CATEGORY_LABELS) as ProductCategory[]).map((key) => (
              <FilterLink
                key={key}
                href={hrefWith(current, { category: key })}
                active={category === key}
              >
                {CATEGORY_LABELS[key]}
              </FilterLink>
            ))}
          </div>

          {SHOW_PRICES ? (
            <>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="w-14 text-14 text-ink/60">Rate</span>
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
                <span className="w-14 text-14 text-ink/60">Sort</span>
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

        <p className="mt-6 text-14 text-ink/60">
          {visible.length} of {PRODUCTS.length} designs
        </p>

        {visible.length > 0 ? (
          <div className="mt-8 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-18 text-ink/75">
            No designs match those filters.{" "}
            <Link
              href="/products"
              className="text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
            >
              Clear them
            </Link>
            .
          </p>
        )}
      </Section>
    </>
  );
}
