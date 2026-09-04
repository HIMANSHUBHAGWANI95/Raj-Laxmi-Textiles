import Image from "next/image";
import Link from "next/link";

import type { ResolvedImage } from "@/lib/images";
import { cn } from "@/lib/utils";

/**
 * A single colourway, shown as a close crop. The smallest unit of product
 * imagery on the site — used in colourway rows and thumbnail rails.
 *
 * Takes a pre-resolved image so it can render inside client components; see
 * the note in src/lib/images.ts.
 */
export function FabricSwatch({
  image,
  label,
  alt,
  href,
  active = false,
  tone = "light",
  className,
  sizes = "(min-width: 640px) 12vw, 30vw",
}: {
  image: ResolvedImage;
  label: string;
  alt: string;
  href?: string;
  /** Draws the marigold rule beneath, for the selected item in a rail. */
  active?: boolean;
  tone?: "light" | "dark";
  className?: string;
  /** Rendered width hint. Without it next/image fetches the 3840px variant. */
  sizes?: string;
}) {
  const dark = tone === "dark";

  const inner = (
    <>
      <Image
        src={image.src}
        width={image.width}
        height={image.height}
        sizes={sizes}
        alt={alt}
        className={cn(
          "aspect-square w-full object-cover transition-opacity",
          active ? "opacity-100" : "opacity-85 group-hover:opacity-100",
        )}
      />
      <span
        className={cn(
          "mt-2 block border-t-2 pt-2 text-14 transition-colors",
          active
            ? "border-marigold"
            : "border-transparent group-hover:border-marigold/50",
          dark ? "text-ivory/80" : "text-ink/75",
        )}
      >
        {label}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("group block", className)}>
        {inner}
      </Link>
    );
  }

  return <div className={cn("group block", className)}>{inner}</div>;
}
