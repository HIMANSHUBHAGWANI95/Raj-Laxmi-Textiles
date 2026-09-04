"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUSINESS, formatPhone, telHref, whatsappHref } from "@/lib/constants";
import { NAV_LINKS } from "@/lib/nav";
import { facetHref, type FacetGroup } from "@/content/facets";
import type { Product } from "@/lib/products";
import type { ResolvedImage } from "@/lib/images";
import { Wordmark } from "./Wordmark";
import { BorderRail } from "./BorderRail";
import { MegaMenu } from "./MegaMenu";
import { AnnouncementBar } from "./AnnouncementBar";
import { PrototypeBanner } from "./PrototypeBanner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ENQUIRY_MESSAGE = `Hello ${BUSINESS.name}, I would like wholesale pricing for Jaipuri bedsheets.`;

export function Nav({
  facetGroups,
  featured,
  featuredImage,
}: {
  facetGroups: FacetGroup[];
  featured: Product;
  /** Resolved server-side; the image resolver cannot run in the browser. */
  featuredImage: ResolvedImage;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const headerRef = React.useRef<HTMLElement>(null);

  /**
   * The header is fixed and its height varies — the prototype banner and the
   * announcement bar each wrap to several lines at 360px, and either can be
   * dismissed. Publishing the measured height lets every page's first section
   * clear it instead of guessing with a fixed padding value.
   */
  React.useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const publish = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${element.offsetHeight}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled || menuOpen ? "bg-indigo-900" : "bg-transparent",
      )}
    >
      <PrototypeBanner />
      <AnnouncementBar />

      <div className="mx-auto flex w-full max-w-site items-center gap-6 px-6 py-4 md:px-12">
        <Link href="/">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-8 lg:flex">
          <MegaMenu
            groups={facetGroups}
            featured={featured}
            featuredImage={featuredImage}
            onOpenChange={setMenuOpen}
          />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-16 text-ivory/85 underline decoration-transparent decoration-2 underline-offset-[10px] transition-colors hover:text-ivory hover:decoration-marigold"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Phone and WhatsApp stay visible at every width. */}
        <div className="ml-auto flex items-center gap-3 lg:ml-8">
          <a
            href={telHref}
            className="hidden text-16 text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4 xl:inline"
          >
            {formatPhone()}
          </a>
          <a
            href={whatsappHref(ENQUIRY_MESSAGE)}
            className="inline-flex min-h-11 items-center rounded-[2px] bg-leaf px-4 text-16 font-semibold text-ivory hover:bg-[#345A2F]"
          >
            WhatsApp
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <button
                  type="button"
                  aria-label="Open menu"
                  className="inline-flex size-11 items-center justify-center rounded-[2px] border border-ivory/30 text-ivory lg:hidden"
                />
              }
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-11/12 gap-0 overflow-y-auto border-l-0 bg-indigo-900 p-0 text-ivory sm:max-w-md"
              showCloseButton={false}
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <BorderRail
                orientation="horizontal"
                length={480}
                tone="indigo"
                responsive={false}
              />

              <div className="p-6">
                <SheetClose
                  render={
                    <Link
                      href="/collections"
                      className="block border-b border-ivory/12 py-4 text-22 text-ivory"
                    />
                  }
                >
                  Full catalogue
                </SheetClose>

                {/* Nested drawer: each facet group is an accordion section. */}
                <Accordion className="mt-2">
                  {facetGroups.map((group) => (
                    <AccordionItem key={group.id} value={group.id}>
                      <AccordionTrigger className="text-18 text-ivory">
                        {group.menuHeading}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 pb-2">
                          {group.values.map((value) => (
                            <li key={value.slug}>
                              <SheetClose
                                render={
                                  <Link
                                    href={facetHref(group.slug, value.slug)}
                                    className="block py-2 text-16 text-ivory/80"
                                  />
                                }
                              >
                                {value.label}
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-4 flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          className="border-b border-ivory/12 py-4 text-18 text-ivory"
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                </div>

                <a
                  href={telHref}
                  className="mt-6 block text-18 text-ivory underline decoration-marigold decoration-2 underline-offset-[6px]"
                >
                  {formatPhone()}
                </a>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="mt-2 block break-all text-16 text-ivory/70"
                >
                  {BUSINESS.email}
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
