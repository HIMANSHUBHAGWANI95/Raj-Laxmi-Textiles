/**
 * Procedural product imagery for the prototype: Jaipuri screen-printed
 * bedsheets rendered as SVG and rasterised with sharp. Everything is driven by
 * a seeded PRNG, so re-running produces identical files.
 *
 *   npm run swatches
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { PATTERNS, type MotifName, type Pattern } from "../src/lib/products";
import { COLOURWAYS, colourwayBySlug, type Colourway } from "../src/lib/colourways";

const OUT_ROOT = path.join(process.cwd(), "public", "products", "generated");

const WHITE = "#FCFBF8";
const MARIGOLD = "#E39A15";
const COBALT = "#2F5AA8";
const LEAF = "#3F6B39";
const MADDER = "#9E2B2B";

/* ------------------------------------------------------------------ *
 * Seeded PRNG
 * ------------------------------------------------------------------ */

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rng = {
  next: () => number;
  range: (min: number, max: number) => number;
  pick: <T>(items: readonly T[]) => T;
};

function makeRng(seed: string): Rng {
  const next = mulberry32(hashString(seed));
  const range = (min: number, max: number) => min + next() * (max - min);
  return {
    next,
    range,
    pick: (items) => items[Math.min(items.length - 1, Math.floor(next() * items.length))],
  };
}

/** Trim float noise so output stays stable and the SVG stays readable. */
const n = (value: number) => Math.round(value * 100) / 100;

/* ------------------------------------------------------------------ *
 * Motifs — authored path sets, drawn around a 0,0 origin, ~140 units tall
 * ------------------------------------------------------------------ */

type MotifColours = {
  /** The screen pulled first — the body of the motif. */
  fill: string;
  /** The second screen: centres and highlights. */
  accent: string;
  /** The outline screen. White, as on the cloth. */
  outline: string;
};

/** The large floral: eight teardrop petals around a dyed centre. */
function flowerRosette({ fill, accent, outline }: MotifColours) {
  const petals: string[] = [];
  const petal = "M 0 -18 C -17 -31, -17 -55, 0 -68 C 17 -55, 17 -31, 0 -18 Z";
  for (let i = 0; i < 8; i += 1) {
    petals.push(
      `<path d="${petal}" transform="rotate(${i * 45})" fill="${fill}" stroke="${outline}" stroke-width="3.2" stroke-linejoin="round"/>`,
    );
  }
  const dots: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    const a = ((i + 0.5) / 8) * Math.PI * 2;
    dots.push(
      `<circle cx="${n(Math.cos(a) * 40)}" cy="${n(Math.sin(a) * 40)}" r="4.4" fill="${accent}" stroke="${outline}" stroke-width="1.6"/>`,
    );
  }
  return `<g>
      ${petals.join("\n      ")}
      ${dots.join("\n      ")}
      <circle cx="0" cy="0" r="19" fill="${accent}" stroke="${outline}" stroke-width="3.2"/>
      <circle cx="0" cy="0" r="7.5" fill="${fill}" stroke="${outline}" stroke-width="1.8"/>
    </g>`;
}

/** A curved leaf spray: three pairs of turning leaves and a bud at the tip. */
function leafSpray({ fill, accent, outline }: MotifColours) {
  // Each leaf springs out and up from the stem, so the spray keeps daylight
  // between the leaves instead of merging into one silhouette.
  const leaf = (y: number, s: number, side: 1 | -1) => {
    const d = `M 0 ${n(y)}
       C ${n(side * 30 * s)} ${n(y + 3 * s)}, ${n(side * 50 * s)} ${n(y - 12 * s)}, ${n(side * 46 * s)} ${n(y - 34 * s)}
       C ${n(side * 27 * s)} ${n(y - 25 * s)}, ${n(side * 9 * s)} ${n(y - 13 * s)}, 0 ${n(y)} Z`;
    return `<path d="${d}" fill="${fill}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>`;
  };

  return `<g>
      <path d="M 0 58 C -3 26, -3 -6, 0 -40" fill="none" stroke="${fill}" stroke-width="5.5" stroke-linecap="round"/>
      ${leaf(44, 1, -1)}
      ${leaf(36, 0.94, 1)}
      ${leaf(12, 0.78, -1)}
      ${leaf(4, 0.72, 1)}
      ${leaf(-16, 0.56, -1)}
      ${leaf(-22, 0.52, 1)}
      <path d="M 0 -38 C -11 -45, -11 -59, 0 -68 C 11 -59, 11 -45, 0 -38 Z"
            fill="${accent}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>
    </g>`;
}

