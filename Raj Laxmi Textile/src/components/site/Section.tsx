import * as React from "react";
import { cn } from "@/lib/utils";
import { BorderRail, type RailTone } from "./BorderRail";

export type SectionTone = "ivory" | "indigo" | "sand";

const TONE_CLASS: Record<SectionTone, string> = {
  ivory: "bg-ivory text-ink",
  indigo: "bg-indigo-900 text-ivory",
  sand: "bg-sand text-ink",
};

const RAIL_TONE: Record<SectionTone, RailTone> = {
  ivory: "ivory",
  indigo: "indigo",
  sand: "sand",
};

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-site px-6 md:px-12", className)}>
      {children}
    </div>
  );
}

export type SectionProps = {
  tone?: SectionTone;
  /** Rendered in the rail-anchored heading slot. */
  title?: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
  /** Supporting copy directly under the title, inside the measure. */
  intro?: React.ReactNode;
  id?: string;
  className?: string;
  children?: React.ReactNode;
};

export function Section({
  tone = "ivory",
  title,
  headingLevel: Heading = "h2",
  intro,
  id,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn(TONE_CLASS[tone], "scroll-mt-36 py-16 md:py-24", className)}>
      <Container>
        {title ? (
          <div className={children ? "mb-10 md:mb-14" : undefined}>
            {/* The rail anchors the left edge of the heading. */}
            <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-6">
              <BorderRail orientation="vertical" length={132} tone={RAIL_TONE[tone]} />
              <div className="measure">
                <Heading
                  className={cn(
                    "text-36 md:text-48",
                    tone === "indigo" ? "text-ivory" : "text-indigo-600",
                  )}
                >
                  {title}
                </Heading>
                {intro ? (
                  <p
                    className={cn(
                      "mt-4 text-18",
                      tone === "indigo" ? "text-ivory/80" : "text-ink/80",
                    )}
                  >
                    {intro}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
