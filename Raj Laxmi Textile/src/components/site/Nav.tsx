"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUSINESS, formatPhone, telHref, whatsappHref } from "@/lib/constants";
import { NAV_LINKS } from "@/lib/nav";
import { Wordmark } from "./Wordmark";
import { PrototypeBanner } from "./PrototypeBanner";
import { BorderRail } from "./BorderRail";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ENQUIRY_MESSAGE = `Hello ${BUSINESS.name}, I would like wholesale pricing for Jaipuri bedsheets.`;

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        scrolled ? "bg-indigo-900" : "bg-transparent",
      )}
    >
      <PrototypeBanner />

      <div className="mx-auto flex w-full max-w-site items-center gap-6 px-6 py-4 md:px-12">
        <Link href="/" aria-label={`${BUSINESS.name} — home`}>
          <Wordmark />
        </Link>

        <nav className="ml-auto hidden items-center gap-8 lg:flex">
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
            className="hidden text-16 text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4 sm:inline"
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
              className="w-4/5 gap-0 border-l-0 bg-indigo-900 p-0 text-ivory sm:max-w-sm"
              showCloseButton={false}
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <BorderRail orientation="horizontal" length={420} tone="indigo" responsive={false} />
              <div className="flex flex-col gap-1 p-6">
                {NAV_LINKS.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="border-b border-ivory/12 py-4 text-22 text-ivory"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
                <a
                  href={telHref}
                  className="py-4 text-18 text-ivory underline decoration-marigold decoration-2 underline-offset-[6px]"
                >
                  {formatPhone()}
                </a>
                <a href={`mailto:${BUSINESS.email}`} className="text-16 text-ivory/70">
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