/** A tulip bud: cup, three outer petals, stem and a pair of base leaves. */
function tulipBud({ fill, accent, outline }: MotifColours) {
  return `<g>
      <path d="M 0 58 L 0 8" fill="none" stroke="${fill}" stroke-width="5" stroke-linecap="round"/>
      <path d="M 0 48 C -28 41, -34 17, -13 11 C -5 24, -2 37, 0 48 Z"
            fill="${fill}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M 0 40 C 26 33, 31 11, 12 5 C 4 17, 2 30, 0 40 Z"
            fill="${fill}" stroke="${outline}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M -21 6 C -21 -23, 21 -23, 21 6 C 21 23, -21 23, -21 6 Z"
            fill="${fill}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M -21 4 C -26 -29, -9 -47, 0 -21 C 9 -47, 26 -29, 21 4 Z"
            fill="${accent}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M 0 -20 L 0 12" fill="none" stroke="${outline}" stroke-width="2.2" stroke-linecap="round"/>
    </g>`;
}

/** A rosette built from scalloped wave lobes — the stripe motif turned round. */
function scallopRosette({ fill, accent, outline }: MotifColours) {
  const lobes = 12;
  const outer = 62;
  const inner = 34;
  let d = "";
  for (let i = 0; i < lobes; i += 1) {
    const a0 = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.5) / lobes) * Math.PI * 2 - Math.PI / 2;
    const a2 = ((i + 1) / lobes) * Math.PI * 2 - Math.PI / 2;
    if (i === 0) d += `M ${n(Math.cos(a0) * inner)} ${n(Math.sin(a0) * inner)} `;
    d += `Q ${n(Math.cos(a1) * outer)} ${n(Math.sin(a1) * outer)} ${n(Math.cos(a2) * inner)} ${n(Math.sin(a2) * inner)} `;
  }
  d += "Z";
  return `<g>
      <path d="${d}" fill="${fill}" stroke="${outline}" stroke-width="3.4" stroke-linejoin="round"/>
      <circle cx="0" cy="0" r="21" fill="${accent}" stroke="${outline}" stroke-width="3"/>
      <circle cx="0" cy="0" r="8" fill="${fill}" stroke="${outline}" stroke-width="1.8"/>
    </g>`;
}

/** The small buti that climbs the border vine. */
function belButi({ fill, accent, outline }: MotifColours) {
  return `<g>
      <path d="M 0 34 C -2 20, -2 8, 0 -4" fill="none" stroke="${fill}" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M 0 -2 C -21 -8, -24 -30, -4 -38 C 2 -25, 2 -11, 0 -2 Z"
            fill="${fill}" stroke="${outline}" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M 0 8 C 20 1, 23 -20, 4 -27 C -1 -15, -1 -1, 0 8 Z"
            fill="${accent}" stroke="${outline}" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="0" cy="-44" r="6" fill="${accent}" stroke="${outline}" stroke-width="2.4"/>
    </g>`;
}

/** A small filler buti dropped between the large motifs. */
function fillerDot({ fill, accent, outline }: MotifColours) {
  return `<g>
      <path d="M 0 -14 C -9 -6, -9 6, 0 14 C 9 6, 9 -6, 0 -14 Z"
            fill="${fill}" stroke="${outline}" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="0" cy="0" r="3.6" fill="${accent}"/>
    </g>`;
}

const MOTIFS: Record<MotifName, (c: MotifColours) => string> = {
  flowerRosette,
  leafSpray,
  tulipBud,
  scallopRosette,
  belButi,
};

