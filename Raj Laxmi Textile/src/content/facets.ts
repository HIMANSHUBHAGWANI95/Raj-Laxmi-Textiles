/**
 * The faceted catalogue.
 *
 * Every value here is a real route at /collections/{group}/{value} with its
 * own title, meta description, hero line and body copy. Nothing is templated —
 * duplicated copy across facet pages is the fastest way to make a catalogue
 * look machine-generated, and `npm run validate` fails the build if any two
 * facet pages share a sentence.
 *
 * The rate group is special: it renders only when SHOW_PRICES is true and is
 * hidden entirely — nav, footer, routes and sitemap — when false.
 */

export type FacetGroupId = "print" | "fabric" | "size" | "use" | "rate";

export type FacetValue = {
  slug: string;
  /** Short label for nav, filters and breadcrumbs. */
  label: string;
  /** <title> for the facet route. */
  title: string;
  /** <meta name="description">. */
  metaDescription: string;
  /** One line under the H1. */
  heroLine: string;
  /** Body copy, two paragraphs. Distinct per value. */
  body: [string, string];
};

export type FacetGroup = {
  id: FacetGroupId;
  /** Path segment: /collections/{slug}/... */
  slug: string;
  label: string;
  /** Shown as the column heading in the mega menu. */
  menuHeading: string;
  /** Hidden entirely when SHOW_PRICES is false. */
  pricedOnly?: boolean;
  values: FacetValue[];
};

