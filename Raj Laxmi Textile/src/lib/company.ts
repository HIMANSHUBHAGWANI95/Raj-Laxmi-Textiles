/**
 * Company facts and narrative copy. Contact details are not repeated here —
 * they live in constants.ts as the single BUSINESS object.
 */

import { BUSINESS } from "./constants";

export const COMPANY = {
  business: BUSINESS,

  /** One-line description used in metadata and the footer. */
  summary:
    "Wholesale manufacturers of hand screen-printed Jaipuri bedsheets, supplying traders and retailers across India.",

  /** What the unit actually does, for the about section. */
  capabilities: [
    "Screen cutting from original buti drawings",
    "Table screen printing on a 40-metre table",
    "Curing, washing and drying",
    "Cutting, hemming and baling to a buyer's assortment",
  ],

  /** Commercial terms shown alongside the range. */
  terms: {
    moqPieces: 50,
    samplingLeadTime: "About a week",
    productionLeadTime: "Two to three weeks depending on the wash",
    dispatch: "Ex-unit; transport to most major markets can be arranged",
    quoteBasis: "Ex-Jaipur, exclusive of GST",
  },

  /** Standing quality options offered across the range. */
  qualities: [
    {
      name: "Standard",
      gsm: 120,
      detail: "100% cotton, 60 x 60 combed, reactive dyes, pre-shrunk.",
    },
    {
      name: "Premium",
      gsm: 144,
      detail:
        "100% cotton, 60 x 60 combed, reactive dyes, pre-shrunk. Denser cloth, holds the print more sharply.",
    },
  ],
} as const;
