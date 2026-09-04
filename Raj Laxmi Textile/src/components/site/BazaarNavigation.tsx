import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * A row of Jaipur shopfronts, drawn from the architectural vocabulary rather
 * than traced from any existing illustration:
 *
 *   - the cusped (multi-foil) arch, generated as a run of lobes on a
 *     semi-ellipse, which is the shape over almost every opening in the old city
 *   - the chhajja, the projecting stone cornice on bracket corbels that throws
 *     the monsoon clear of the shopfront
 *   - the jharokha, an enclosed projecting window on brackets, screened with jali
 *   - the chhatri, a domed kiosk on slender columns, capped with a kalash finial
 *
 * Indigo line on ivory with marigold picking out the finials and the arch
 * spring points. Each shopfront is a real link, so the row is keyboard
 * navigable by construction; on narrow screens it becomes a two-column tile
 * grid rather than a tiny image map.
 */

const MARIGOLD = "#E39A15";
const LEAF = "#3F6B39";

/**
 * A multi-foil arch: `cusps` lobes riding a semi-ellipse from (x0,ys) through
 * the apex to (x1,ys). Each lobe is a circular arc bulging into the opening.
 */
function cuspedArch(
  x0: number,
  x1: number,
  ys: number,
  ya: number,
  cusps: number,
): string {
  const cx = (x0 + x1) / 2;
  const half = (x1 - x0) / 2;
  const rise = ys - ya;

  const point = (i: number): [number, number] => {
    const t = Math.PI - (i / cusps) * Math.PI;
    return [cx + half * Math.cos(t), ys - rise * Math.sin(t)];
  };

  const round = (n: number) => Math.round(n * 100) / 100;
  const [sx, sy] = point(0);
  let d = `M ${round(sx)} ${round(sy)}`;

  for (let i = 1; i <= cusps; i += 1) {
    const [px, py] = point(i - 1);
    const [qx, qy] = point(i);
    const chord = Math.hypot(qx - px, qy - py);
    // Sweep 1 bulges the lobe back into the opening, which is what makes the
    // arch read as cusped rather than plain.
    d += ` A ${round(chord * 0.62)} ${round(chord * 0.62)} 0 0 1 ${round(qx)} ${round(qy)}`;
  }

  return d;
}

/** A jali screen: a lattice of small diamonds inside the given box. */
function jali(x: number, y: number, w: number, h: number, step: number) {
  const cells: string[] = [];
  for (let cy = y + step / 2; cy < y + h; cy += step) {
    for (let cx = x + step / 2; cx < x + w; cx += step) {
      const r = step * 0.28;
      cells.push(`M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`);
    }
  }
  return cells.join(" ");
}

/** A domed kiosk on four columns, with a kalash finial. */
function Chhatri({ x, y, w }: { x: number; y: number; w: number }) {
  const h = w * 0.55;
  const cx = x + w / 2;
  const domeBase = y;
  const domeTop = y - h;

  return (
    <g>
      {/* columns */}
      <line x1={x + w * 0.12} y1={domeBase} x2={x + w * 0.12} y2={domeBase + h * 0.7} />
      <line x1={x + w * 0.88} y1={domeBase} x2={x + w * 0.88} y2={domeBase + h * 0.7} />
      <line x1={x + w * 0.38} y1={domeBase} x2={x + w * 0.38} y2={domeBase + h * 0.7} />
      <line x1={x + w * 0.62} y1={domeBase} x2={x + w * 0.62} y2={domeBase + h * 0.7} />
      {/* plinth the columns stand on */}
      <line x1={x} y1={domeBase + h * 0.7} x2={x + w} y2={domeBase + h * 0.7} />
      {/* the dome: an onion profile, not a hemisphere */}
      <path
        d={`M ${x} ${domeBase}
            C ${x} ${domeBase - h * 0.62}, ${cx - w * 0.34} ${domeTop + h * 0.1}, ${cx} ${domeTop}
            C ${cx + w * 0.34} ${domeTop + h * 0.1}, ${x + w} ${domeBase - h * 0.62}, ${x + w} ${domeBase} Z`}
      />
      {/* kalash finial */}
      <line x1={cx} y1={domeTop} x2={cx} y2={domeTop - h * 0.3} stroke={MARIGOLD} />
      <circle cx={cx} cy={domeTop - h * 0.36} r={w * 0.05} fill={MARIGOLD} stroke="none" />
    </g>
  );
}

/** The projecting cornice, carried on bracket corbels. */
function Chhajja({ x, y, w }: { x: number; y: number; w: number }) {
  const overhang = w * 0.06;
  const brackets = 5;
  const items: React.ReactElement[] = [];

  for (let i = 0; i < brackets; i += 1) {
    const bx = x + ((i + 0.5) / brackets) * w;
    items.push(
      <path
        key={i}
        d={`M ${bx - 4} ${y + 6} Q ${bx} ${y + 14} ${bx + 4} ${y + 6}`}
      />,
    );
  }

  return (
    <g>
      <line x1={x - overhang} y1={y} x2={x + w + overhang} y2={y} strokeWidth={3} />
      <line x1={x - overhang} y1={y + 5} x2={x + w + overhang} y2={y + 5} />
      {items}
    </g>
  );
}

type Variant = 0 | 1 | 2;