export const FACET_GROUPS: FacetGroup[] = [
  {
    id: "print",
    slug: "print",
    label: "Print",
    menuHeading: "By print",
    values: [
      {
        slug: "sanganeri",
        label: "Sanganeri",
        title: "Sanganeri Print Bedsheets — Wholesale from Jaipur",
        metaDescription:
          "Sanganeri hand screen-printed bedsheets in bulk from a Jaipur print unit. Fine floral jaal on a light ground, five colourways, minimum fifty pieces.",
        heroLine:
          "Fine floral jaal on a light ground, printed on the table one screen at a time.",
        body: [
          "Sanganeri printing takes its name from the town south of Jaipur where the style settled, and its defining habit is restraint: small flowers held in a regular jaal, printed dark on light rather than the other way round. The drawings we cut for this family stay under twelve millimetres across, which is what keeps a double bedsheet reading as cloth rather than as a poster.",
          "For a counter this is the safest thing we print. It suits buyers who need a design that will not date across a season and that photographs cleanly for a catalogue. Ask for the light grounds if you are supplying a market that resells to households, and the deeper grounds if the sheets go to institutional buyers who wash hot and often.",
        ],
      },
      {
        slug: "jaipuri-floral",
        label: "Jaipuri floral",
        title: "Jaipuri Floral Bedsheets — Bulk Manufacturer, Jaipur",
        metaDescription:
          "Large-scale Jaipuri floral bedsheets, hand screen-printed in Jaipur and supplied wholesale. Wide field motifs for double, queen and king sizes.",
        heroLine: "The larger drawing: open florals scaled for a full bed width.",
        body: [
          "Where Sanganeri stays small and repetitive, the Jaipuri floral family opens the drawing out. A single flower head can run sixty to ninety millimetres, spaced far enough apart that the ground colour carries as much of the sheet as the print does. That scale only works above a certain bed size, which is why most of this family is cut for queen and king.",
          "These are the designs buyers pick when the sheet has to hold a room on its own — a plain bed in a plain room, no headboard, nothing else patterned. The trade-off is that a large motif shows registration drift more plainly than a small one, so we check the screen against the table at the start of every length rather than every third.",
        ],
      },
      {
        slug: "bel-buti",
        label: "Bel buti",
        title: "Bel Buti Bedsheets — Vine and Buti Prints Wholesale",
        metaDescription:
          "Bel buti bedsheets from a Jaipur manufacturer: a climbing vine border with a scattered buti field, screen-printed on cotton and sold by the bale.",
        heroLine: "A climbing vine down the border, a scattered buti across the field.",
        body: [
          "Bel means the creeper and buti the small flower it carries, and the family is defined by the relationship between the two: the vine runs the length of the border panel, the buti repeats loose across the field, and both are cut from the same original drawing so the weight matches. Get that wrong and the border looks bolted on.",
          "This is the house style and the one we have printed longest. It carries more screens than our other families — nine to eleven, against eight for a plain border — which is why the rate sits higher per piece. Buyers who take it once tend to reorder it, because the vine reads as deliberate work in a way that a simple stripe does not.",
        ],
      },
      {
        slug: "striped-border",
        label: "Striped border",
        title: "Striped Border Bedsheets — Wholesale Rates, Jaipur",
        metaDescription:
          "Striped border bedsheets in bulk from Jaipur. A plain printed field with the pattern concentrated in the border panel. The most economical screen count we run.",
        heroLine: "The pattern held in the border, the field left quiet.",
        body: [
          "The whole design sits in a band down one edge: pinstripes, a cobalt block, a leaf-green scalloped wave, and nothing much across the rest of the sheet. Because the printed area is smaller, the cloth carries less paste, softens faster in the wash, and costs less per piece than anything else we make at the same quality.",
          "It is the volume line. Buyers supplying price-sensitive counters take it in mixed colourway bales because the border does the work of distinguishing one shade from another on a shelf. The tightest registration in our range is here too — the pinstripes are pulled as a single screen specifically so they stay parallel down forty metres of table.",
        ],
      },
      {
        slug: "discharge",
        label: "Discharge",
        title: "Discharge Print Bedsheets — Piece-Dyed, Bleached Motif",
        metaDescription:
          "Discharge print bedsheets from Jaipur. The ground is piece-dyed first and the motif bleached back out of it, giving a softer motif edge than a reactive print.",
        heroLine: "The white comes out of the cloth, not out of a screen.",
        body: [
          "In a discharge print the cotton is dyed to full depth first, then a paste is printed that removes the dye where the motif sits. The white you see is the cloth itself coming back, not a white pigment laid on top. That produces a softer motif edge and a hand where the cleared areas sit very slightly lighter than the dyed ground.",
          "It is the most technically demanding thing we print and the least forgiving of a wet season — discharge depends on the cure, and the cure depends on the weather. We hold these to a longer lead time for that reason. Shade variation between production lots is wider here than on our reactive prints, so repeat orders are matched to an approved swatch rather than to the last delivery.",
        ],
      },
      {
        slug: "bagru",
        label: "Bagru",
        title: "Bagru Print Bedsheets — Mud-Resist Style, Jaipur",
        metaDescription:
          "Bagru-style bedsheets from a Jaipur unit: earth-toned grounds and a resist-print character, screen-printed on cotton and supplied wholesale.",
        heroLine: "Earth grounds and a resist character, in the Bagru manner.",
        body: [
          "Bagru is a village west of Jaipur whose printers work in mud resist and natural dye, and the look that comes out of it is unmistakable: black and madder on an ochre or oatmeal ground, motifs that sit slightly irregular because the resist does not hold a perfect edge. Our version is screen-printed rather than block-printed with true mud resist, and we say so plainly — the character is Bagru, the process is ours.",
          "Buyers take this family for the colour more than the drawing. The earth grounds sit differently on a shelf next to indigo and madder, and they suit export orders where a buyer wants something that reads as hand-made without the price of genuine dabu work. If you need true mud-resist Bagru we will tell you where to get it rather than sell you this instead.",
        ],
      },
    ],
  },

  {
    id: "fabric",
    slug: "fabric",
    label: "Fabric",
    menuHeading: "By fabric",
    values: [
      {
        slug: "pure-cotton",
        label: "Pure cotton",
        title: "Pure Cotton Bedsheets — 100% Cotton, Wholesale Jaipur",
        metaDescription:
          "100% cotton bedsheets, hand screen-printed in Jaipur. No polyester blend in any quality we run. Bulk supply to traders and institutions.",
        heroLine: "Every quality we run is 100% cotton. There is no blend option.",
        body: [
          "We do not print on a poly-cotton blend, and we will not quote for one. Reactive dyes bond to cellulose; on a blend the polyester fraction simply does not take the colour, and what you get is a washed-out version of the shade you approved on the strike-off. Buyers who need a blend for price are better served elsewhere, and we say that at the enquiry stage rather than after the sample.",
          "Everything under this heading is therefore a question of construction rather than composition — how the cotton is spun, how tightly it is woven, and how it is finished. The qualities differ in weight and hand, not in what they are made of.",
        ],
      },
      {
        slug: "combed-60x60",
        label: "Combed 60x60",
        title: "Combed 60x60 Cotton Bedsheets — Standard Quality",
        metaDescription:
          "Combed 60x60 cotton bedsheets from Jaipur, 120 and 144 GSM. The standard construction across our range, supplied wholesale by the bale.",
        heroLine: "Sixty by sixty, combed. The construction most of our range runs on.",
        body: [
          "Sixty warp by sixty weft, combed rather than carded — the combing pulls out the short fibres before spinning, which is why the surface takes a fine screen without the print feathering along a thread. We run it at 120 GSM as standard and 144 GSM as premium; the difference is felt immediately in the hand and shows over time in how sharply the print holds.",
          "This is the default. If an enquiry does not specify a construction, this is what we quote, because it is the one we hold in stock and the one our screens are cut against. Anything else is a production run rather than a stock pull, which affects lead time more than it affects price.",
        ],
      },
      {
        slug: "twill-cotton",
        label: "Twill cotton",
        title: "Twill Cotton Bedsheets — Diagonal Weave, Bulk Supply",
        metaDescription:
          "Twill weave cotton bedsheets printed in Jaipur. A heavier, denser cloth with a diagonal surface, suited to institutional laundering.",
        heroLine: "A diagonal weave: heavier, denser, and slower to show wear.",
        body: [
          "Twill runs the weft over and under in a staggered pass, which produces the diagonal line you can see if you hold the cloth to the light. The structure makes it heavier and more resistant to abrasion than a plain weave at the same yarn count, and it drapes with more weight over the side of a bed.",
          "We recommend it where sheets are washed industrially — hotels, hostels, hospitals — because the weave survives the mechanical action better than percale does. The cost is that a diagonal surface takes a fine motif slightly less crisply, so we tend to pair twill with the larger drawings rather than the small Sanganeri jaal.",
        ],
      },
      {
        slug: "cotton-satin",
        label: "Cotton satin",
        title: "Cotton Satin Bedsheets — Sateen Finish, Wholesale",
        metaDescription:
          "Cotton satin bedsheets from a Jaipur manufacturer. A sateen weave with a low sheen surface, printed in our premium 144 GSM quality.",
        heroLine: "A sateen face with a low sheen, printed at premium weight.",
        body: [
          "Cotton satin — sateen, strictly, since the fibre is cotton and not silk — floats the warp over several weft threads to put more yarn surface on the face of the cloth. The result is a soft low sheen and a smoother hand, without any coating or finish being applied to achieve it.",
          "It is our most presentational quality and it goes almost entirely into festive and gifting orders. Two cautions worth stating: the floating yarns snag more readily than a plain weave, and the sheen makes shade variation between lots more visible, so we match repeats to an approved swatch. It is not the cloth for a hostel.",
        ],
      },
      {
        slug: "percale",
        label: "Percale",
        title: "Percale Cotton Bedsheets — Crisp Plain Weave, Jaipur",
        metaDescription:
          "Percale cotton bedsheets printed in Jaipur. A close plain weave with a crisp, cool hand, supplied wholesale in single and double sizes.",
        heroLine: "A close plain weave with a cool, crisp hand.",
        body: [
          "Percale is a tight one-over-one plain weave, and what a buyer notices is the crispness — it feels cool to the hand and makes a faint sound when it is shaken out. It softens with washing without going limp, which is the quality customers describe as a sheet getting better with age.",
          "We run it mainly in singles, because the crispness is most appreciated in hot months and single sheets turn over fastest in summer. The close weave also holds a small motif exceptionally well, which is why the fine buti designs sit on percale rather than on twill.",
        ],
      },
    ],
  },

  {
    id: "size",
    slug: "size",
    label: "Size",
    menuHeading: "By size",
    values: [
      {
        slug: "single",
        label: "Single",
        title: "Single Bedsheets Wholesale — 60x90 in, Jaipur",
        metaDescription:
          "Single bedsheets 60x90 inches with one pillow cover, screen-printed in Jaipur. Wholesale supply from fifty pieces.",
        heroLine: "60 x 90 inches, one sheet and one pillow cover.",
        body: [
          "The single is sixty by ninety inches with a single pillow cover, cut with the three to four per cent shrinkage allowance already built in so the finished size after a first wash is close to what is stated. It is the fastest-moving size we make in summer and the one most often taken in mixed colourway bales.",
          "Hostels, guest houses and institutional buyers take singles in quantity, which is why we hold more standing stock in this size than any other. If you need an unusual quantity split across colourways, singles are the easiest size for us to accommodate without a production run.",
        ],
      },
      {
        slug: "double",
        label: "Double",
        title: "Double Bedsheet Wholesale Rate — 90x100 in, Jaipur",
        metaDescription:
          "Double bedsheets 90x100 inches with two pillow covers, hand screen-printed in Jaipur. Wholesale rates, minimum fifty pieces.",
        heroLine: "90 x 100 inches, one sheet and two pillow covers.",
        body: [
          "Ninety by a hundred inches with two pillow covers. This is the volume size for the Indian domestic trade and it is where most of our production goes — if a design runs at all, it runs as a double first and the other sizes follow.",
          "Because the field is wide enough to carry a full repeat but not so wide that a small motif disappears, every one of our print families is available in this size. If you are ordering a first bale to test a counter, take it as a double.",
        ],
      },
      {
        slug: "queen",
        label: "Queen",
        title: "Queen Size Bedsheets — Bulk Supply from Jaipur",
        metaDescription:
          "Queen size printed cotton bedsheets from Jaipur, cut at 90x100 inches with two pillow covers. Wholesale supply to traders and hotels.",
        heroLine: "Cut on the same 90 x 100 pattern as our double.",
        body: [
          "In this trade queen and double are cut to the same ninety by a hundred pattern; the distinction is one of naming rather than of dimension, and we would rather say so than imply a difference that is not there. If your market expects a larger queen, tell us at the enquiry and we will quote a cut-to-size run.",
          "Where the label matters is on the packaging and the invoice, and we will bale and mark to whichever term your buyers use. Export orders in particular tend to want queen on the carton even when the measurement is identical to the domestic double.",
        ],
      },
      {
        slug: "king",
        label: "King",
        title: "King Size Bedsheets Wholesale — 108x108 in",
        metaDescription:
          "King size bedsheets 108x108 inches with two pillow covers, screen-printed in Jaipur. Larger-scale designs suited to the full width.",
        heroLine: "108 x 108 inches, printed with the larger drawings.",
        body: [
          "A hundred and eight inches square with two pillow covers. The width changes which designs make sense: a small buti scattered across this area reads as noise from across a room, so we put our larger-scale drawings here and space them further apart than we would on a double.",
          "The longer table run also means registration is checked mid-length as well as at the start, because a screen can drift over a hundred and eight inches in a way it does not over ninety. Expect a slightly higher rate per piece for that attention as well as for the cloth.",
        ],
      },
      {
        slug: "super-king",
        label: "Super king",
        title: "Super King Bedsheets — Oversize Cotton, Made to Order",
        metaDescription:
          "Super king oversize cotton bedsheets from Jaipur, made to order above the standard 108x108 king. Enquire for cut-to-size wholesale runs.",
        heroLine: "Above 108 inches, cut to order rather than held in stock.",
        body: [
          "Anything above the standard king is a made-to-order run for us. We do not hold super king in stock because the domestic trade does not move enough of it to justify the cloth sitting on a shelf, but the cloth width allows it and the screens are the same, so it is a scheduling question rather than a technical one.",
          "Give us the finished dimensions you need and the quantity, and we will come back with a rate and a lead time. Below about a hundred pieces the per-piece cost rises noticeably, because a short run carries the same table setup as a long one.",
        ],
      },
    ],
  },

  {
    id: "use",
    slug: "use",
    label: "Use",
    menuHeading: "By use",
    values: [
      {
        slug: "retail-counter",
        label: "Retail counter",
        title: "Bedsheets for Retail Counters — Mixed Bale Wholesale",
        metaDescription:
          "Printed cotton bedsheets for retail counters, supplied in mixed colourway bales from a Jaipur manufacturer. Minimum fifty pieces per design.",
        heroLine: "Mixed colourway bales for a shop counter that has to turn stock.",
        body: [
          "A counter needs range more than it needs depth. The fifty-piece minimum can be split across all five colourways of a design, which lets a shop show the full spread without carrying fifty of one shade — and colour, not drawing, is what a walk-in customer chooses on.",
          "Our advice after twenty years of supplying this trade: take two designs in five colourways rather than five designs in two. A customer compares shades of the same sheet far more readily than they compare two different prints, and the one that moves tells you what to reorder.",
        ],
      },
      {
        slug: "hotel-institutional",
        label: "Hotel and institutional",
        title: "Hotel and Institutional Bedsheets — Bulk Cotton Supply",
        metaDescription:
          "Cotton bedsheets for hotels, hostels and institutions. Heavier constructions built for industrial laundering, supplied in bulk from Jaipur.",
        heroLine: "Built for hot, frequent, industrial washing.",
        body: [
          "Institutional buying is a durability question, not a design one. What matters is how the cloth behaves after two hundred industrial washes: whether the weave holds, whether the shade drops, and whether the hem survives a mechanical press. For that we steer buyers to the heavier constructions and the deeper grounds, which disguise the inevitable lightening far better than a pale ground does.",
          "We will also print to a property's own colourway if the quantity justifies cutting screens, and we keep the original drawing on file so a reorder in two years matches the first delivery. Ask about repeat-order matching at the enquiry rather than after the first bale.",
        ],
      },
      {
        slug: "export",
        label: "Export",
        title: "Export Bedsheets from Jaipur — Bulk Cotton Supply",
        metaDescription:
          "Hand screen-printed cotton bedsheets for export buyers, supplied from Jaipur with swatch-matched repeat orders and cut-to-size runs.",
        heroLine: "For buyers ordering out of India, with matching held to a swatch.",
        body: [
          "Export buyers ask different questions from domestic ones: consistency across shipments, dimensions in their own market's convention, and documentation that matches the carton. We match repeats to an approved physical swatch rather than to the previous delivery, which is the only way to stop a slow drift across four or five reorders.",
          "We quote ex-Jaipur and exclusive of GST, and we do not pretend to be a freight forwarder — we will bale to your specification and hand over to the agent you nominate. If you need cut-to-size dimensions for a market that does not use Indian bed sizes, that is a production run and we will price it as one.",
        ],
      },
      {
        slug: "festive-gifting",
        label: "Festive and gifting",
        title: "Festive and Gifting Bedsheets — Presentation Quality",
        metaDescription:
          "Presentation-quality printed cotton bedsheets for festive and gifting ranges, in premium 144 GSM and sateen finishes from Jaipur.",
        heroLine: "The presentation qualities, for stock that has to look like a gift.",
        body: [
          "Gifting stock is judged folded and in the hand, not made up on a bed, which changes what matters. Weight reads as quality through packaging, so this is where our 144 GSM premium and the sateen finish belong; a 120 GSM sheet that performs perfectly well on a bed will feel thin through a cellophane sleeve.",
          "Seasonal demand is concentrated and lead times tighten sharply from about six weeks before Diwali. If you are planning a festive range, sample in monsoon and confirm quantities well before the season — a run confirmed in October is competing with everyone else's.",
        ],
      },
    ],
  },

  {
    id: "rate",
    slug: "rate",
    label: "Rate",
    menuHeading: "By rate",
    pricedOnly: true,
    values: [
      {
        slug: "under-200",
        label: "Under ₹200",
        title: "Bedsheets Under ₹200 per Piece — Wholesale Rates",
        metaDescription:
          "Printed cotton bedsheets under ₹200 per piece at minimum order, ex-Jaipur before GST. Indicative rates confirmed on enquiry.",
        heroLine: "Under ₹200 a piece at minimum order, ex-Jaipur before GST.",
        body: [
          "This band is almost entirely singles in the 120 GSM standard quality, and the designs in it are the ones with the lowest screen counts. Nothing here is a lesser cloth than the rest of the range — the same combed cotton, the same reactive dyes — it is simply less printed area and a smaller cut.",
          "Rates fall further at two hundred and five hundred pieces. If you are working to a landed price for a price-sensitive counter, tell us the number you need to hit and we will tell you honestly whether a design in this band can reach it.",
        ],
      },
      {
        slug: "200-300",
        label: "₹200 to ₹300",
        title: "Bedsheets ₹200 to ₹300 per Piece — Bulk Rates, Jaipur",
        metaDescription:
          "Printed cotton bedsheets between ₹200 and ₹300 per piece at minimum order, ex-Jaipur before GST. Wholesale supply from fifty pieces.",
        heroLine: "Between ₹200 and ₹300 a piece at minimum order.",
        body: [
          "The narrowest band in the range, and something of a crossover: premium 144 GSM cloth in a single size lands here, as does the occasional standard-quality double. It suits a buyer who wants the heavier cloth without moving up to a double-size rate.",
          "Because the band is thin, it is worth looking either side of it. A design just below may suit the same counter at better margin, and one just above usually buys a noticeably denser cloth for the difference.",
        ],
      },
      {
        slug: "300-400",
        label: "₹300 to ₹400",
        title: "Bedsheets ₹300 to ₹400 per Piece — Wholesale, Jaipur",
        metaDescription:
          "Double and queen printed cotton bedsheets between ₹300 and ₹400 per piece at minimum order, ex-Jaipur before GST, from a Jaipur print unit.",
        heroLine: "Between ₹300 and ₹400 a piece — where most of our range sits.",
        body: [
          "The centre of the catalogue. Nearly every double and queen we make falls in this band, across all six print families and both cloth weights, which makes it the right place to start if you are choosing on design rather than on price.",
          "The spread within the band is mostly cloth weight and screen count: a 120 GSM striped border sits at the bottom, a 144 GSM discharge print with ten screens at the top. Both are doubles; the difference in the hand is obvious side by side.",
        ],
      },
      {
        slug: "above-400",
        label: "Above ₹400",
        title: "Premium Bedsheets Above ₹400 per Piece — King Sizes",
        metaDescription:
          "Premium king size printed cotton bedsheets above ₹400 per piece at minimum order, ex-Jaipur before GST. Heavier cloth, higher screen counts.",
        heroLine: "Above ₹400 a piece: king sizes and the highest screen counts.",
        body: [
          "Everything in this band is a king, and most of it is 144 GSM with ten or eleven screens. You are paying for cloth area first and screen count second — a hundred and eight inch square takes appreciably more cotton than a ninety by a hundred, before anything is printed on it.",
          "This is where per-piece rate is the most misleading way to compare. Work it out per bed rather than per piece, and the gap between a king here and a double in the band below narrows considerably.",
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Lookups
 * ------------------------------------------------------------------ */

export function getFacetGroup(slug: string): FacetGroup | undefined {
  return FACET_GROUPS.find((g) => g.slug === slug);
}

export function getFacetValue(
  groupSlug: string,
  valueSlug: string,
): { group: FacetGroup; value: FacetValue } | undefined {
  const group = getFacetGroup(groupSlug);
  if (!group) return undefined;
  const value = group.values.find((v) => v.slug === valueSlug);
  if (!value) return undefined;
  return { group, value };
}

export function facetHref(groupSlug: string, valueSlug: string) {
  return `/collections/${groupSlug}/${valueSlug}`;
}

/** Groups visible given the current pricing flag. */
export function visibleFacetGroups(showPrices: boolean): FacetGroup[] {
  return FACET_GROUPS.filter((g) => !g.pricedOnly || showPrices);
}