/** A scalloped wave stripe running horizontally for `width` at `period`. */
function scallopWavePath(width: number, period: number, amplitude: number) {
  let d = "M 0 0 ";
  for (let x = 0; x < width; x += period) {
    d += `Q ${n(x + period / 4)} ${n(-amplitude)} ${n(x + period / 2)} 0 `;
    d += `Q ${n(x + (period * 3) / 4)} ${n(amplitude)} ${n(x + period)} 0 `;
  }
  return d;
}

/* ------------------------------------------------------------------ *
 * Shared building blocks
 * ------------------------------------------------------------------ */

/** Motif colours: most screens pull white, the rest pull the accent dye. */
function motifColours(cw: Colourway, rng: Rng): MotifColours {
  if (rng.next() > 0.62) {
    return { fill: cw.accent, accent: cw.motif, outline: cw.motif };
  }
  return { fill: cw.motif, accent: cw.accent, outline: cw.motif };
}

function fieldPattern(id: string, cw: Colourway, pitch: number) {
  return `
    <pattern id="${id}" width="${n(pitch)}" height="${n(pitch)}" patternUnits="userSpaceOnUse">
      <rect width="${n(pitch)}" height="${n(pitch)}" fill="${cw.field}"/>
      <rect width="${n(pitch * 0.14)}" height="${n(pitch)}" fill="${cw.stripe}"/>
      <rect x="${n(pitch * 0.46)}" width="${n(pitch * 0.07)}" height="${n(pitch)}" fill="${cw.motif}" opacity="0.20"/>
    </pattern>`;
}

function textureDefs(id: string, seed: number) {
  return `
    <pattern id="${id}-threads" width="4" height="4" patternUnits="userSpaceOnUse">
      <rect width="4" height="1" fill="#000000" opacity="0.055"/>
      <rect width="1" height="4" fill="#FFFFFF" opacity="0.05"/>
    </pattern>

    <filter id="${id}-weave" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>

    <filter id="${id}-cloth" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="7" stdDeviation="14" flood-color="#1A1614" flood-opacity="0.26"/>
    </filter>

    <filter id="${id}-fold" x="-12%" y="-30%" width="130%" height="180%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#1A1614" flood-opacity="0.36"/>
    </filter>

    <filter id="${id}-ink" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="0.7"/>
    </filter>`;
}

/**
 * The border panel: unprinted cloth carrying vertical stripes, a scalloped
 * wave and a climbing bel-buti vine — the narrow edge of a real Jaipuri sheet.
 */
