# Art prompts — photographic slots

Briefs for the nine photographic slots on the Raj Laxmi Textiles site. Each one
is currently filled by a labelled placeholder.

## Read this first

**Generated room imagery is for the prototype only. It must be replaced with
photographs of the actual product and the actual premises before the site is
shown to a buyer.**

This is not a nicety. A manufacturer's website showing a workshop that does not
exist, a shop front that is not theirs, or a team who are not their staff is a
credibility risk, not a shortcut. Wholesale buyers in this trade visit units,
ask for references, and recognise stock imagery. Being caught with invented
premises costs more trust than having no photograph at all.

If a real photograph cannot be taken in time, the honest options are, in order:

1. Take it on a phone. An ordinary, well-lit phone photograph of the real unit
   beats a polished render of a fictional one.
2. Leave the placeholder in. It is obviously provisional and reads as
   "photography pending", which is a normal state for a site in progress.
3. Remove the section from the page.

Generating a plausible workshop and shipping it is not on that list.

The product renders in `public/products/generated/` are a different case: they
are drawings of the actual designs, used as swatches, and they are not
presented as photographs. They should still be replaced with real product
photography — see `HANDOVER.md`.

## Shooting notes that apply to every slot

- Daylight where possible. No on-camera flash, no heavy colour grading.
- Shoot the real cloth. The colours must match the standing colourways
  (indigo, madder red, marigold, leaf green, cobalt).
- Keep white balance neutral. These are textile photographs; a warm filter
  makes indigo look black and madder look orange.
- Deliver at or above the stated pixel dimensions, in the stated aspect ratio.
- No visible brand names other than the client's own.
- Get consent from anyone identifiable before shooting the team slot.

---

## hero-bed — 2400 x 1350, 16:9

**Subject.** A made bed in a Jaipuri printed sheet, in a plain domestic room.

**Framing.** Bed fills the lower two-thirds of frame, shot slightly above eye
level, the sheet's border panel running down the left of frame. Leave clear,
low-detail space in the top-left third — the headline sits over it.

**Prompt, if generating for prototype use only:**
> A double bed made up with an indigo Jaipuri screen-printed cotton bedsheet,
> white floral buti motifs across a fine pinstriped field, a cream printed
> border panel running down the left edge of the sheet. Plain whitewashed room,
> soft morning daylight from a window at left, no clutter, no people. Shot from
> slightly above eye level, wide, bed occupying the lower two thirds of frame.
> Documentary interior photography, neutral white balance, no colour grading.

---

## craft-printing-table — 1800 x 1200, 3:2

**Subject.** A printer pulling a screen along the printing table.

**Framing.** The table running diagonally away from camera to show its length.
Printer mid-pull, hands and screen frame sharp. Some printed repeats already
visible behind them.

**Prompt, prototype only:**
> A textile printer pulling a wooden screen frame along a long padded printing
> table in a Jaipur workshop, printing a floral motif onto white cotton.
> Table recedes diagonally into the frame showing its length, several printed
> repeats already visible. Hands and screen frame in sharp focus. Available
> daylight from high windows, dust in the air. Documentary photography, neutral
> white balance.

---

## craft-screens — 1800 x 1200, 3:2

**Subject.** Cut screens stacked or racked in the workshop.

**Framing.** Screens stacked at an angle so several different designs are
readable at once. Workshop light.

**Prompt, prototype only:**
> Wooden silkscreen frames stacked at an angle against a workshop wall, each
> carrying a different Indian block-print floral design, dye residue on the
> mesh. Available workshop light, shallow depth of field falling off toward the
> back of the stack. Documentary photography, neutral white balance.

---

## craft-drying — 1800 x 1200, 3:2

**Subject.** Printed lengths hung or laid out to dry.

**Framing.** Wide enough to show several lengths in different colourways at
once. Daylight.

**Prompt, prototype only:**
> Long lengths of freshly printed cotton hung to dry on lines in an open yard,
> several different colourways — indigo, madder red, marigold, leaf green —
> moving slightly in the air. Bright overcast daylight. Wide shot showing depth
> down the line. Documentary photography, neutral white balance.

---

## craft-detail-macro — 1400 x 1400, 1:1

**Subject.** Macro of the print surface showing registration and weave.

**Framing.** Close enough to read the white outline sitting against the fill,
and the individual threads of the cloth. This slot is where a buyer judges
print quality, so it must be genuinely sharp.

**Prompt, prototype only:**
> Extreme macro of hand screen-printed cotton, a marigold floral motif with a
> white outline printed slightly out of register against an indigo pinstriped
> ground. Individual cotton threads and the weave clearly visible. Flat even
> daylight, no glare. Product macro photography, neutral white balance.

---

## about-shop-front — 1800 x 1200, 3:2

**Subject.** The unit's entrance at Jai Hanuman Plaza, B7, Jaipur.

**Framing.** Straight-on, whole frontage in shot including signage. Daylight,
nobody blocking the door.

**This slot must be a real photograph.** A generated shop front is a fabricated
business address. Do not ship a generated image here under any circumstances —
leave the placeholder in until someone walks over and takes the picture.

---

## about-team — 1800 x 1200, 3:2

**Subject.** The people who run the unit, at work.

**Framing.** Environmental, not a lined-up group portrait. Working posture, in
the unit, doing the actual job.

**This slot must be a real photograph.** Generated or stock people presented as
a company's staff is straightforward misrepresentation. Leave the placeholder
in until real photographs exist, and get consent from everyone identifiable.

---

## wholesale-packing — 1800 x 1200, 3:2

**Subject.** Finished sheets folded and baled for dispatch.

**Framing.** Stacked bales with folded sheets visible, so both quantity and
finish read in one frame. This is the slot that tells a buyer the unit can
handle volume.

**Prompt, prototype only:**
> Stacked bales of folded printed cotton bedsheets ready for dispatch in a
> textile unit, folded edges and printed borders visible along the stack,
> several colourways. Plain concrete floor, available daylight. Documentary
> photography, neutral white balance.

---

## og-default — 1200 x 630, 1.91:1

**Subject.** Social share card: printed cloth, with room for a text overlay.

**Framing.** Flat-on cloth filling the frame. Keep the centre third free of
important detail — text may be overlaid there by the platform or by us later.

**Prompt, prototype only:**
> Flat-on overhead view of indigo Jaipuri screen-printed cotton filling the
> frame, white and marigold floral buti on a fine pinstriped ground, printed
> border panel along the left edge. Even soft daylight, no shadows, no props.
> Textile flat-lay photography, neutral white balance.

---

## Delivery

Save files into `public/site/real/` named exactly by slot key — for example
`craft-printing-table.jpg`. See `public/site/real/README.md`. Then run:

```bash
npm run check:images
```

The slot will flip from `placeholder` to `real` with no code change.
