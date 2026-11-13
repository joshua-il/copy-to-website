/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

// Delivered by Originkit · stack: framer
// Paste into a Framer code component. Property controls included.
import * as React from "react";
import { useEffect, useRef } from "react";
/**
 * Infinite Grid: a product grid on a canvas with no edges. Drag it, flick it
 * or scroll it in any direction; it carries momentum, leans into the motion
 * with a slight skew, and wraps seamlessly so there is always another card
 * under your finger. Click a card to open it.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 480
 * @framerIntrinsicHeight 320
 */

export interface GridItem {
  title: string;
  subtitle: string;
  imageUrl: any;
  episode?: string;
  badge?: string;
}

export interface InfiniteGridProps {
  items?: GridItem[];
  columns?: number;
  cardWidth?: number;
  /** Corner radius of each card photo, in px. */
  radius?: number;
  gap?: number;
  background?: string;
  textColor?: string;
  mutedColor?: string;
  titleFont?: React.CSSProperties;
  subtitleFont?: React.CSSProperties;
  blobs?: boolean;
  aspectRatio?: string;
  onItemClick?: (item: GridItem) => void;
  style?: React.CSSProperties;
}

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

const SAMPLE: GridItem[] = [
  {
    title: "A-01 Over-ear studio",
    subtitle: "$540.00",
    imageUrl: IMG("1721884258262-429b49dadb49"),
  },
  { title: "C-02 35mm reflex", subtitle: "$890.00", imageUrl: IMG("1643804158865-df09560b2bcc") },
  {
    title: "R-03 Pocket rangefinder",
    subtitle: "$1,240.00",
    imageUrl: IMG("1604250166431-7a9303e0a1b0"),
  },
  {
    title: "G-04 Brass gramophone",
    subtitle: "$1,800.00",
    imageUrl: IMG("1518893883800-45cd0954574b"),
  },
  {
    title: "T-05 Rotary telephone",
    subtitle: "$240.00",
    imageUrl: IMG("1788950873590-bee029a89d51"),
  },
  {
    title: "P-06 Pour-over carafe",
    subtitle: "$85.00",
    imageUrl: IMG("1793078479546-f6176dcc149c"),
  },
  { title: "S-07 Stoneware cup", subtitle: "$48.00", imageUrl: IMG("1782351102866-3595246c4c85") },
  { title: "L-08 Mushroom lamp", subtitle: "$750.00", imageUrl: IMG("1791646912805-c2d04ac54948") },
];

/** The URL of an image value: a ResponsiveImage object or a plain URL string. */
function srcOf(v: any): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v.src === "string" && v.src) return v.src;
  return null;
}

/**
 * Fetch a family picked in a Font row into the document this renders in (the
 * builder previews some stages in iframes). Same link id as the builder, so it
 * is never added twice; a family Google does not serve falls back to the stack.
 */