function borderPanel(
  x: number,
  y: number,
  width: number,
  height: number,
  cw: Colourway,
  rng: Rng,
  scale = 1,
) {
  const stripes: string[] = [];
  let cursor = 0;

  const band = (w: number, fill: string) => {
    stripes.push(
      `<rect x="${n(cursor)}" y="0" width="${n(w)}" height="${n(height)}" fill="${fill}"/>`,
    );
    cursor += w;
  };

  band(width * 0.045, cw.field);
  band(width * 0.03, cw.panel);
  band(width * 0.028, MARIGOLD);
  band(width * 0.026, cw.panel);
  band(width * 0.02, MARIGOLD);
  band(width * 0.032, cw.panel);
  band(width * 0.07, COBALT);
  band(width * 0.028, cw.panel);
  band(width * 0.042, LEAF);

  const vineStart = cursor + width * 0.026;
  cursor = vineStart;
  band(width * 0.46, cw.panel);
  const vineWidth = width * 0.46;

  band(width * 0.04, LEAF);
  band(width * 0.026, cw.panel);
  band(width * 0.028, MARIGOLD);
  band(width * 0.03, cw.panel);
  band(Math.max(0, width - cursor), cw.field);

  // The bel-buti vine climbing the panel.
  const vineCx = vineStart + vineWidth / 2;
  const step = 150 * scale;
  const butiScale = (vineWidth / 120) * 0.92;
  const parts: string[] = [];

  let stemD = `M ${n(vineCx)} ${n(height)} `;
  for (let yy = height; yy > -step; yy -= step) {
    const sway = vineWidth * 0.2;
    stemD += `C ${n(vineCx + sway)} ${n(yy - step * 0.3)} ${n(vineCx - sway)} ${n(yy - step * 0.7)} ${n(vineCx)} ${n(yy - step)} `;
  }
  parts.push(
    `<path d="${stemD}" fill="none" stroke="${LEAF}" stroke-width="${n(4.5 * scale)}" stroke-linecap="round"/>`,
  );

  let index = 0;
  for (let yy = height - step * 0.45; yy > -step * 0.5; yy -= step) {
    const flip = index % 2 === 0 ? 1 : -1;
    const jitter = rng.range(-3, 3) * scale;
    parts.push(
      `<g transform="translate(${n(vineCx + jitter)} ${n(yy)}) scale(${n(butiScale * flip)} ${n(butiScale)})">${belButi(
        {
          fill: index % 3 === 0 ? COBALT : LEAF,
          accent: index % 2 === 0 ? MARIGOLD : MADDER,
          outline: WHITE,
        },
      )}</g>`,
    );
    index += 1;
  }

  const waveX = vineStart + vineWidth + width * 0.004;
  parts.push(`<g transform="translate(${n(waveX)} 0) rotate(90)">
      <path d="${scallopWavePath(height, 52 * scale, 8 * scale)}" fill="none" stroke="${LEAF}" stroke-width="${n(4 * scale)}"/>
    </g>`);

  return `<g transform="translate(${n(x)} ${n(y)})">
      ${stripes.join("\n      ")}
      ${parts.join("\n      ")}
    </g>`;
}

/** Motifs scattered across the printed field on a seeded half-drop grid. */
function scatterField(
  width: number,
  height: number,
  product: Pattern,
  cw: Colourway,
  rng: Rng,
  cellScale = 1,
) {
  const cell = product.cell * cellScale;
  const cols = Math.ceil(width / cell) + 1;
  const rows = Math.ceil(height / cell) + 1;
  const out: string[] = [];
  // Motif art is ~140 units tall; hold it at roughly half the cell.
  const baseScale = (cell * 0.52) / 140;

  for (let r = -1; r <= rows; r += 1) {
    for (let c = -1; c <= cols; c += 1) {
      const offset = r % 2 === 0 ? 0 : cell / 2;
      const cx = c * cell + cell / 2 + offset + rng.range(-cell * 0.06, cell * 0.06);
      const cy = r * cell + cell / 2 + rng.range(-cell * 0.06, cell * 0.06);
      if (cx < -cell || cx > width + cell || cy < -cell || cy > height + cell) continue;

      const motif = rng.pick(product.motifs);
      out.push(
        `<g transform="translate(${n(cx)} ${n(cy)}) rotate(${n(rng.range(-14, 14))}) scale(${n(
          baseScale * rng.range(0.9, 1.06),
        )})">${MOTIFS[motif](motifColours(cw, rng))}</g>`,
      );

      // Filler buti sit in the gaps of the half-drop, as on the real cloth.
      const fx = cx + cell / 2;
      const fy = cy + cell / 2;
      if (fx < width + cell && fy < height + cell) {
        out.push(
          `<g transform="translate(${n(fx)} ${n(fy)}) rotate(${n(rng.range(-30, 30))}) scale(${n(
            baseScale * rng.range(0.85, 1.15),
          )})">${fillerDot(motifColours(cw, rng))}</g>`,
        );
      }
    }
  }

  return out.join("\n      ");
}

/* ------------------------------------------------------------------ *
 * 1. flat — the sheet laid out, viewed top-down
 * ------------------------------------------------------------------ */

