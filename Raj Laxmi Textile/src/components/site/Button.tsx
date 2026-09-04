import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-sans font-semibold transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold disabled:pointer-events-none disabled:opacity-55",
  {
    variants: {
      variant: {
        primary:
          "rounded-[2px] bg-indigo-600 text-ivory hover:bg-indigo-900 active:bg-indigo-900",
        enquiry:
          "rounded-[2px] bg-madder text-ivory hover:bg-[#822323] active:bg-[#822323]",
        ghost:
          "rounded-[2px] border border-indigo-600/35 bg-transparent text-indigo-600 hover:border-indigo-600 hover:bg-indigo-600/6",
        "link-underline":
          "rounded-none px-0 text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4 hover:text-indigo-900",
        // Cobalt fails against indigo-900, so dark surfaces get the ivory link.
        "link-underline-inverse":
          "rounded-none px-0 text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4",
      },
      size: {
        md: "min-h-11 px-5 text-16",
        lg: "min-h-13 px-7 text-18",
      },
    },
    compoundVariants: [
      { variant: "link-underline", size: "md", className: "min-h-0 px-0" },
      { variant: "link-underline", size: "lg", className: "min-h-0 px-0" },
      { variant: "link-underline-inverse", size: "md", className: "min-h-0 px-0" },
      { variant: "link-underline-inverse", size: "lg", className: "min-h-0 px-0" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
};

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ComponentProps<"button">, "className" | "children"> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.ComponentProps<typeof Link>, "className" | "children" | "href"> & {
    href: string;
  };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant, size, className, children, ...rest } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (typeof rest.href === "string") {
    const { href, ...linkProps } = rest;

    // tel:, mailto: and wa.me all leave the app, so they skip the router.
    if (/^(https?:|tel:|mailto:)/.test(href)) {
      return (
        <a href={href} className={classes} {...(linkProps as React.ComponentProps<"a">)}>
          {children}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={classes}
        {...(linkProps as Omit<React.ComponentProps<typeof Link>, "href">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as React.ComponentProps<"button">)}>
      {children}
    </button>
  );
}

export { buttonVariants };
