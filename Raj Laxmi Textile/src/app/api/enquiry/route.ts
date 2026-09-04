import { NextResponse } from "next/server";

import { enquirySchema, type EnquiryResponse } from "@/lib/enquiry";
import {
  ENQUIRY_FROM_EMAIL,
  ENQUIRY_TO_EMAIL,
  SEND_ENQUIRIES,
} from "@/lib/flags";
import { BUSINESS } from "@/lib/constants";

export async function POST(request: Request): Promise<NextResponse<EnquiryResponse>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form and try again." },
      { status: 422 },
    );
  }

  const enquiry = parsed.data;

  /**
   * In prototype mode nothing is delivered. Demos of this site must not put
   * traffic into the business's real inbox.
   */
  if (!SEND_ENQUIRIES) {
    console.info(
      "[prototype] enquiry received, not sent:",
      JSON.stringify(enquiry, null, 2),
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  if (!ENQUIRY_TO_EMAIL) {
    console.error("ENQUIRY_TO_EMAIL is not set; cannot deliver enquiry.");
    return NextResponse.json(
      { ok: false, error: "Enquiries are not configured. Please call or use WhatsApp." },
      { status: 500 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; cannot deliver enquiry.");
    return NextResponse.json(
      { ok: false, error: "Enquiries are not configured. Please call or use WhatsApp." },
      { status: 500 },
    );
  }

  const lines = [
    `Name: ${enquiry.name}`,
    enquiry.business ? `Business: ${enquiry.business}` : null,
    `Phone: ${enquiry.phone}`,
    enquiry.email ? `Email: ${enquiry.email}` : null,
    "",
    enquiry.message,
  ].filter(Boolean);

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: ENQUIRY_FROM_EMAIL,
      to: ENQUIRY_TO_EMAIL,
      replyTo: enquiry.email || undefined,
      subject: `Website enquiry — ${enquiry.name}`,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("Resend rejected the enquiry:", error);
      return NextResponse.json(
        {
          ok: false,
          error: `Could not send that. Please call ${BUSINESS.phone} or use WhatsApp.`,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("Failed to send enquiry:", error);
    return NextResponse.json(
      {
        ok: false,
        error: `Could not send that. Please call ${BUSINESS.phone} or use WhatsApp.`,
      },
      { status: 502 },
    );
  }
}