/** One shopfront. Three variants so the row is not a repeating stamp. */
function Shopfront({ variant }: { variant: Variant }) {
  const W = 200;
  const H = 280;
  const ground = 258;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full"
      role="presentation"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    >
      {/* party walls, so a row of these reads as a continuous façade */}
      <line x1={4} y1={ground} x2={4} y2={96} />
      <line x1={W - 4} y1={ground} x2={W - 4} y2={96} />
      <line x1={0} y1={ground} x2={W} y2={ground} strokeWidth={3} />

      {variant === 0 ? (
        <>
          {/* parapet, central chhatri, twin jharokhas */}
          <line x1={4} y1={96} x2={W - 4} y2={96} />
          <Chhatri x={78} y={62} w={44} />
          <g>
            <rect x={26} y={104} width={44} height={38} />
            <path d={jali(30, 108, 36, 30, 10)} stroke={LEAF} strokeWidth={1.2} />
            <path d={`M 22 142 Q 26 150 32 142`} />
            <rect x={130} y={104} width={44} height={38} />
            <path d={jali(134, 108, 36, 30, 10)} stroke={LEAF} strokeWidth={1.2} />
            <path d={`M 168 142 Q 172 150 178 142`} />
          </g>
          <Chhajja x={20} y={158} w={160} />
          {/* the shop opening */}
          <path d={cuspedArch(46, 154, 250, 182, 7)} />
          <line x1={46} y1={250} x2={46} y2={196} />
          <line x1={154} y1={250} x2={154} y2={196} />
          <circle cx={46} cy={196} r={3} fill={MARIGOLD} stroke="none" />
          <circle cx={154} cy={196} r={3} fill={MARIGOLD} stroke="none" />
        </>
      ) : null}

      {variant === 1 ? (
        <>
          {/* stepped parapet, one deep jharokha, paired openings */}
          <path d={`M 4 96 L 60 96 L 60 84 L 140 84 L 140 96 L ${W - 4} 96`} />
          <line x1={100} y1={84} x2={100} y2={70} stroke={MARIGOLD} />
          <circle cx={100} cy={66} r={4} fill={MARIGOLD} stroke="none" />
          <g>
            <rect x={64} y={104} width={72} height={46} />
            <path d={cuspedArch(70, 130, 138, 116, 5)} />
            <path d={jali(74, 120, 52, 16, 9)} stroke={LEAF} strokeWidth={1.2} />
            <path d={`M 58 150 Q 64 160 72 150`} />
            <path d={`M 128 150 Q 136 160 142 150`} />
          </g>
          <Chhajja x={20} y={162} w={160} />
          <path d={cuspedArch(36, 96, 250, 196, 5)} />
          <line x1={36} y1={250} x2={36} y2={208} />
          <line x1={96} y1={250} x2={96} y2={208} />
          <path d={cuspedArch(108, 168, 250, 196, 5)} />
          <line x1={108} y1={250} x2={108} y2={208} />
          <line x1={168} y1={250} x2={168} y2={208} />
          <circle cx={102} cy={228} r={3} fill={MARIGOLD} stroke="none" />
        </>
      ) : null}

      {variant === 2 ? (
        <>
          {/* corner chhatris over a single tall arch */}
          <line x1={4} y1={96} x2={W - 4} y2={96} />
          <Chhatri x={16} y={68} w={36} />
          <Chhatri x={148} y={68} w={36} />
          <g>
            <rect x={72} y={102} width={56} height={44} />
            <path d={jali(76, 106, 48, 36, 12)} stroke={LEAF} strokeWidth={1.2} />
            <path d={`M 66 146 Q 72 156 80 146`} />
            <path d={`M 120 146 Q 128 156 134 146`} />
          </g>
          <Chhajja x={16} y={160} w={168} />
          <path d={cuspedArch(52, 148, 250, 176, 9)} />
          <line x1={52} y1={250} x2={52} y2={192} />
          <line x1={148} y1={250} x2={148} y2={192} />
          {/* pilasters either side of the opening */}
          <line x1={34} y1={250} x2={34} y2={172} />
          <line x1={166} y1={250} x2={166} y2={172} />
          <circle cx={100} cy={168} r={3.5} fill={MARIGOLD} stroke="none" />
        </>
      ) : null}
    </svg>
  );
}

export type BazaarStall = {
  label: string;
  /** Short line under the name, in the trade register. */
  note: string;
  href: string;
};

export function BazaarNavigation({
  stalls,
  className,
}: {
  stalls: BazaarStall[];
  className?: string;
}) {
  return (
    <ul
      className={cn(
        // Two-column tiles on narrow screens; a continuous façade from md up.
        "grid grid-cols-2 gap-x-4 gap-y-8 md:flex md:gap-0",
        className,
      )}
    >
      {stalls.map((stall, index) => (
        <li key={stall.href} className="md:min-w-0 md:flex-1">
          <Link
            href={stall.href}
            className="group block rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-marigold"
          >
            <div className="text-indigo-600 transition-colors group-hover:text-cobalt group-focus-visible:text-cobalt">
              <Shopfront variant={(index % 3) as Variant} />
            </div>
            <span className="mt-3 block border-t-2 border-transparent pt-2 text-16 text-indigo-600 underline decoration-transparent decoration-2 underline-offset-[6px] group-hover:decoration-marigold group-focus-visible:decoration-marigold">
              {stall.label}
            </span>
            <span className="mt-1 block text-14 text-ink/65">{stall.note}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
