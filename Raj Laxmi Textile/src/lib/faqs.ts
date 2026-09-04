/**
 * Buyer-facing FAQs. Nothing here should state a price — pricing copy is
 * gated through the Price components (see src/lib/flags.ts).
 */

export type Faq = {
  question: string;
  answer: string;
};

export const FAQS: Faq[] = [
  {
    question: "What is the minimum order?",
    answer:
      "Fifty pieces per design and size. Those fifty can be split across the colourways in that design's set — a mixed bale is the usual first order.",
  },
  {
    question: "How long does an order take?",
    answer:
      "Sampling takes about a week. A production run takes two to three weeks from confirmation, depending on how long the wash and dry take at that time of year.",
  },
  {
    question: "Can I get a colourway that is not in the standing set?",
    answer:
      "Yes, on a production run. We match to a physical swatch you send us rather than to a screen reference, and we will send a strike-off for approval before printing the full quantity.",
  },
  {
    question: "Will the colour run in the wash?",
    answer:
      "Loose dye clears over the first two or three washes, which is normal for reactive-dyed cotton. After that the shade is stable through regular domestic washing. Dark grounds — indigo, cobalt and madder — should be washed separately the first time.",
  },
  {
    question: "Why do two sheets of the same design not match exactly?",
    answer:
      "Because they are printed by hand on a table, one screen at a time. Motif placement varies slightly between table lengths and the white outline can sit marginally off the fill. This is the register of hand screen printing, and we do not treat small variance as a defect.",
  },
  {
    question: "How much will the sheets shrink?",
    answer:
      "The cloth is pre-shrunk, with three to four per cent residual shrinkage. We cut with that allowance built in, so the finished size after a first wash is close to the stated size.",
  },
  {
    question: "What is the difference between the 120 and 144 GSM qualities?",
    answer:
      "The 144 GSM cloth is denser, sits flatter on the bed and holds the print more sharply over time. The 120 GSM cloth is lighter, softens faster and is the more common choice for volume orders.",
  },
  {
    question: "What is discharge printing?",
    answer:
      "The cloth is piece-dyed first and the motif is then bleached back out of the ground, so the white comes from the cloth rather than a white screen. It gives a softer motif edge than a reactive print.",
  },
  {
    question: "Do you quote delivered or ex-unit?",
    answer:
      "We quote ex-Jaipur, exclusive of GST. We can arrange transport to most major markets and will add it to the invoice at cost.",
  },
  {
    question: "Do you print for other brands?",
    answer:
      "Yes. We print to a buyer's own artwork provided the design suits table screen printing and the colour count is within twelve screens.",
  },
];
