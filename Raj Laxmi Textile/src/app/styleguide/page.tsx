import type { Metadata } from "next";
import Image from "next/image";
import { Section, Container } from "@/components/site/Section";
import { BorderRail } from "@/components/site/BorderRail";
import { Button } from "@/components/site/Button";
import { Wordmark } from "@/components/site/Wordmark";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PATTERNS, PRODUCTS, swatchPath } from "@/lib/products";
import { COLOURWAYS } from "@/lib/colourways";
import { PriceBands, IndicativeRetail } from "@/components/product/PriceBands";
import { PriceFrom } from "@/components/product/PriceFrom";
import { SHOW_PRICES } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const TOKENS = [
  { name: "ivory", value: "#FCFBF8", use: "base surface (warm white)" },
  { name: "indigo-900", value: "#14243F", use: "full-bleed bands, footer" },
  { name: "indigo-600", value: "#1E3A6B", use: "primary buttons, headings" },
  { name: "cobalt", value: "#2F5AA8", use: "links, active states" },
  { name: "marigold", value: "#E39A15", use: "rules, underlines, focus rings" },
  { name: "madder", value: "#9E2B2B", use: "the enquiry CTA only" },
  { name: "leaf", value: "#3F6B39", use: "category tags" },
  { name: "ink", value: "#1A1614", use: "body copy" },
  { name: "sand", value: "#F1EBDF", use: "alternate surface" },
];

const TYPE_SCALE = [
  { size: 88, cls: "text-88", face: "display" },
  { size: 64, cls: "text-64", face: "display" },
  { size: 48, cls: "text-48", face: "display" },
  { size: 36, cls: "text-36", face: "display" },
  { size: 28, cls: "text-28", face: "display" },
  { size: 22, cls: "text-22", face: "sans" },
  { size: 18, cls: "text-18", face: "sans (body)" },
  { size: 16, cls: "text-16", face: "sans" },
  { size: 14, cls: "text-14", face: "sans" },
];

function Note({ children }: { children: React.ReactNode }) {
  return <p className="measure mt-2 text-16 text-ink/70">{children}</p>;
}

