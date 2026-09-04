import Image from "next/image";
import Link from "next/link";

import type { ResolvedImage } from "@/lib/images";
import { productColourways } from "@/lib/content";
import { SIZE_LABELS, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

/**
 * A single design shown as a promoted panel — used in the mega menu and as a
 * cross-sell block on facet pages. Deliberately carries no badge, no rating and
 * no stock claim: an image, a name, and what the cloth is.
 */
export function FabricPanel({
  product,
  image,
  tone = "dark",
  className,
  sizes = "(min-width: 1024px) 20vw, 45vw",
  eyebrow,
  dataColumn,
}: {
  product: Product;
  /**
   * Resolved by the caller, not here. This component is rendered inside the
   * client-side mega menu, and src/lib/images.ts reads the filesystem.
   */
  image: ResolvedImage;
  tone?: "dark" | "light";
  className?: string;
  /** Rendered width hint. Without it next/image fetches the 3840px variant. */
  sizes?: string;
  /** Short context line, e.g. "Featured this season". */
  eyebrow?: string;
  /** Column index for mega-menu arrow navigation. */
  dataColumn?: number;
}) {
  const [lead] = productColourways(product);
  const dark = tone === "dark";

  return (
    <article className={cn(dark ? "text-ivory" : "text-ink", className)}>
      <Link
        href={`/products/${product.slug}`}
        data-column={dataColumn}
        className="group block"
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          sizes={sizes}
          alt={`${product.name} in ${lead.name}, laid flat`}
          className="w-full"
        />
        {eyebrow ? (
          <p className={cn("mt-4 text-14", dark ? "text-ivory/60" : "text-ink/70")}>
            {eyebrow}
          </p>
        ) : null}
        <h3
          className={cn(
            "mt-2 text-22 underline decoration-transparent decoration-2 underline-offset-[8px] group-hover:decoration-marigold",
            dark ? "text-ivory" : "text-indigo-600",
          )}
        >
          {product.name}
        </h3>
      </Link>
      <p className={cn("mt-2 text-14", dark ? "text-ivory/70" : "text-ink/70")}>
        {SIZE_LABELS[product.size]}, {product.fabric.gsm} GSM,{" "}
        {product.fabric.construction.toLowerCase()}
      </p>
    </article>
  );
}
