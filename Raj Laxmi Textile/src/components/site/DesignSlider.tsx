"use client";

/**
 * The hero design slider.
 *
 * Autoplay every 6s, and it stops for anything that suggests a person is
 * reading: pointer over the block, focus anywhere inside it, or a
 * prefers-reduced-motion setting (which disables autoplay entirely rather than
 * merely pausing it).
 *
 * The thumbnail rail is a roving-tabindex toolbar: one tab stop, arrows move
 * along it, Enter or Space selects, Home/End jump to the ends.
 */

import * as React from "react";
import Image from "next/image";

import { Button } from "./Button";
import { cn } from "@/lib/utils";
import type { ResolvedImage } from "@/lib/images";

export type SlideDesign = {
  slug: string;
  name: string;
  /** "Pure cotton 60x60, hand screen print" — specification, never adjectives. */
  fabricLine: string;
  /** Two chips, both drawn from the spec sheet. */
  chips: [string, string];
  /** Pre-formatted by the gated price component, or null when rates are off. */
  rateLine: string | null;
  href: string;
  hero: ResolvedImage;
  thumb: ResolvedImage;
};

const INTERVAL_MS = 6000;

export function DesignSlider({ designs }: { designs: SlideDesign[] }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const railRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  const autoplay = !paused && !reducedMotion && designs.length > 1;

  React.useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % designs.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [autoplay, designs.length]);

  const active = designs[index];

  /** Move the roving tab stop and keep the focused thumb in view. */
  const focusThumb = (next: number) => {
    setIndex(next);
    const buttons = railRef.current?.querySelectorAll<HTMLButtonElement>("button[data-thumb]");
    buttons?.[next]?.focus();
    buttons?.[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  function onRailKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = designs.length - 1;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusThumb(index === last ? 0 : index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusThumb(index === 0 ? last : index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusThumb(0);
        break;
      case "End":
        event.preventDefault();
        focusThumb(last);
        break;
      default:
        break;
    }
  }

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
        <div>
          <h1 className="text-36 text-ivory md:text-48">{active.name}</h1>

          <p className="mt-3 text-16 text-ivory/75">{active.fabricLine}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {active.chips.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center rounded-[2px] border border-ivory/25 px-3 py-1 text-14 text-ivory/80"
              >
                {chip}
              </li>
            ))}
          </ul>

          {active.rateLine ? (
            <p className="mt-5 text-18 text-ivory">{active.rateLine}</p>
          ) : (
            <p className="mt-5 text-18 text-ivory/70">Rates on enquiry</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button href="/#contact" variant="enquiry">
              Ask for rates
            </Button>
            <Button href={active.href} variant="link-underline-inverse">
              See the design
            </Button>
          </div>
        </div>

        {/* The hero image. Only the first slide is priority — it is the LCP. */}
        <div className="lg:order-last">
          <Image
            key={active.slug}
            src={active.hero.src}
            width={active.hero.width}
            height={active.hero.height}
            alt={`${active.name}, laid flat`}
            priority={index === 0}
            quality={72}
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="w-full"
          />
        </div>
      </div>

      {/* Thumbnail rail */}
      <div
        ref={railRef}
        role="toolbar"
        aria-label="Choose a design"
        aria-orientation="horizontal"
        onKeyDown={onRailKeyDown}
        className="mt-10 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]"
      >
        {designs.map((design, i) => {
          const selected = i === index;
          return (
            <button
              key={design.slug}
              type="button"
              data-thumb
              aria-pressed={selected}
              aria-label={`Show ${design.name}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(i)}
              className={cn(
                "w-20 shrink-0 rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold sm:w-24",
              )}
            >
              <Image
                src={design.thumb.src}
                width={design.thumb.width}
                height={design.thumb.height}
                sizes="96px"
                alt=""
                className={cn(
                  "aspect-square w-full object-cover transition-opacity",
                  selected ? "opacity-100" : "opacity-60 hover:opacity-90",
                )}
              />
              <span
                className={cn(
                  "mt-2 block border-t-2 pt-1 text-left text-14 leading-tight",
                  selected ? "border-marigold text-ivory" : "border-transparent text-ivory/60",
                )}
              >
                {design.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {active.name}, design {index + 1} of {designs.length}.
      </p>
    </div>
  );
}
