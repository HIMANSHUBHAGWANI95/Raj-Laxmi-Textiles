import { BUSINESS, formatPhone, telHref, whatsappHref } from "@/lib/constants";

const MESSAGE = `Hello ${BUSINESS.name}, I would like wholesale pricing for Jaipuri bedsheets.`;

export function StickyEnquiryBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t-2 border-marigold md:hidden">
      <a
        href={whatsappHref(MESSAGE)}
        className="flex min-h-14 items-center justify-center bg-leaf text-16 font-semibold text-ivory"
      >
        WhatsApp
      </a>
      <a
        href={telHref}
        className="flex min-h-14 items-center justify-center bg-indigo-900 text-16 font-semibold text-ivory"
      >
        Call {formatPhone()}
      </a>
    </div>
  );
}