export default function StyleguidePage() {
  return (
    <>
      <Section
        tone="indigo"
        headingLevel="h1"
        title="Styleguide"
        intro="Every token, type size, component state and generated swatch in one place. This page is noindex."
        className="pt-header"
      />

      <Section tone="ivory" title="Palette">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOKENS.map((token) => (
            <div key={token.name}>
              <div className="h-24 w-full border border-ink/10" style={{ backgroundColor: token.value }} />
              <p className="mt-3 text-18 font-semibold text-ink">--color-{token.name}</p>
              <p className="text-16 text-ink/70">{token.value}</p>
              <p className="text-16 text-ink/70">{token.use}</p>
            </div>
          ))}
        </div>
        <Note>
          Ivory and indigo carry roughly ninety per cent of the surface area.
          Marigold appears only as a 2px rule, an underline or a focus ring — it
          is never set as text on ivory, where it fails contrast. Madder is used
          at most once on any screen, on the enquiry call to action.
        </Note>
      </Section>

      <Section tone="sand" title="Type scale">
        <div className="space-y-8">
          {TYPE_SCALE.map((step) => (
            <div key={step.size} className="border-b border-ink/10 pb-6">
              <p className="text-14 text-ink/70">
                {step.size}px — {step.face}
              </p>
              <p
                className={`${step.cls} mt-2 ${
                  step.size >= 28 ? "display-wonk text-indigo-600" : "text-ink"
                }`}
              >
                Jaipuri screen-printed bedsheets
              </p>
            </div>
          ))}
        </div>
        <Note>
          Fraunces carries display sizes from 28px up with the WONK axis on and
          SOFT raised, so headlines read as inked and slightly irregular. Public
          Sans sets everything else at 18px body with 1.6 line-height, capped at
          a 68ch measure. Headings are left-aligned everywhere.
        </Note>

        <div className="mt-10">
          <p className="text-14 text-ink/70">Devanagari — Tiro Devanagari Hindi</p>
          <p lang="hi" className="deva mt-2 text-36 text-indigo-600">
            राज लक्ष्मी टेक्सटाइल्स
          </p>
          <Note>
            Tiro is loaded only for the wordmark and the footer, nowhere else.
          </Note>
        </div>

        <div className="mt-10 flex flex-wrap items-end gap-12">
          <div className="bg-indigo-900 p-6">
            <Wordmark />
          </div>
          <div className="border border-ink/10 p-6">
            <Wordmark tone="dark" />
          </div>
        </div>
      </Section>

      <Section tone="ivory" title="Buttons">
        <div className="space-y-10">
          {(["primary", "enquiry", "ghost", "link-underline", "link-underline-inverse"] as const).map((variant) => (
            <div
              key={variant}
              className={variant === "link-underline-inverse" ? "bg-indigo-900 p-6" : undefined}
            >
              <p
                className={
                  variant === "link-underline-inverse"
                    ? "text-14 text-ivory/60"
                    : "text-14 text-ink/70"
                }
              >
                {variant}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-6">
                <Button variant={variant} size="md">
                  Request a rate list
                </Button>
                <Button variant={variant} size="lg">
                  Request a rate list
                </Button>
                <Button variant={variant} size="md" disabled={variant !== "link-underline"}>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Note>
          Radius is 2px on buttons and inputs and 0 on images. Nothing is
          pill-shaped, and no button carries an arrow character in its label.
        </Note>
      </Section>

      <Section tone="sand" title="Inputs">
        <div className="grid max-w-2xl gap-6">
          <div className="grid gap-2">
            <Label htmlFor="sg-name">Your name</Label>
            <Input id="sg-name" placeholder="Name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sg-qty">Quantity</Label>
            <Input id="sg-qty" placeholder="e.g. 4 bales" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sg-msg">What are you looking for?</Label>
            <Textarea id="sg-msg" rows={4} placeholder="Design, colourways, quantity" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sg-err">Invalid state</Label>
            <Input id="sg-err" aria-invalid defaultValue="Not a phone number" />
          </div>
        </div>
      </Section>

      <Section tone="ivory" title="BorderRail">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-14 text-ink/70">vertical, tone ivory / sand / indigo</p>
            <div className="mt-4 flex gap-8">
              <BorderRail orientation="vertical" length={280} tone="ivory" responsive={false} />
              <div className="bg-sand p-4">
                <BorderRail orientation="vertical" length={248} tone="sand" responsive={false} />
              </div>
              <div className="bg-indigo-900 p-4">
                <BorderRail orientation="vertical" length={248} tone="indigo" responsive={false} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-14 text-ink/70">horizontal</p>
            <div className="mt-4 space-y-6">
              <BorderRail orientation="horizontal" length={520} tone="ivory" responsive={false} className="w-full" />
              <div className="bg-indigo-900 p-4">
                <BorderRail orientation="horizontal" length={480} tone="indigo" responsive={false} className="w-full" />
              </div>
            </div>

            <p className="mt-10 text-14 text-ink/70">
              the 6px rule it collapses to below md
            </p>
            <div className="mt-4 space-y-4">
              <BorderRail orientation="vertical" length={200} tone="ivory" />
            </div>
          </div>
        </div>
        <Note>
          The rail reproduces the stripe rhythm of the cloth border: two marigold
          pinstripes, a cobalt band, a leaf-green scalloped wave and a repeating
          white-outlined leaf buti. It anchors the left edge of every section
          heading, and becomes a 6px horizontal rule on narrow screens.
        </Note>
      </Section>

      <Section tone="indigo" title="Surfaces">
        <div className="grid gap-6 md:grid-cols-3">
          {(
            [
              ["ivory", "bg-ivory text-ink"],
              ["sand", "bg-sand text-ink"],
              ["indigo-900", "bg-indigo-900 text-ivory border border-ivory/25"],
            ] as const
          ).map(([name, cls]) => (
            <div key={name} className={`${cls} p-8`}>
              <h3 className={`text-28 ${name === "indigo-900" ? "text-ivory" : "text-indigo-600"}`}>
                {name}
              </h3>
              <p className="mt-3 text-16 opacity-80">
                Section backgrounds alternate between these three. Full-bleed
                indigo bands break the page the way stacked bolts break a shelf.
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ivory" title="Pricing states">
        <p className="text-18 text-ink">
          NEXT_PUBLIC_PROTOTYPE is currently{" "}
          <strong>{SHOW_PRICES ? "true" : "false or unset"}</strong>, so prices
          are {SHOW_PRICES ? "shown" : "withheld"} on every route.
        </p>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-14 text-ink/70">PriceFrom</p>
            <PriceFrom product={PRODUCTS[0]} className="mt-2" />
            <IndicativeRetail product={PRODUCTS[0]} className="mt-2" />
          </div>
          <div>
            <p className="text-14 text-ink/70">PriceBands</p>
            <PriceBands product={PRODUCTS[0]} className="mt-2 max-w-md" />
          </div>
        </div>

        <Note>
          These are the only components that format a price. Every figure behind
          them is placeholder data — see HANDOVER.md, &ldquo;Prototype
          data&rdquo;.
        </Note>
      </Section>

      <Container>
        <div className="py-16 md:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            <BorderRail orientation="vertical" length={132} tone="ivory" />
            <div className="measure">
              <h2 className="text-36 text-indigo-600 md:text-48">Generated swatches</h2>
              <p className="mt-4 text-18 text-ink/80">
                Every image below is procedurally drawn as SVG by{" "}
                <code className="text-16">npm run swatches</code> and rasterised
                with sharp. Output is deterministic.
              </p>
            </div>
          </div>

          {PATTERNS.map((product) => (
            <section key={product.slug} className="mt-16">
              <h3 className="text-28 text-indigo-600">{product.name}</h3>
              <div className="mt-6 space-y-10">
                {product.colourways.map((slug) => {
                  const cw = COLOURWAYS.find((c) => c.slug === slug);
                  if (!cw) return null;
                  return (
                    <div key={slug}>
                      <p className="text-16 text-ink/70">{cw.name}</p>
                      <div className="mt-3 grid gap-4 md:grid-cols-3">
                        {(["flat", "stack", "detail"] as const).map((type) => (
                          <figure key={type}>
                            <Image
                              src={swatchPath(product.slug, slug, type)}
                              alt={`${product.name}, ${cw.name}, ${type}`}
                              width={type === "detail" ? 1200 : 1600}
                              height={1200}
                              className="w-full"
                            />
                            <figcaption className="mt-2 text-14 text-ink/70">{type}</figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
