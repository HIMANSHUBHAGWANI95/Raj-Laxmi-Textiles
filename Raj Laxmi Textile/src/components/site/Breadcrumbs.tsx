import Link from "next/link";
import { SITE_URL } from "@/lib/flags";

export type Crumb = {
  label: string;
  /** Omitted on the final crumb, which is the current page. */
  href?: string;
};

/**
 * Breadcrumb trail plus its BreadcrumbList structured data. Every catalogue
 * route renders this, so search engines get the facet hierarchy explicitly
 * rather than having to infer it from URLs.
 */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-14 text-ivory/70">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className="underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4 hover:text-ivory"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className="text-ivory/85">
                    {crumb.label}
                  </span>
                )}
                {!last ? <span className="text-ivory/35">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
