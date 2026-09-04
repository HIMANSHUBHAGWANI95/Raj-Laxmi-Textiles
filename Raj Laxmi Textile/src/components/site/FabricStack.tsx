import Image from "next/image";
import Link from "next/link";

import type { ResolvedImage } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * A design shown as folded bolts stacked in its colourways — how cloth
 * actually sits on a shelf in the unit, and the fastest way to read how many
 * shades a design runs in.
 *
 * Pre-resolved image, as with the other fabric components.
 */
export function FabricStack({
  image,
  name,
  meta,
  href,
  colourwayCount,
  tone = "light",
  className,
  sizes = "(min-width: 1024px) 24vw, (min-width: 768px) 46vw, 74vw",
  priority = false,
}: {
  image: ResolvedImage;
  name: string;
  /** Specification line. Never a marketing adjective. */
  meta: string;
  href: string;
  colourwayCount?: number;
  tone?: "light" | "dark";
  className?: string;
  /** Rendered width hint. Without it next/image fetches the 3840px variant. */
  sizes?: string;
  priority?: boolean;
}) {
  const dark = tone === "dark";

  return (
    <article className={cn(className)}>
      <Link href={href} className="group block">
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          sizes={sizes}
          alt={`${name}, folded bolts in its standing colourways`}
          priority={priority}
          className="w-full"
        />
        <h3
          className={cn(
            "mt-4 text-22 underline decoration-transparent decoration-2 underline-offset-[8px] group-hover:decoration-marigold",
            dark ? "text-ivory" : "text-indigo-600",
          )}
        >
          {name}
        </h3>
      </Link>

      <p className={cn("mt-2 text-14", dark ? "text-ivory/70" : "text-ink/70")}>{meta}</p>

      {colourwayCount ? (
        <p className={cn("mt-1 text-14", dark ? "text-ivory/55" : "text-ink/70")}>
          {colourwayCount} colourways
        </p>
      ) : null}
    </article>
  );
}
