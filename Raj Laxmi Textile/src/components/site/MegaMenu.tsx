"use client";

/**
 * Desktop mega menu.
 *
 * Keyboard contract, which is the whole point of building this by hand rather
 * than on hover alone:
 *   - the trigger opens on focus-driven Enter/Space/ArrowDown as well as hover
 *   - Escape closes and returns focus to the trigger
 *   - ArrowUp/ArrowDown move within a column, ArrowLeft/ArrowRight across
 *     columns, Home/End jump to the ends
 *   - Tab is trapped inside the panel while it is open
 *   - the panel closes when focus leaves it entirely
 *
 * Hover is a convenience layered on top; nothing here requires a mouse.
 */

import * as React from "react";
import Link from "next/link";
import { ChevronDownIcon } from "lucide-react";

import { facetHref, type FacetGroup } from "@/content/facets";
import { FabricPanel } from "./FabricPanel";
import type { Product } from "@/lib/products";
import type { ResolvedImage } from "@/lib/images";

export function MegaMenu({
  groups,
  featured,
  featuredImage,
  label = "Catalogue",
  onOpenChange,
}: {
  groups: FacetGroup[];
  featured: Product;
  featuredImage: ResolvedImage;
  label?: string;
  /** Lets the header drop its transparency while the panel is open. */
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpenState] = React.useState(false);
  const setOpen = React.useCallback(
    (next: boolean | ((v: boolean) => boolean)) => {
      setOpenState((previous) => {
        const value = typeof next === "function" ? next(previous) : next;
        onOpenChange?.(value);
        return value;
      });
    },
    [onOpenChange],
  );
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * Escape returns focus to the trigger, which would otherwise re-fire the
   * focus-to-open handler and reopen the panel immediately. This suppresses
   * exactly that one focus event.
   */
  const suppressFocusOpen = React.useRef(false);
  const panelId = React.useId();

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  /** Small delay so crossing the gap between trigger and panel does not close it. */
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  React.useEffect(() => cancelClose, []);

  const close = React.useCallback((returnFocus: boolean) => {
    cancelClose();
    setOpen(false);
    if (returnFocus) {
      suppressFocusOpen.current = true;
      triggerRef.current?.focus();
    }
  }, [setOpen]);

  // Escape anywhere closes.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  /** All focusable links in the panel, in DOM order. */
  const links = () =>
    panelRef.current
      ? Array.from(panelRef.current.querySelectorAll<HTMLAnchorElement>("a[href]"))
      : [];

  /** Column index is stored on each link so arrows can move between columns. */
  function moveWithinColumn(current: HTMLAnchorElement, delta: number) {
    const column = current.dataset.column;
    const inColumn = links().filter((l) => l.dataset.column === column);
    const index = inColumn.indexOf(current);
    const next = inColumn[index + delta];
    next?.focus();
  }

  function moveAcrossColumns(current: HTMLAnchorElement, delta: number) {
    const all = links();
    const columns = [...new Set(all.map((l) => l.dataset.column))];
    const columnIndex = columns.indexOf(current.dataset.column);
    const targetColumn = columns[columnIndex + delta];
    if (targetColumn === undefined) return;

    const inTarget = all.filter((l) => l.dataset.column === targetColumn);
    const currentRow = all
      .filter((l) => l.dataset.column === current.dataset.column)
      .indexOf(current);
    (inTarget[currentRow] ?? inTarget[inTarget.length - 1])?.focus();
  }

  function onPanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const active = document.activeElement;
    if (!(active instanceof HTMLAnchorElement)) return;
    const all = links();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveWithinColumn(active, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveWithinColumn(active, -1);
        break;
      case "ArrowRight":
        event.preventDefault();
        moveAcrossColumns(active, 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveAcrossColumns(active, -1);
        break;
      case "Home":
        event.preventDefault();
        all[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        all[all.length - 1]?.focus();
        break;
      case "Tab": {
        // Trap: wrap at both ends rather than escaping the panel.
        const first = all[0];
        const last = all[all.length - 1];
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first?.focus();
        }
        break;
      }
      default:
        break;
    }
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      // Focus the first link once the panel has rendered.
      requestAnimationFrame(() => links()[0]?.focus());
    }
  }

  return (
    <div
      className="static"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
      onFocus={() => {
        if (suppressFocusOpen.current) {
          suppressFocusOpen.current = false;
          return;
        }
        cancelClose();
        setOpen(true);
      }}
      onBlur={(event) => {
        // Close when focus leaves the trigger and the panel entirely.
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          close(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onKeyDown={onTriggerKeyDown}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-16 text-ivory/85 underline decoration-transparent decoration-2 underline-offset-[10px] transition-colors hover:text-ivory hover:decoration-marigold aria-expanded:text-ivory aria-expanded:decoration-marigold"
      >
        {label}
        <ChevronDownIcon className="size-4" aria-hidden="true" />
      </button>

      {open ? (
        <div
          id={panelId}
          ref={panelRef}
          onKeyDown={onPanelKeyDown}
          className="absolute inset-x-0 top-full z-50 border-t-2 border-marigold bg-indigo-900 shadow-lg"
        >
          <div
            className="mx-auto grid w-full max-w-site gap-10 px-6 py-10 md:px-12"
            style={{
              gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr)) minmax(0, 1.15fr)`,
            }}
          >
            {groups.map((group, columnIndex) => (
              <div key={group.id}>
                <h3 className="text-14 font-semibold text-ivory">{group.menuHeading}</h3>
                <ul className="mt-4 space-y-2">
                  {group.values.map((value) => (
                    <li key={value.slug}>
                      <Link
                        href={facetHref(group.slug, value.slug)}
                        data-column={columnIndex}
                        onClick={() => close(false)}
                        className="block py-1 text-16 text-ivory/75 underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors hover:text-ivory hover:decoration-marigold focus-visible:text-ivory focus-visible:decoration-marigold"
                      >
                        {value.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-14 font-semibold text-ivory">In production now</h3>
              <FabricPanel
                product={featured}
                image={featuredImage}
                tone="dark"
                className="mt-4"
                dataColumn={groups.length}
              />
              <Link
                href="/collections"
                data-column={groups.length}
                onClick={() => close(false)}
                className="mt-4 inline-block text-16 text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
              >
                See the full catalogue
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
