/**
 * Labelled placeholders for the site's photographic slots.
 *
 * These are deliberately plain: sand ground, a marigold rule, and the slot
 * key, dimensions and intended subject set small. They must read as
 * provisional at a glance and must never be mistaken for final artwork.
 *
 *   npm run placeholders
 */

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { SITE_IMAGE_SLOTS, type SiteImageSlot } from "../src/lib/imageSlots";

const OUT_DIR = path.join(process.cwd(), "public", "site", "generated");

const SAND = "#F1EBDF";
const INK = "#1A1614";
const MARIGOLD = "#E39A15";
const INDIGO = "#1E3A6B";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Wrap text to a rough character count, since SVG will not wrap for us. */
function wrap(text: string, perLine: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (line.length + word.length + 1 > perLine && line.length > 0) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function buildSvg(slot: SiteImageSlot) {
  const { width: W, height: H } = slot;
  // Scale type off the short edge so every slot reads the same at any size.
  const unit = Math.min(W, H) / 100;
  const keySize = Math.round(unit * 5.4);
  const metaSize = Math.round(unit * 3.1);
  const bodySize = Math.round(unit * 3.4);
  const pad = Math.round(unit * 8);

  const subjectLines = wrap(slot.subject, 42);
  const cropLines = wrap(slot.crop, 52);

  const subject = subjectLines
    .map(
      (line, i) =>
        `<text x="${pad}" y="${pad + keySize + Math.round(unit * 9) + i * Math.round(bodySize * 1.45)}" font-family="Helvetica, Arial, sans-serif" font-size="${bodySize}" fill="${INK}">${escapeXml(line)}</text>`,
    )
    .join("\n  ");

  const cropStartY =
    pad + keySize + Math.round(unit * 9) + subjectLines.length * Math.round(bodySize * 1.45) + Math.round(unit * 4);

  const crop = cropLines
    .map(
      (line, i) =>
        `<text x="${pad}" y="${cropStartY + i * Math.round(metaSize * 1.5)}" font-family="Helvetica, Arial, sans-serif" font-size="${metaSize}" fill="${INK}" fill-opacity="0.62">${escapeXml(line)}</text>`,
    )
    .join("\n  ");

  // A cross through the frame makes the exact crop box obvious on a page.
  const inset = Math.round(unit * 3);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${SAND}"/>

  <line x1="${inset}" y1="${inset}" x2="${W - inset}" y2="${H - inset}" stroke="${INK}" stroke-opacity="0.07" stroke-width="${Math.max(1, Math.round(unit * 0.35))}"/>
  <line x1="${W - inset}" y1="${inset}" x2="${inset}" y2="${H - inset}" stroke="${INK}" stroke-opacity="0.07" stroke-width="${Math.max(1, Math.round(unit * 0.35))}"/>
  <rect x="${inset}" y="${inset}" width="${W - inset * 2}" height="${H - inset * 2}" fill="none" stroke="${INK}" stroke-opacity="0.16" stroke-width="${Math.max(1, Math.round(unit * 0.35))}"/>

  <rect x="0" y="0" width="${W}" height="${Math.max(2, Math.round(unit * 0.9))}" fill="${MARIGOLD}"/>

  <text x="${pad}" y="${pad + keySize}" font-family="Helvetica, Arial, sans-serif" font-size="${keySize}" font-weight="700" fill="${INDIGO}">${escapeXml(slot.key)}</text>

  ${subject}
  ${crop}

  <text x="${pad}" y="${H - pad}" font-family="Helvetica, Arial, sans-serif" font-size="${metaSize}" fill="${INK}" fill-opacity="0.62">${slot.width} x ${slot.height} — ${escapeXml(slot.ratio)} — PLACEHOLDER, NOT FINAL ARTWORK</text>
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const slot of SITE_IMAGE_SLOTS) {
    const svg = buildSvg(slot);
    await writeFile(path.join(OUT_DIR, `${slot.key}.svg`), svg, "utf8");
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_DIR, `${slot.key}.png`));
    process.stdout.write(`  ${slot.key} — ${slot.width}x${slot.height} (${slot.ratio})\n`);
  }

  process.stdout.write(
    `\nWrote ${SITE_IMAGE_SLOTS.length} placeholders to public/site/generated\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