function buildFlat(product: Pattern, cw: Colourway) {
  const rng = makeRng(`${product.slug}-${cw.slug}-flat`);
  const W = 1600;
  const H = 1200;
  const sx = 62;
  const sy = 54;
  const sw = W - sx * 2;
  const sh = H - sy * 2;
  const borderW = 226;
  const fieldX = sx + borderW;
  const fieldW = sw - borderW;
  const id = "f";
  const seed = hashString(`${product.slug}${cw.slug}flat`) % 1000;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${fieldPattern(`${id}-field`, cw, product.stripePitch)}
    ${textureDefs(id, seed)}
    <clipPath id="${id}-sheet"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}"/></clipPath>
    <clipPath id="${id}-fieldclip"><rect x="${fieldX}" y="${sy}" width="${fieldW}" height="${sh}"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="#EDE7DC"/>

  <g filter="url(#${id}-cloth)">
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="${cw.field}"/>
  </g>

  <g clip-path="url(#${id}-sheet)">
    <rect x="${fieldX}" y="${sy}" width="${fieldW}" height="${sh}" fill="url(#${id}-field)"/>

    <g clip-path="url(#${id}-fieldclip)">
      <g transform="translate(${fieldX} ${sy})">
      ${scatterField(fieldW, sh, product, cw, rng)}
      </g>
    </g>

    ${borderPanel(sx, sy, borderW, sh, cw, rng)}

    <!-- woven cloth: fine threads plus a low-opacity noise field -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="url(#${id}-threads)"/>
    <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" filter="url(#${id}-weave)" opacity="0.10"/>

    <!-- the cloth lifts very slightly at the edges -->
    <rect x="${sx}" y="${sy}" width="${sw}" height="16" fill="#FFFFFF" opacity="0.16"/>
    <rect x="${sx}" y="${n(sy + sh - 24)}" width="${sw}" height="24" fill="#1A1614" opacity="0.10"/>
  </g>

  <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" fill="none" stroke="#1A1614" stroke-opacity="0.12" stroke-width="2"/>
</svg>`;
}

/* ------------------------------------------------------------------ *
 * 2. stack — folded bolts in overlapping horizontal colour bands
 * ------------------------------------------------------------------ */

function buildStack(product: Pattern, lead: Colourway) {
  const rng = makeRng(`${product.slug}-${lead.slug}-stack`);
  const W = 1600;
  const H = 1200;
  const id = "s";
  const seed = hashString(`${product.slug}${lead.slug}stack`) % 1000;

  const others = COLOURWAYS.filter((c) => c.slug !== lead.slug);
  const order = [lead, ...others].slice(0, 5);

  const bandH = 210;
  const bandW = 1320;
  const stepY = 168;
  const totalH = bandH + (order.length - 1) * stepY;
  const startY = (H - totalH) / 2;

  const patterns = order
    .map((cw, i) => fieldPattern(`${id}-field-${i}`, cw, product.stripePitch * 0.8))
    .join("\n");

  const clips = order
    .map(
      (_, i) =>
        `<clipPath id="${id}-bolt-${i}"><rect x="0" y="0" width="${bandW}" height="${bandH}"/></clipPath>`,
    )
    .join("\n    ");

  const bands = order
    .map((cw, i) => {
      const y = startY + i * stepY;
      const x = (W - bandW) / 2 + rng.range(-34, 34);
      const rotate = rng.range(-1.5, 1.5);
      const borderW = 190;
      const fieldW = bandW - borderW;

      return `
  <g transform="translate(${n(x)} ${n(y)}) rotate(${n(rotate)} ${n(bandW / 2)} ${n(bandH / 2)})" filter="url(#${id}-fold)">
    <g clip-path="url(#${id}-bolt-${i})">
      <rect width="${bandW}" height="${bandH}" fill="${cw.field}"/>
      <rect x="${borderW}" width="${fieldW}" height="${bandH}" fill="url(#${id}-field-${i})"/>
      <g transform="translate(${borderW} 0)">
      ${scatterField(fieldW, bandH, product, cw, rng, 0.62)}
      </g>
      ${borderPanel(0, 0, borderW, bandH, cw, rng, 0.7)}
      <rect width="${bandW}" height="${bandH}" fill="url(#${id}-threads)"/>
      <rect width="${bandW}" height="${bandH}" filter="url(#${id}-weave)" opacity="0.09"/>
      <!-- the fold: a highlight along the top edge, a crease shadow below -->
      <rect width="${bandW}" height="12" fill="#FFFFFF" opacity="0.26"/>
      <rect y="${n(bandH - 30)}" width="${bandW}" height="30" fill="#1A1614" opacity="0.20"/>
    </g>
    <rect width="${bandW}" height="${bandH}" fill="none" stroke="#1A1614" stroke-opacity="0.16" stroke-width="2"/>
  </g>`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${patterns}
    ${clips}
    ${textureDefs(id, seed)}
  </defs>
  <rect width="${W}" height="${H}" fill="#EDE7DC"/>
  ${bands}
</svg>`;
}

