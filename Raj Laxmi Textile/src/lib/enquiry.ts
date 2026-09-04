import { z } from "zod";

/** Shared by the form and the API route, so both validate identically. */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please give your name").max(120),
  business: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(7, "Please give a phone number we can reach you on")
    .max(24),
  email: z.string().trim().email("That does not look like an email address").or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us the design, colourways and quantity")
    .max(2000),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export type EnquiryResponse =
  | { ok: true; delivered: boolean }
  | { ok: false; error: string };
