import Image from "next/image";
import Link from "next/link";
import { Section, Container } from "@/components/site/Section";
import { BorderRail } from "@/components/site/BorderRail";
import { Button } from "@/components/site/Button";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PriceFrom } from "@/components/product/PriceFrom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRODUCTS, SIZE_LABELS, CATEGORY_LABELS } from "@/lib/products";
import { getProductImage, getSiteImage, imgProps } from "@/lib/images";
import { productColourways } from "@/lib/content";
import { COMPANY } from "@/lib/company";
import { FAQS } from "@/lib/faqs";
import {
  BUSINESS,
  addressLines,
  formatPhone,
  telHref,
  whatsappHref,
} from "@/lib/constants";

const PROCESS_STEPS = [
  {
    title: "Screens cut by hand",
    body: "Each colour in a design gets its own screen, cut in the workshop from the original buti drawing.",
    image: "craft-screens",
    alt: "Cut screens racked in the workshop",
  },
  {
    title: "Table printing",
    body: "Cloth is pinned along a 40-metre table and each screen is pulled down its length in turn, by hand.",
    image: "craft-printing-table",
    alt: "A printer pulling a screen along the printing table",
  },
  {
    title: "Fixing and washing",
    body: "Printed lengths are cured, washed to drop the loose dye, and dried before the border is finished.",
    image: "craft-drying",
    alt: "Printed lengths laid out to dry",
  },
  {
    title: "Cut, hemmed, baled",
    body: "Sheets are cut to size, hemmed and baled in the colour assortment the buyer has asked for.",
    image: "wholesale-packing",
    alt: "Finished sheets folded and baled for dispatch",
  },
] as const;

const FEATURED = ["sanganeri-booti-jaal-double", "jaipuri-bel-buti-double", "dhari-border-classic-single", "discharge-indigo-buti-double"];

export default function HomePage() {
  const featured = FEATURED.map((slug) => PRODUCTS.find((p) => p.slug === slug)!).filter(Boolean);

  return (
    <>
      {/* Hero — a full-bleed indigo band, the sheet shown beside the type. */}
      <section className="relative bg-indigo-900 pt-32 pb-16 md:pt-40 md:pb-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col gap-5 md:flex-row md:gap-8">
              <BorderRail orientation="vertical" length={300} tone="indigo" />
              <div>
                <h1 className="text-48 text-ivory md:text-64">
                  Jaipuri screen-printed bedsheets, by the bale
                </h1>
                <p className="measure mt-6 text-18 text-ivory/80">
                  We print, cut and finish bedsheets in {BUSINESS.address.city} and
                  supply them wholesale to traders and retailers across India.
                  Twelve designs in production, minimum order{" "}
                  {COMPANY.terms.moqPieces} pieces.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Button href={whatsappHref()} variant="enquiry" size="lg">
                    Send a WhatsApp enquiry
                  </Button>
                  <Button href="/products" variant="link-underline-inverse" size="lg">
                    See the current range
                  </Button>
                </div>
              </div>
            </div>

            <Image
              {...imgProps(getSiteImage("hero-bed"))}
              alt="A bed made up in a Jaipuri printed sheet"
              priority
              className="w-full"
            />
          </div>
        </Container>
      </section>

      <Section
        id="products"
        tone="ivory"
        title="The current range"
        intro="Twelve designs across four families, in single, double and king sizes, each printed in a standing colourway set."
      >
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2">
          {featured.map((product) => (
            <article key={product.slug}>
              <Link href={`/products#${product.slug}`} className="group block">
                <Image
                  {...imgProps(
                    getProductImage(product, productColourways(product)[0].slug, "flat"),
                  )}
                  alt={`${product.name}, laid flat`}
                  className="w-full"
                />
                <h3 className="mt-5 text-28 text-indigo-600 underline decoration-transparent decoration-2 underline-offset-[8px] group-hover:decoration-marigold">
                  {product.name}
                </h3>
              </Link>
              <p className="mt-2 text-16 text-ink/70">
                {CATEGORY_LABELS[product.category]}, {SIZE_LABELS[product.size]},{" "}
                {product.fabric.gsm} GSM
              </p>
              <p className="measure mt-3 text-16 text-ink/80">{product.description}</p>
              <PriceFrom product={product} className="mt-4" />
            </article>
          ))}
        </div>

        <div className="mt-14">
          <Button href="/products" variant="ghost">
            See all twelve designs
          </Button>
        </div>
      </Section>

      <Section
        id="process"
        tone="indigo"
        title="How the cloth is printed"
        intro="Every metre we ship is printed by hand on the table. Nothing is rotary."
      >
        <ol className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.title}>
              <Image
                {...imgProps(getSiteImage(step.image))}
                alt={step.alt}
                className="mb-5 w-full"
              />
              <BorderRail
                orientation="horizontal"
                length={220}
                tone="indigo"
                responsive={false}
                className="w-full"
              />
              <h3 className="mt-5 text-22 text-ivory">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-3 text-16 text-ivory/75">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="about"
        tone="sand"
        title="A working print unit, not a trading house"
        intro={`${BUSINESS.name} prints Jaipuri bedsheets at ${BUSINESS.address.street}, on the northern edge of ${BUSINESS.address.city}.`}
      >
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="measure space-y-5 text-18 text-ink/85">
            <p>
              Screens, tables, washing and finishing all sit under one roof, so a
              buyer who wants a colourway changed or a border narrowed is talking
              to the people who will actually pull the screen.
            </p>
            <p>
              Sampling takes {COMPANY.terms.samplingLeadTime.toLowerCase()}. A
              production run takes {COMPANY.terms.productionLeadTime}.
            </p>
            <ul className="space-y-2">
              {COMPANY.capabilities.map((capability) => (
                <li key={capability} className="border-l-2 border-marigold pl-4">
                  {capability}
                </li>
              ))}
            </ul>
          </div>

          <Image
            {...imgProps(getSiteImage("about-shop-front"))}
            alt="The unit at Jai Hanuman Plaza"
            className="w-full"
          />
        </div>
      </Section>

      <Section
        id="faqs"
        tone="ivory"
        title="Questions buyers ask"
        intro="If something is not covered here, send it on WhatsApp and we will answer directly."
      >
        <Accordion className="max-w-3xl">
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-18 text-ink">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-16 text-ink/80">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <Section
        id="contact"
        tone="sand"
        title="Ask for a rate list"
        intro="Tell us the design, the colourways and the quantity, and we will send rates the same day."
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <dl className="space-y-6 text-18">
              <div>
                <dt className="text-16 font-semibold text-ink">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={telHref}
                    className="text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                  >
                    {formatPhone()}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-16 font-semibold text-ink">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="break-all text-cobalt underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                  >
                    {BUSINESS.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-16 font-semibold text-ink">The unit</dt>
                <dd className="mt-1 text-ink/80">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-16 font-semibold text-ink">Terms</dt>
                <dd className="mt-1 text-ink/80">
                  {COMPANY.terms.quoteBasis}. Minimum order{" "}
                  {COMPANY.terms.moqPieces} pieces per design and size.
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <Button href={whatsappHref()} variant="primary" size="lg">
                Message us on WhatsApp
              </Button>
            </div>
          </div>

          <EnquiryForm />
        </div>
      </Section>
    </>
  );
}