/* ------------------------------------------------------------------ *
 * 3. detail — a close crop showing print registration
 * ------------------------------------------------------------------ */

function buildDetail(product: Pattern, cw: Colourway) {
  const rng = makeRng(`${product.slug}-${cw.slug}-detail`);
  const S = 1200;
  const id = "d";
  const pitch = product.stripePitch * 3.6;
  const hero = product.motifs[0];
  const seed = hashString(`${product.slug}${cw.slug}detail`) % 1000;

  const supporting = ([
    [980, 210, 2.3],
    [960, 1010, 2.6],
    [300, 1080, 2.0],
    [230, 150, 1.8],
  ] as const)
    .map(
      ([px, py, ps]) =>
        `<g transform="translate(${px} ${py}) rotate(${n(rng.range(-20, 20))}) scale(${n(ps)})">${MOTIFS[
          rng.pick(product.motifs)
        ](motifColours(cw, rng))}</g>`,
    )
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <defs>
    ${fieldPattern(`${id}-field`, cw, pitch)}
    ${textureDefs(id, seed)}
  </defs>

  <rect width="${S}" height="${S}" fill="url(#${id}-field)"/>

  <!-- the border panel running down the left, at close range -->
  ${borderPanel(0, 0, 300, S, cw, rng, 1.9)}

  <!-- the scalloped wave at full scale, showing the screen's edge -->
  <g transform="translate(0 ${n(S * 0.66)})">
    <path d="${scallopWavePath(S, 170, 30)}" fill="none" stroke="${cw.motif}" stroke-width="16"/>
    <path d="${scallopWavePath(S, 170, 30)}" fill="none" stroke="${cw.accent}" stroke-width="5"/>
  </g>

  ${supporting}

  <!-- a second screen a hair out of registration, as in real printing -->
  <g transform="translate(${n(S * 0.44 + 7)} ${n(S * 0.42 + 6)}) rotate(-6) scale(4.2)" opacity="0.22">
    ${MOTIFS[hero]({ fill: cw.accent, accent: cw.accent, outline: cw.accent })}
  </g>

  <!-- hero motif, large enough to read the white outline and the stripe rhythm -->
  <g transform="translate(${n(S * 0.44)} ${n(S * 0.42)}) rotate(-6) scale(4.2)" filter="url(#${id}-ink)">
    ${MOTIFS[hero](motifColours(cw, rng))}
  </g>

  <rect width="${S}" height="${S}" fill="url(#${id}-threads)"/>
  <rect width="${S}" height="${S}" filter="url(#${id}-weave)" opacity="0.13"/>
</svg>`;
}


/* ------------------------------------------------------------------ *
 * 4. drape — the cloth hung, so the print reads over folds
 * ------------------------------------------------------------------ */

function buildDrape(product: Pattern, cw: Colourway) {
  const rng = makeRng(`${product.slug}-${cw.slug}-drape`);
  const W = 1400;
  const H = 1050;
  const id = "r";
  const seed = hashString(`${product.slug}${cw.slug}drape`) % 1000;

  const clothX = 90;
  const clothW = W - clothX * 2;
  const clothTop = 60;

  // A wavy hem: the cloth is hanging, so the bottom edge is not a straight line.
  const hemY = H - 250;
  let hem = `M ${clothX} ${clothTop} L ${clothX + clothW} ${clothTop} L ${clothX + clothW} ${hemY} `;
  const lobes = 7;
  for (let i = lobes; i > 0; i -= 1) {
    const x0 = clothX + (clothW * i) / lobes;
    const x1 = clothX + (clothW * (i - 1)) / lobes;
    const dip = rng.range(70, 150);
    hem += `Q ${n((x0 + x1) / 2)} ${n(hemY + dip)} ${n(x1)} ${n(hemY + rng.range(-30, 30))} `;
  }
  hem += "Z";

  // Fold shading: alternating light and dark bands down the cloth.
  const folds: string[] = [];
  const foldCount = 7;
  for (let i = 0; i < foldCount; i += 1) {
    const fx = clothX + (clothW * i) / foldCount;
    const fw = clothW / foldCount;
    const dark = i % 2 === 0;
    folds.push(
      `<rect x="${n(fx)}" y="${clothTop}" width="${n(fw)}" height="${H}" fill="url(#${id}-fold-${dark ? "d" : "l"})" opacity="${dark ? 1 : 0.9}"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    ${fieldPattern(`${id}-field`, cw, product.stripePitch)}
    ${textureDefs(id, seed)}
    <clipPath id="${id}-clothshape"><path d="${hem}"/></clipPath>
    <linearGradient id="${id}-fold-d" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#1A1614" stop-opacity="0.46"/>
      <stop offset="0.5" stop-color="#1A1614" stop-opacity="0"/>
      <stop offset="1" stop-color="#1A1614" stop-opacity="0.38"/>
    </linearGradient>
    <linearGradient id="${id}-fold-l" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.40"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#EDE7DC"/>

  <g filter="url(#${id}-cloth)">
    <path d="${hem}" fill="${cw.field}"/>
  </g>
  <g clip-path="url(#${id}-clothshape)">
    <rect x="${clothX}" y="${clothTop}" width="${clothW}" height="${H}" fill="url(#${id}-field)"/>
    <g transform="translate(${clothX + 210} ${clothTop})">
      ${scatterField(clothW - 210, H - clothTop, product, cw, rng, 0.62)}
    </g>
    ${borderPanel(clothX, clothTop, 200, H - clothTop, cw, rng, 0.95)}

    <!-- the folds sit over the print, as they would on hanging cloth -->
    ${folds.join("\n    ")}

    <rect x="${clothX}" y="${clothTop}" width="${clothW}" height="${H}" fill="url(#${id}-threads)"/>
    <rect x="${clothX}" y="${clothTop}" width="${clothW}" height="${H}" filter="url(#${id}-weave)" opacity="0.10"/>
  </g>

  <path d="${hem}" fill="none" stroke="#1A1614" stroke-opacity="0.14" stroke-width="2"/>
</svg>`;
}

/* ------------------------------------------------------------------ *
 * Render
 * ------------------------------------------------------------------ */

/**
 * WebP, not PNG. These renders carry a turbulence texture that PNG cannot
 * compress — the same image is ~2.4MB as PNG and ~230KB as WebP at q90, which
 * matters for buyers on mobile data.
 */
async function render(svg: string, outPath: string) {
  await writeFile(outPath.replace(/\.webp$/, ".svg"), svg, "utf8");
  await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outPath);
}

async function main() {
  let count = 0;

  for (const product of PATTERNS) {
    const dir = path.join(OUT_ROOT, product.slug);
    await mkdir(dir, { recursive: true });

    for (const slug of product.colourways) {
      const cw = colourwayBySlug(slug);
      await render(buildFlat(product, cw), path.join(dir, `${slug}-flat.webp`));
      await render(buildStack(product, cw), path.join(dir, `${slug}-stack.webp`));
      await render(buildDetail(product, cw), path.join(dir, `${slug}-detail.webp`));
      await render(buildDrape(product, cw), path.join(dir, `${slug}-drape.webp`));
      count += 4;
      process.stdout.write(`  ${product.slug}/${slug} — flat, stack, detail, drape\n`);
    }
  }

  process.stdout.write(`\nWrote ${count} WebP renders (and their source SVGs) to public/products/generated\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
