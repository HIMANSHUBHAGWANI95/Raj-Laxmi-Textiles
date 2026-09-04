import type { Metadata } from "next";
import Image from "next/image";

import { Section } from "@/components/site/Section";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { BorderRail } from "@/components/site/BorderRail";
import { getSiteImage, imgProps } from "@/lib/images";
import { COMPANY } from "@/lib/company";
import { whatsappHref } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How We Print — Hand Screen Printing in Jaipur",
  description:
    "How Raj Laxmi Textiles prints: screens cut by hand from the original drawing, pulled down a 40-metre table, cured, washed and finished in one unit.",
};

const STEPS = [
  {
    key: "craft-screens",
    title: "Screens cut by hand",
    alt: "Cut screens racked in the workshop",
    body: "Every colour in a design gets its own screen, cut in the workshop from the original buti drawing. A design running eleven colours needs eleven screens, and each one has to register against the last within a millimetre.",
  },
  {
    key: "craft-printing-table",
    title: "Pulled down the table",
    alt: "A printer pulling a screen along the printing table",
    body: "Cloth is pinned along a forty-metre table and each screen is pulled down its length in turn, by hand. Nothing here is rotary. A printer walks the table once per colour, and the whole length must dry before the next screen goes down.",
  },
  {
    key: "craft-drying",
    title: "Cured, washed, dried",
    alt: "Printed lengths laid out to dry",
    body: "Printed lengths are cured to fix the reactive dye, washed to drop whatever did not bond, and dried before finishing. The wash is what decides whether colour holds, and it is the step most often skimped elsewhere.",
  },
  {
    key: "wholesale-packing",
    title: "Cut, hemmed, baled",
    alt: "Finished sheets folded and baled for dispatch",
    body: "Sheets are cut to size with the shrinkage allowance built in, hemmed, folded and baled to whatever colour assortment the buyer has asked for. A mixed bale costs us no more than a single-shade one.",
  },
] as const;

export default function CraftPage() {
  return (
    <>
      <section className="bg-indigo-900 pt-header pb-12 md:pb-16">
        <div className="mx-auto w-full max-w-site px-6 md:px-12">
          <Breadcrumbs crumbs={[{ label: "Home", href: "/" }, { label: "How we print" }]} />
          <div className="mt-6 flex flex-col gap-5 md:flex-row md:gap-8">
            <BorderRail orientation="vertical" length={140} tone="indigo" />
            <div>
              <h1 className="text-36 text-ivory md:text-48">Table printing, by hand</h1>
              <p className="measure mt-3 text-18 text-ivory/80">
                Screens, tables, washing and finishing all under one roof at{" "}
                {COMPANY.business.address.street}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {STEPS.map((step, index) => (
        <Section
          key={step.key}
          tone={index % 2 === 0 ? "ivory" : "sand"}
          title={`${index + 1}. ${step.title}`}
        >
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <Image
              {...imgProps(getSiteImage(step.key))}
              sizes="(min-width: 1024px) 48vw, 92vw"
              alt={step.alt}
              className="w-full"
            />
            <p className="measure text-18 text-ink/85">{step.body}</p>
          </div>
        </Section>
      ))}

      <Section tone="indigo" title="Bulk ka kaam? Baat karte hain">
        <div className="measure">
          <p className="text-18 text-ivory/80">
            Sampling takes {COMPANY.terms.samplingLeadTime.toLowerCase()}, production{" "}
            {COMPANY.terms.productionLeadTime}. {COMPANY.terms.quoteBasis}.
          </p>
          <div className="mt-8">
            <Button href={whatsappHref()} variant="enquiry" size="lg">
              Send a WhatsApp enquiry
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
