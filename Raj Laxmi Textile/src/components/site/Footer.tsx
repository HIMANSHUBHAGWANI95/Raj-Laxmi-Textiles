import Link from "next/link";
import {
  BUSINESS,
  addressLines,
  formatPhone,
  mailHref,
  telHref,
  whatsappHref,
} from "@/lib/constants";
import { NAV_LINKS } from "@/lib/nav";
import { BorderRail } from "./BorderRail";

const CATEGORIES = [
  "Double bedsheets",
  "Single bedsheets",
  "Dohar and quilts",
  "Running fabric",
];

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-4 text-16 font-semibold text-ivory">{children}</h4>
  );
}

export function Footer() {
  return (
    <footer className="bg-indigo-900 text-ivory">
      <BorderRail orientation="horizontal" length={1280} tone="indigo" responsive={false} className="w-full" />

      <div className="mx-auto w-full max-w-site px-6 py-16 md:px-12 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="display-wonk block text-28 font-semibold text-ivory">
              {BUSINESS.name}
            </span>
            <span lang="hi" className="deva mt-2 block text-18 text-ivory/70">
              {BUSINESS.nameDevanagari}
            </span>
            <p className="mt-5 text-16 text-ivory/75">
              Wholesale manufacturers of hand screen-printed Jaipuri bedsheets,
              supplying traders and retailers across India.
            </p>
          </div>

          <div>
            <ColumnHeading>Visit the unit</ColumnHeading>
            <address className="text-16 leading-[1.7] text-ivory/75 not-italic">
              {addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="block">India</span>
            </address>
          </div>

          <div>
            <ColumnHeading>Get in touch</ColumnHeading>
            <ul className="space-y-3 text-16">
              <li>
                <a
                  href={telHref}
                  className="text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                >
                  {formatPhone()}
                </a>
              </li>
              <li>
                <a
                  href={whatsappHref()}
                  className="text-ivory underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4"
                >
                  WhatsApp enquiry
                </a>
              </li>
              <li>
                <a
                  href={mailHref}
                  className="break-all text-ivory/80 underline decoration-marigold decoration-2 underline-offset-[6px] hover:decoration-4 hover:text-ivory"
                >
                  {BUSINESS.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <ColumnHeading>What we print</ColumnHeading>
            <ul className="space-y-3 text-16 text-ivory/75">
              {CATEGORIES.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>
            <nav className="mt-8 flex flex-col gap-3 text-16">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-ivory/80 underline decoration-transparent decoration-2 underline-offset-[6px] hover:text-ivory hover:decoration-marigold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-marigold">
        <div className="mx-auto flex w-full max-w-site flex-col gap-2 px-6 py-6 text-14 text-ivory/60 md:flex-row md:items-center md:justify-between md:px-12">
          <span>
            {new Date().getFullYear()} {BUSINESS.name}
          </span>
          <span>
            {BUSINESS.address.city}, {BUSINESS.address.state}
          </span>
        </div>
      </div>
    </footer>
  );
}
