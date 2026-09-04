"use client";

/**
 * Product gallery: four views of the same colourway — laid flat, border
 * detail, draped, and the folded stack.
 *
 * The thumbnail strip is a roving-tabindex toolbar (one tab stop, arrows move,
 * Enter selects). Enlarging opens a dialog lightbox, which handles its own
 * focus trap and Escape.
 */

import * as React from "react";
import Image from "next/image";
import { ZoomInIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ResolvedImage } from "@/lib/images";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type GalleryView = {
  key: string;
  label: string;
  image: ResolvedImage;
  alt: string;
};

export function ProductGallery({
  views,
  colourwayName,
}: {
  views: GalleryView[];
  colourwayName: string;
}) {
  const [index, setIndex] = React.useState(0);
  const stripRef = React.useRef<HTMLDivElement>(null);

  // A colourway change re-mounts with new views; keep the index in range.
  const active = views[Math.min(index, views.length - 1)];

  const focusThumb = (next: number) => {
    setIndex(next);
    stripRef.current
      ?.querySelectorAll<HTMLButtonElement>("button[data-view]")
      ?.[next]?.focus();
  };

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const last = views.length - 1;
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
    <div>
      <Dialog>
        <DialogTrigger
          render={
            <button
              type="button"
              className="group relative block w-full rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
              aria-label={`Enlarge ${active.label}, ${colourwayName}`}
            />
          }
        >
          <Image
            src={active.image.src}
            width={active.image.width}
            height={active.image.height}
            sizes="(min-width: 1024px) 55vw, 92vw"
            alt={active.alt}
            priority
            className="w-full"
          />
          <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-[2px] bg-indigo-900/85 px-2.5 py-1.5 text-14 text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <ZoomInIcon className="size-4" aria-hidden="true" />
            Enlarge
          </span>
        </DialogTrigger>

        <DialogContent className="max-w-[min(96vw,1400px)] border-0 bg-ivory p-3">
          <DialogTitle className="sr-only">
            {active.label}, {colourwayName}
          </DialogTitle>
          <Image
            src={active.image.src}
            width={active.image.width}
            height={active.image.height}
            sizes="96vw"
            alt={active.alt}
            className="h-auto w-full"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-14 text-ink/70">
              {active.label}, {colourwayName}
            </p>
            <DialogClose
              render={
                <button
                  type="button"
                  className="rounded-[2px] px-3 py-1 text-14 text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                />
              }
            >
              Close
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <div
        ref={stripRef}
        role="toolbar"
        aria-label="Product views"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="mt-4 grid grid-cols-4 gap-3"
      >
        {views.map((view, i) => {
          const selected = i === index;
          return (
            <button
              key={view.key}
              type="button"
              data-view
              aria-pressed={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setIndex(i)}
              className="rounded-[2px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold"
            >
              <Image
                src={view.image.src}
                width={view.image.width}
                height={view.image.height}
                sizes="(min-width: 1024px) 13vw, 22vw"
                alt=""
                className={cn(
                  "aspect-square w-full object-cover transition-opacity",
                  selected ? "opacity-100" : "opacity-65 hover:opacity-90",
                )}
              />
              <span
                className={cn(
                  "mt-2 block border-t-2 pt-1 text-14",
                  selected ? "border-marigold text-ink" : "border-transparent text-ink/70",
                )}
              >
                {view.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