function loadFamily(doc: Document, family: unknown) {
  const fam = String(family ?? "")
    .split(",")[0]
    .trim()
    .replace(/["']/g, "");
  if (!fam || /^(ui-|system-ui|-apple-system|sans-serif|serif|monospace)/i.test(fam) || !doc.head)
    return;
  const id = `gf-${fam.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  if (doc.getElementById(id)) return;
  const link = doc.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css?family=${encodeURIComponent(fam)}:100,200,300,400,500,600,700,800,900&display=swap`;
  doc.head.appendChild(link);
}

const FRICTION = 0.95;
const DRAG_GAIN = 0.85;
const WHEEL_GAIN = 0.45;
const CLICK_SLOP = 6;
const MAX_SKEW = 3;
// Hover zoom on a card photo, and how fast it eases there and back (exponential time constant).
const HOVER_SCALE = 1.05;
const HOVER_TAU = 0.12;

const css = `
.ig-root { position: relative; width: 100%; height: 100%; overflow: hidden; }
.ig-pane { position: relative; width: 100%; height: 100%; overflow: hidden; cursor: grab; touch-action: none; user-select: none; -webkit-user-select: none; outline: none; }
.ig-pane:active { cursor: grabbing; }
.ig-blob { position: absolute; border-radius: 50%; pointer-events: none; }
.ig-b1 { animation: ig-f1 22s ease-in-out infinite alternate; }
.ig-b2 { animation: ig-f2 26s ease-in-out infinite alternate; }
.ig-b3 { animation: ig-f3 18s ease-in-out infinite alternate; }
@keyframes ig-f1 { 0%,100% { transform: translate(0,0) scale(1) } 33% { transform: translate(8%,-6%) scale(1.15) } 66% { transform: translate(-6%,8%) scale(.9) } }
@keyframes ig-f2 { 0%,100% { transform: translate(0,0) scale(1) } 33% { transform: translate(-10%,8%) scale(1.2) } 66% { transform: translate(7%,-5%) scale(.85) } }
@keyframes ig-f3 { 0%,100% { transform: translate(0,0) scale(1) } 50% { transform: translate(5%,6%) scale(1.1) } }
@media (prefers-reduced-motion: reduce) { .ig-blob { animation: none } }
`;

export default function InfiniteGrid(props: InfiniteGridProps) {
  const {
    items,
    columns,
    cardWidth,
    radius = 0,
    gap,
    background,
    textColor,
    mutedColor,
    titleFont,
    subtitleFont,
    blobs,
    aspectRatio = "2 / 3",
    onItemClick,
    style,
  } = props;
  const list = items && items.length ? items : SAMPLE;
  const cols = Math.max(1, Math.round(columns));

  const paneRef = useRef<HTMLDivElement>(null);
  const matrixRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const block = useRef({ w: 0, h: 0 });
  const dragging = useRef(false);
  const dragFrom = useRef({ x: 0, y: 0 });
  const dragFromTarget = useRef({ x: 0, y: 0 });
  const last = useRef({ x: 0, y: 0, t: 0 });
  const moved = useRef(0);
  const placed = useRef(false);
  const hoverImg = useRef<HTMLImageElement | null>(null);

  // Load the faces picked in the Title / Subtitle font rows.
  useEffect(() => {
    const doc = paneRef.current?.ownerDocument;
    if (!doc) return;
    loadFamily(doc, titleFont?.fontFamily);
    loadFamily(doc, subtitleFont?.fontFamily);
  }, [titleFont?.fontFamily, subtitleFont?.fontFamily]);

  // Measure one tile of the 3 x 3 matrix and park the view on the middle one.
  useEffect(() => {
    const pane = paneRef.current;
    const tile = blockRef.current;
    if (!pane || !tile) return;
    placed.current = false;
    const measure = () => {
      const w = tile.offsetWidth;
      const h = tile.offsetHeight;
      const cw = pane.clientWidth;
      const ch = pane.clientHeight;
      if (!w || !h || !cw || !ch) return;
      block.current = { w, h };
      if (!placed.current) {
        const x = -w + (cw - w) / 2;
        const y = -h + (ch - h) / 2;
        pos.current = { x, y };
        target.current = { x, y };
        placed.current = true;
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pane);
    ro.observe(tile);
    return () => ro.disconnect();
  }, [cols, cardWidth, gap, list.length]);

  // One frame loop: coast, ease toward the target, wrap, skew. Idle while offscreen.
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;
    let raf = 0;
    let visible = true;
    let lastTransform = "";
    let wasGliding = false;
    let lastTime = performance.now();
    // Photos currently zoomed (or easing back), with their scale.
    const zoomed = new Map<HTMLImageElement, number>();

    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const { w, h } = block.current;
      const p = pos.current;
      const t = target.current;
      const v = vel.current;

      if (!dragging.current && (Math.abs(v.x) > 0.01 || Math.abs(v.y) > 0.01)) {
        v.x *= FRICTION;
        v.y *= FRICTION;
        t.x += v.x;
        t.y += v.y;
      }
      const k = dragging.current ? 0.16 : 0.09;
      p.x += (t.x - p.x) * k;
      p.y += (t.y - p.y) * k;

      // Settled: land on the target so the easing stops creeping by sub-pixels.
      const moving =
        dragging.current ||
        Math.abs(v.x) > 0.05 ||
        Math.abs(v.y) > 0.05 ||
        Math.abs(t.x - p.x) > 0.1 ||
        Math.abs(t.y - p.y) > 0.1;
      if (!moving) {
        p.x = t.x;
        p.y = t.y;
      }
      // No hover zoom while the grid glides, so cards sliding under a still cursor
      // do not flicker in and out. A plain click (no drag yet) keeps its zoom.
      const gliding = dragging.current ? moved.current >= CLICK_SLOP : moving;
      if (gliding !== wasGliding) {
        if (gliding) hoverImg.current = null;
        wasGliding = gliding;
      }

      // Hover zoom, driven here rather than by a CSS transition. A CSS transform
      // transition runs on the GPU, where the card clip edge was rounded differently
      // frame to frame, so the photo edge hopped a pixel back and forth (shivered).
      // A plain 2D scale written each frame is painted together with its clip.
      const hov = hoverImg.current;
      if (hov && !zoomed.has(hov)) zoomed.set(hov, 1);
      const ease = 1 - Math.exp(-dt / HOVER_TAU);
      zoomed.forEach((s, img) => {
        const goal = img === hov ? HOVER_SCALE : 1;
        let n = s + (goal - s) * ease;
        if (Math.abs(goal - n) < 0.0005) n = goal;
        if (n === 1 && goal === 1) {
          img.style.transform = "";
          zoomed.delete(img);
        } else if (n !== s) {
          img.style.transform = `scale(${n.toFixed(4)})`;
          zoomed.set(img, n);
        }
      });

      if (w > 0 && h > 0) {
        const shift = (dx: number, dy: number) => {
          p.x += dx;
          p.y += dy;
          t.x += dx;
          t.y += dy;
          dragFromTarget.current.x += dx;
          dragFromTarget.current.y += dy;
        };
        while (p.x < -w * 1.75) shift(w, 0);
        while (p.x > -w * 0.25) shift(-w, 0);
        while (p.y < -h * 1.75) shift(0, h);
        while (p.y > -h * 0.25) shift(0, -h);
      }

      // Text haze: a 3D / fractional-pixel transform keeps the grid on a GPU layer whose
      // bitmap is resampled (soft greyscale text, blurrier still under a scaled preview).
      // While it moves that layer keeps the motion smooth; at rest the grid sits on whole
      // pixels with a plain 2D translate, so the text is painted crisp at its shown size.
      let tf: string;
      if (moving) {
        const skewX = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, v.x * 0.08));
        const skewY = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, v.y * 0.08));
        tf = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) skew(${skewX.toFixed(2)}deg, ${skewY.toFixed(2)}deg)`;
      } else {
        tf = `translate(${Math.round(p.x)}px, ${Math.round(p.y)}px)`;
      }
      if (matrixRef.current && tf !== lastTransform) {
        matrixRef.current.style.transform = tf;
        lastTransform = tf;
      }
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(pane);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // Wheel needs a non-passive listener so the page doesn't scroll underneath.
  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
      }
      const dx = -e.deltaX * WHEEL_GAIN;
      const dy = -e.deltaY * WHEEL_GAIN;
      vel.current.x = vel.current.x * 0.3 + dx * 0.7;
      vel.current.y = vel.current.y * 0.3 + dy * 0.7;
      target.current.x += dx;
      target.current.y += dy;
    };
    pane.addEventListener("wheel", onWheel, { passive: false });
    return () => pane.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging.current = true;
    moved.current = 0;
    dragFrom.current = { x: e.clientX, y: e.clientY };
    dragFromTarget.current = { ...target.current };
    last.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    vel.current = { x: 0, y: 0 };
    paneRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) {
      // Mouse/pen only, so a tap on touch never leaves a photo stuck zoomed.
      if (e.pointerType !== "touch") {
        const card = (e.target as Element).closest?.(".ig-card");
        hoverImg.current = card ? card.querySelector("img") : null;
      }
      return;
    }
    const now = performance.now();
    const dt = Math.max(now - last.current.t, 1);
    moved.current += Math.hypot(e.clientX - last.current.x, e.clientY - last.current.y);
    vel.current = {
      x: vel.current.x * 0.25 + ((e.clientX - last.current.x) / dt) * 12 * 0.75,
      y: vel.current.y * 0.25 + ((e.clientY - last.current.y) / dt) * 12 * 0.75,
    };
    last.current = { x: e.clientX, y: e.clientY, t: now };
    target.current.x = dragFromTarget.current.x + (e.clientX - dragFrom.current.x) * DRAG_GAIN;
    target.current.y = dragFromTarget.current.y + (e.clientY - dragFrom.current.y) * DRAG_GAIN;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const pane = paneRef.current;
    if (pane && pane.hasPointerCapture(e.pointerId)) pane.releasePointerCapture(e.pointerId);
  };

  // Padding of half a gap per side makes the repeat period exactly content + gap.
  const matrix = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const fontStack = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
  // Blobs are a faint wash of the text colour into the background, so they never paint light over a dark fill.
  const blobTint = `color-mix(in srgb, ${textColor} 8%, ${background})`;

  return (
    <div className="ig-root" style={{ ...style, background }}>
      <style>{css}</style>
      <div
        ref={paneRef}
        className="ig-pane"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={() => (hoverImg.current = null)}
      >
        {blobs && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              pointerEvents: "none",
              opacity: 0.4,
            }}
          >
            <div
              className="ig-blob ig-b1"
              style={{
                top: "25%",
                left: "20%",
                width: "45%",
                aspectRatio: "1",
                background: blobTint,
                filter: "blur(90px)",
              }}
            />
            <div
              className="ig-blob ig-b2"
              style={{
                top: "66%",
                right: "25%",
                width: "50%",
                aspectRatio: "1",
                background: blobTint,
                filter: "blur(100px)",
              }}
            />
            <div
              className="ig-blob ig-b3"
              style={{
                top: "-25%",
                right: "33%",
                width: "40%",
                aspectRatio: "1",
                background: blobTint,
                filter: "blur(85px)",
              }}
            />
          </div>
        )}

        <div
          ref={matrixRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, max-content)",
            width: "max-content",
            // No will-change / backface-visibility: both pin the grid to a GPU
            // bitmap rastered once, which is what made the text hazy.
            transformOrigin: "50% 50%",
          }}
        >
          {matrix.map((id) => (
            <div
              key={id}
              ref={id === 4 ? blockRef : null}
              aria-hidden={id === 4 ? undefined : true}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${cardWidth}px)`,
                alignItems: "start",
                gap,
                padding: gap / 2,
              }}
            >
              {list.map((item, i) => (
                <div
                  key={i}
                  className="ig-card"
                  onClick={() => {
                    if (moved.current < CLICK_SLOP) onItemClick?.(item);
                  }}
                  style={{
                    width: cardWidth,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: aspectRatio,
                      overflow: "hidden",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#141419",
                      borderRadius: radius,
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {srcOf(item.imageUrl) && (
                      <img
                        src={srcOf(item.imageUrl)!}
                        alt={item.title}
                        draggable={false}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: radius,
                          pointerEvents: "none",
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        width: 18,
                        height: 18,
                        borderRadius: 3,
                        backgroundColor: "#A11C28",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        fontWeight: 900,
                        letterSpacing: 0,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                        pointerEvents: "none",
                      }}
                    >
                      VB
                    </div>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                      lineHeight: 1.3,
                      pointerEvents: "none",
                    }}
                  >
                    <div
                      style={{
                        color: textColor,
                        fontWeight: 600,
                        fontSize: 13,
                        letterSpacing: "-0.01em",
                        ...(titleFont || {}),
                      }}
                    >
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div
                        style={{
                          color: mutedColor,
                          marginTop: 3,
                          fontSize: 11,
                          fontWeight: 400,
                          opacity: 0.8,
                          ...(subtitleFont || {}),
                        }}
                      >
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

InfiniteGrid.defaultProps = {
  items: SAMPLE,
  columns: 4,
  cardWidth: 150,
  radius: 0,
  gap: 24,
  background: "#ffffff",
  textColor: "#0a0a0a",
  mutedColor: "#a3a3a3",
  blobs: false,
};

export { InfiniteGrid };
