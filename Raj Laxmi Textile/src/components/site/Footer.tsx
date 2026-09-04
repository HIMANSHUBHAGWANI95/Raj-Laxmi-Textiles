import Link from "next/link";

import {
  BUSINESS,
  addressLines,
  formatPhone,
  mailHref,
  telHref,
  whatsappHref,
} from "@/lib/constants";
import { NAV_LINKS } from "@/lib/nav";
import { SHOW_PRICES } from "@/lib/flags";
import { facetHref, visibleFacetGroups } from "@/content/facets";
import { facetCount } from "@/lib/facetQueries";
import { BorderRail } from "./BorderRail";

/**
 * Popular searches. Every entry points at a real route that exists — this
 * block is for buyers who type rather than browse, not a keyword dump.
 */
const POPULAR_SEARCHES: Array<{ term: string; href: string }> = [
  { term: "sanganeri print bedsheet wholesale", href: facetHref("print", "sanganeri") },
  { term: "jaipuri bedsheet manufacturer", href: facetHref("print", "jaipuri-floral") },
  { term: "cotton bedsheet supplier jaipur", href: facetHref("fabric", "pure-cotton") },
  { term: "screen printed bedsheets bulk", href: "/collections" },
  { term: "double bedsheet wholesale rate", href: facetHref("size", "double") },
];

const COMPANY_LINKS = [
  { href: "/collections", label: "Full catalogue" },
  ...NAV_LINKS,
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-16 font-semibold text-ivory">{children}</h3>;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-16 text-ivory/75 underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors hover:text-ivory hover:decoration-marigold"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  const groups = visibleFacetGroups(SHOW_PRICES);

  return (
    <footer className="bg-indigo-900 text-ivory">
      <BorderRail
        orientation="horizontal"
        length={1280}
        tone="indigo"
        responsive={false}
        className="w-full"
      />

      <div className="mx-auto w-full max-w-site px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {/* One column per facet group, every value linked. */}
          {groups.map((group) => (
            <nav key={group.id} aria-label={group.menuHeading}>
              <ColumnHeading>{group.menuHeading}</ColumnHeading>
              <ul className="space-y-2">
                {group.values
                  .filter((value) => facetCount(group.id, value.slug) > 0)
                  .map((value) => (
                    <li key={value.slug}>
                      <FooterLink href={facetHref(group.slug, value.slug)}>
                        {value.label}
                      </FooterLink>
                    </li>
                  ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Company">
            <ColumnHeading>Company</ColumnHeading>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnHeading>Visit the unit</ColumnHeading>
            <address className="text-16 leading-[1.7] text-ivory/75 not-italic">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">India</span>
            </address>

            <ul className="mt-5 space-y-3 text-16">
              <li>
                <a
                  href={telHref}
                  className="text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                >
                  {formatPhone()}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  className="text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                >
                  WhatsApp enquiry
                </a>
              </li>
              <li>
                <a
                  href={mailHref}
                  className="break-all text-ivory/80 underline decoration-marigold decoration-2 underline-offset-[6px] hover:text-ivory hover:decoration-4"
                >
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular searches — the terms buyers actually type. */}
        <div className="mt-14 border-t border-ivory/15 pt-8">
          <h3 className="text-16 font-semibold text-ivory">Popular searches</h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {POPULAR_SEARCHES.map((search) => (
              <li key={search.term}>
                <Link
                  href={search.href}
                  className="text-16 text-ivory/70 underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors hover:text-ivory hover:decoration-marigold"
                >
                  {search.term}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 border-t border-ivory/15 pt-8">
          <span className="display-wonk block text-28 font-semibold text-ivory">
            {BUSINESS.name}
          </span>
          <span lang="hi" className="deva mt-2 block text-18 text-ivory/70">
            {BUSINESS.nameDevanagari}
          </span>
          <p className="measure mt-4 text-16 text-ivory/70">
            Wholesale manufacturers of hand screen-printed Jaipuri bedsheets,
            supplying traders, institutions and export buyers across India.
          </p>
        </div>
      </div>

      <div className="border-t-2 border-marigold">
        <div className="mx-auto flex w-full max-w-site flex-col gap-2 px-6 py-6 text-14 text-ivory/60 md:flex-row md:items-center md:justify-between md:px-12">
          <span>
            {new Date().getFullYear()} {BUSINESS.name}
          </span>
          <span>
            {BUSINESS.address.city}, {BUSINESS.address.state}
          </span>
        </div>
      </div>
    </footer>
  );
}
