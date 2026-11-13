/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

// Delivered by Originkit · stack: framer
// Paste into a Framer code component. Property controls included.
import * as React from "react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * AccordionOS: a full-bleed photo with a column of frosted pills over it.
 * Open a pill and it widens to show its note while the photo behind
 * cross-fades to match; a small deck at the bottom steps through them. It
 * plays through on its own and pauses while you're on it. Arrow keys (or W
 * and S) step, number keys jump, Escape closes every item and keeps the last photo.
 *
 * Based on AccordionOS from useLayouts (uselayouts.com), MIT licensed.
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 * @framerIntrinsicWidth 480
 * @framerIntrinsicHeight 320
 */

export interface Item {
  title: string;
  badge: string;
  claim: string;
  image: any;
  alt: string;
  offsetY?: number;
}

export interface AccordionOSProps {
  items?: Item[];
  defaultOpen?: number;
  autoplay?: boolean;
  interval?: number;
  pauseOnHover?: boolean;
  radius?: number;
  scale?: number;
  background?: string;
  font?: React.CSSProperties;
  onItemChange?: (index: number | null) => void;
  style?: React.CSSProperties;
}

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const SAMPLE: Item[] = [
  {
    title: "Centering",
    badge: "01",
    claim:
      "Push the clay into the wheel's dead centre. Until it stops wobbling, nothing else you do will hold.",
    image: IMG("1771523350533-a831d1f703a7"),
    alt: "Clay-covered hands centring a pot on the wheel",
  },
  {
    title: "Pulling Walls",
    badge: "02",
    claim:
      "Two fingers inside, one outside. Pull slow and even, and the wall rises or it collapses.",
    image: IMG("1760018890645-28c8312cd7cb"),
    alt: "Potter pulling up the wall of a vessel on the wheel",
  },
  {
    title: "Glaze Prep",
    badge: "03",
    claim:
      "Oxides mixed in small bowls, tested on tile shards. The kiln decides if your recipe was right.",
    image: IMG("1577576223085-3eb295cd414f"),
    alt: "Small bowls of mixed glaze on a studio table",
  },
  {
    title: "Trimming",
    badge: "04",
    claim:
      "Foot ring cut while the bowl is leather-hard. One cut too deep and months of work go in the slop bucket.",
    image: IMG("1739467516257-20c1d7f1949a"),
    alt: "Potter cutting into a leather-hard pot with a blade",
  },
  {
    title: "Finished Ware",
    badge: "05",
    claim: "Cooling crackle, lids that fit, handles thick enough for hot tea. The kiln signed off.",
    image: IMG("1782351254515-d7a53dc60b7f"),
    alt: "A stoneware cup with a red glaze on a wooden table",
  },
];

/** The URL of an image value: a ResponsiveImage object or a plain URL string. */
function srcOf(v: any): string | null {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v.src === "string" && v.src) return v.src;
  return null;
}

/** A per-item Y Offset (-250..250) as an object-position that spans the crop the picture leaves. */
function posOf(offsetY: unknown): string {
  const o =
    typeof offsetY === "number" && Number.isFinite(offsetY)
      ? Math.max(-250, Math.min(250, offsetY))
      : 0;
  return `50% ${50 - (o / 250) * 50}%`;
}

// The original label look. The system stack stays behind the picked family, so an unloaded web font falls back to it.
const DEFAULT_FONT: React.CSSProperties = {
  fontFamily: "Inter",
  fontWeight: 600,
  fontSize: 13.5,
  letterSpacing: "-0.01em",
  lineHeight: "1.4em",
  textAlign: "left",
};
const SYSTEM_SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// The card is laid out on a logical stage and scaled to the frame, so spacing holds at any size.
const MIN_W = 760;
const MIN_H = 470; // five pills, one open with a three-line note, and the step deck, inside the padding
const PAD = 24;
const COLUMN = 420;
const PILL_GAP = 10;
const PILL_PAD = 16;
const PHOTO_BLEED = 3; // px each photo reaches past the card edge, hidden by its clip
const NOTE_W = COLUMN - PILL_PAD * 2 - 2; // an open pill's content width, inside its padding and 1px border

const SMOOTH = { duration: 0.42, ease: [0.25, 1, 0.5, 1] as const };
const HEIGHT_SMOOTH = { duration: 0.38, ease: [0.25, 1, 0.5, 1] as const };
const BOUNCY = { duration: 0.35, ease: [0.25, 1, 0.5, 1] as const };
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const css = `
.aos { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; user-select: none; outline: none; }
.aos-pill { box-sizing: border-box; width: fit-content; max-width: ${COLUMN}px; padding: 10px ${PILL_PAD}px; border-radius: 16px; cursor: pointer; outline: none; overflow: hidden;
  background: rgba(10, 10, 16, 0.82); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
  transition: background-color .3s cubic-bezier(0.25, 1, 0.5, 1), border-color .3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow .3s cubic-bezier(0.25, 1, 0.5, 1); }
.aos-pill:hover { background: rgba(18, 18, 26, 0.92); border-color: rgba(255,255,255,0.25); box-shadow: 0 6px 20px rgba(0,0,0,0.6); }
.aos-pill:focus-visible { box-shadow: 0 0 0 2px rgba(161,28,40,0.6); }
.aos-pill[data-open="true"] { width: ${COLUMN}px; background: rgba(8, 8, 14, 0.94); border-color: rgba(161,28,40,0.55); box-shadow: 0 12px 32px rgba(0,0,0,0.85), 0 0 20px rgba(161,28,40,0.18); }
.aos-nav { box-sizing: border-box; width: 28px; height: 28px; padding: 0; margin: 0; border-radius: 50%; cursor: pointer;
  display: flex; align-items: center; justify-content: center; color: #ffffff;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: background-color .2s ease, border-color .2s ease; }
.aos-nav:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.3); }
.aos-nav:focus-visible { outline: 2px solid rgba(161,28,40,0.6); outline-offset: 1px; }
`;

/**
 * A pill's note. Its height springs to the measured height of the text rather than to "auto": framer
 * resolves "auto" from the on-screen box, which the stage's scale() inflates or shrinks, so the pill
 * overshot and then snapped back when the animation ended. offsetHeight is in layout pixels.
 */
function Note({
  text,
  reduce,
  textStyle,
}: {
  text: string;
  reduce: boolean;
  textStyle: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [h, setH] = useState(0);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setH(el.offsetHeight);
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const transition = reduce ? { duration: 0 } : HEIGHT_SMOOTH;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: 1,
        height: h,
        transition: { height: transition, opacity: { duration: 0.28, delay: 0.06 } },
      }}
      exit={{
        opacity: 0,
        height: 0,
        transition: { height: transition, opacity: { duration: 0.2 } },
      }}
      style={{ overflowX: "visible", overflowY: "clip", width: 0, minWidth: "100%" }}
    >
      <div ref={ref} style={{ paddingTop: 8 }}>
        <p
          style={{
            boxSizing: "border-box",
            width: NOTE_W,
            margin: 0,
            paddingLeft: 34,
            color: "rgba(255,255,255,0.76)",
            fontSize: "12px",
            lineHeight: 1.6,
            overflowWrap: "break-word",
            ...textStyle,
          }}
        >
          {text}
        </p>
      </div>
    </motion.div>
  );
}

export default function AccordionOS(props: AccordionOSProps) {
  const {
    items,
    defaultOpen,
    autoplay,
    interval,
    pauseOnHover,
    radius,
    scale: scalePct = 100,
    background,
    font,
    onItemChange,
    style,
  } = props;
  const list = items && items.length ? items : SAMPLE;
  const n = list.length;
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState({ w: 480, h: 320 });
  // "Open first" counts from 1; 0 starts with every item closed, and anything past the end opens the last item.
  const first = Math.min(Math.max(0, Math.round(defaultOpen || 0)), n);
  const initial = first === 0 ? null : first - 1;
  const [active, setActive] = useState<number | null>(initial);
  // Hover/focus pause lives in a ref: as state, focusing a tapped pill re-rendered the whole card
  // in the same moment the switch started, and that work showed up as a stalled first frame.
  const pausedRef = useRef(false);
  const setPaused = (v: boolean) => {
    pausedRef.current = v;
  };
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver(
      () =>
        el.clientWidth && el.clientHeight && setFrame({ w: el.clientWidth, h: el.clientHeight }),
    );
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Follow "Open first" when it (or the item count) changes, so an edit shows up straight away.
  useEffect(() => setActive(initial), [initial, n]);

  // The fit that holds the whole column in the frame, times the Scale control.
  // Scale shrinks the whole card about the frame centre. The card is laid out at its smaller size
  // rather than transformed, so its corners and the pill animations stay crisp and in place.
  const pct =
    typeof scalePct === "number" && Number.isFinite(scalePct)
      ? Math.max(20, Math.min(100, scalePct))
      : 100;
  const s = pct / 100;
  const cardW = frame.w * s;
  const cardH = frame.h * s;
  const cardR = Math.max(0, radius * s);
  const scale = Math.min(cardW / MIN_W, cardH / MIN_H);
  const stageW = cardW / scale;
  const stageH = cardH / scale;

  // Font: the family and style on every label; size sets the 15px title and the rest keep their ratio to it.
  const f = { ...DEFAULT_FONT, ...(font ?? {}) };
  const fs = (() => {
    const v = typeof f.fontSize === "string" ? parseFloat(f.fontSize) : f.fontSize;
    return typeof v === "number" && Number.isFinite(v) ? Math.max(6, Math.min(48, v)) : 15;
  })();
  const k = fs / 15;
  const family = f.fontFamily ? `${f.fontFamily}, ${SYSTEM_SANS}` : SYSTEM_SANS;
  const titleStyle: React.CSSProperties = {
    fontSize: fs,
    fontWeight: f.fontWeight,
    lineHeight: `${fs * (4 / 3)}px`,
    letterSpacing: f.letterSpacing,
    color: "#ffffff",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };
  const noteStyle: React.CSSProperties = {
    fontSize: 11.5 * k,
    lineHeight: 1.6,
    color: "rgba(255, 255, 255, 0.78)",
    textAlign: f.textAlign,
  };

  const select = useCallback(
    (next: number | null) => {
      setActive(next);
      onItemChange?.(next);
    },
    [onItemChange],
  );

  // Read the current item from a ref, so the change event fires once, outside the state updater.
  const activeRef = useRef(active);
  activeRef.current = active;
  const step = useCallback(
    (dir: 1 | -1) => {
      const prev = activeRef.current;
      const next = prev === null ? 0 : (prev + dir + n) % n;
      activeRef.current = next;
      select(next);
    },
    [n, select],
  );

  useEffect(() => {
    if (!autoplay || !visible) return;
    const id = setInterval(
      () => {
        if (pauseOnHover && pausedRef.current) return;
        step(1);
      },
      Math.max(1000, interval * 1000),
    );
    return () => clearInterval(id);
  }, [autoplay, visible, pauseOnHover, interval, step]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const k = e.key.toLowerCase();
    if (k === "arrowdown" || k === "arrowright" || k === "s") step(1);
    else if (k === "arrowup" || k === "arrowleft" || k === "w") step(-1);
    else if (k === "escape") select(null);
    else if (/^[1-9]$/.test(k) && +k <= n) select(+k - 1);
    else return;
    e.preventDefault();
  };

  /* Each pill springs its real width between its closed size and the open column, instead of a
       framer-motion layout animation. Layout animations fake the resize with a scale transform, which
       stretched the 1px border, the backdrop blur and the corners for a few frames on every switch, and
       measuring every pill at the tap stalled the first frame. The closed width is the title measured by
       a ResizeObserver (layout px, so the stage scale and hover transforms do not touch it). */
  const titleEls = useRef<(HTMLSpanElement | null)[]>([]);
  const [titleW, setTitleW] = useState<number[]>([]);
  useIsoLayoutEffect(() => {
    const els = titleEls.current.slice(0, n);
    const ro = new ResizeObserver((entries) => {
      const ws = els.map((el) => {
        const e = entries.find((x) => x.target === el);
        return e ? e.contentRect.width : -1;
      });
      setTitleW((prev) => {
        const next = ws.map((v, i) => (v >= 0 ? v : (prev[i] ?? 0)));
        return prev.length === next.length && prev.every((v, i) => Math.abs(v - next[i]) < 0.01)
          ? prev
          : next;
      });
    });
    els.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [n]);
  // Border 1 + padding + 22px icon + 12px gap on each side of the title.
  const closedW = (i: number) => Math.min(COLUMN, 2 + PILL_PAD * 2 + 22 + 12 + (titleW[i] ?? 0));

  const fade = reduce ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT };
  // One photo per item; `shown` is the one on screen. With every item closed the last one shown stays
  // (the first item's on a closed start), so closing never swaps to a photo the panel cannot set.
  const photos = list;
  const lastShown = useRef(0);
  if (active !== null && active < n) lastShown.current = active;
  const shown = Math.min(lastShown.current, n - 1);

  return (
    <div
      ref={rootRef}
      className="aos"
      tabIndex={0}
      aria-label="Accordion showcase"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setPaused(false)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
        overflow: "hidden",
        background: "transparent",
        fontFamily: family,
        fontStyle: f.fontStyle,
      }}
    >
      <style>{css}</style>
      {/* The card: rounded at screen size, outside the scaled stage, so its corners stay smooth. The
                backdrop stops 1px inside the rounded edge. Chrome cuts it and the photo with two separate
                anti-aliased edges, and where both reached the rim the light backdrop bled a line round every
                corner; now only the photo meets the edge. */}
      <div
        style={{
          position: "absolute",
          left: `${(100 - pct) / 2}%`,
          top: `${(100 - pct) / 2}%`,
          width: `${pct}%`,
          height: `${pct}%`,
          borderRadius: cardR,
          overflow: "hidden",
          isolation: "isolate",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 1,
            borderRadius: Math.max(0, cardR - 1),
            background,
          }}
        />
        {/* Photos stay mounted and cross-fade, so switching never waits on a decode. */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* The backdrop shows wherever there is no photo: an item without an image, or one still loading. */}
          {photos.map((item, i) => {
            const on = i === shown;
            const src = srcOf(item.image);
            if (!src) return null;
            return (
              <motion.img
                key={i}
                src={src}
                srcSet={typeof item.image === "object" ? item.image.srcSet || undefined : undefined}
                alt={item.alt || (typeof item.image === "object" && item.image.alt) || ""}
                draggable={false}
                decoding="async"
                initial={false}
                // Opacity only. The incoming photo used to zoom from 105% as well: a scaling photo is
                // re-rastered in tiles every frame, and under a shrunk preview (the builder at 47%) the
                // tiles met the card edge at different sub-pixels, so the side edge stepped and blocks flashed.
                animate={{ opacity: on ? 1 : 0 }}
                // The outgoing photo holds until the incoming one has faded in over it, so the
                // backdrop doesn't bleed through mid-fade; it goes at once if there's no photo next.
                transition={
                  on || !srcOf(photos[shown].image) ? fade : { ...fade, delay: fade.duration }
                }
                // Overscanned past the card on every side, so the card's own rounded clip is the only edge
                // drawn. A photo flush with the card left its edge on fractional device pixels when the
                // page is scaled, and raster tiles rounded it differently: a broken, stepped side line.
                style={{
                  position: "absolute",
                  top: -PHOTO_BLEED,
                  left: -PHOTO_BLEED,
                  width: `calc(100% + ${PHOTO_BLEED * 2}px)`,
                  height: `calc(100% + ${PHOTO_BLEED * 2}px)`,
                  objectFit: "cover",
                  objectPosition: posOf(item.offsetY),
                  // maxWidth/maxHeight: page resets such as Tailwind set img { max-width: 100% },
                  // which capped the overscanned photo and left the backdrop showing down the right edge.
                  maxWidth: "none",
                  maxHeight: "none",
                  display: "block",
                  zIndex: on ? 2 : 1,
                }}
              />
            );
          })}
          {/* Subtle directional gradient overlay so text pills have pristine contrast against any photo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(3,3,6,0.85) 0%, rgba(3,3,6,0.55) 45%, rgba(3,3,6,0.1) 75%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        </div>

        {/* The stage: laid out at the reference size and scaled to the card. */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: stageW,
            height: stageH,
            scale,
            originX: 0,
            originY: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: PAD,
              left: PAD,
              bottom: PAD,
              width: COLUMN,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: PILL_GAP,
                width: "100%",
              }}
            >
              {list.map((item, i) => {
                const open = active === i;
                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={
                      titleW.length === n ? { width: open ? COLUMN : closedW(i) } : undefined
                    }
                    transition={reduce ? { duration: 0 } : SMOOTH}
                    role="button"
                    tabIndex={0}
                    aria-expanded={open}
                    className="aos-pill"
                    data-open={open}
                    onClick={() => select(open ? null : i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        select(open ? null : i);
                      }
                    }}
                    whileHover={reduce ? undefined : { scale: open ? 1.008 : 1.02, x: 2 }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    style={{ borderRadius: 16 }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
                      <motion.div
                        animate={{
                          backgroundColor: open ? "#A11C28" : "rgba(255,255,255,0.1)",
                          color: "#ffffff",
                          borderColor: open ? "#A11C28" : "rgba(255,255,255,0.2)",
                        }}
                        transition={SMOOTH}
                        style={{
                          width: 22,
                          height: 22,
                          flexShrink: 0,
                          boxSizing: "border-box",
                          borderRadius: "50%",
                          border: "1.5px solid",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                        }}
                      >
                        <motion.svg
                          viewBox="0 0 24 24"
                          width={13}
                          height={13}
                          animate={{ rotate: open ? 135 : 0 }}
                          transition={SMOOTH}
                          aria-hidden
                        >
                          <line
                            x1="12"
                            y1="5"
                            x2="12"
                            y2="19"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                          <line
                            x1="5"
                            y1="12"
                            x2="19"
                            y2="12"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                          />
                        </motion.svg>
                      </motion.div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <span
                          ref={(el) => {
                            titleEls.current[i] = el;
                          }}
                          style={titleStyle}
                        >
                          {item.title}
                        </span>
                        {/* Always laid out (past the right edge of a closed pill, which clips it) and faded in once
                                                the pill has widened, so it never pops in squeezed beside the title. */}
                        {item.badge && (
                          <motion.span
                            aria-hidden={!open}
                            initial={false}
                            animate={{ opacity: open ? 1 : 0 }}
                            transition={
                              reduce ? { duration: 0 } : { duration: 0.25, delay: open ? 0.08 : 0 }
                            }
                            style={{
                              fontSize: 9.5 * k,
                              fontWeight: 700,
                              color: "#F59E0B",
                              letterSpacing: "0.08em",
                              textTransform: "uppercase",
                              fontVariantNumeric: "tabular-nums",
                              flexShrink: 0,
                            }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {open && (
                        <Note
                          key="claim"
                          text={item.claim}
                          reduce={!!reduce}
                          textStyle={noteStyle}
                        />
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 16 }}>
              <AnimatePresence>
                {active !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    transition={reduce ? { duration: 0 } : SMOOTH}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: 4,
                      borderRadius: 100,
                      background: "rgba(10,10,16,0.85)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    }}
                  >
                    <button
                      type="button"
                      className="aos-nav"
                      aria-label="Previous"
                      onClick={() => step(-1)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width={13}
                        height={13}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        height: 26,
                        fontSize: 11 * k,
                        fontWeight: 600,
                        lineHeight: 1,
                        color: "#E5E7EB",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      <span>{String((active ?? 0) + 1).padStart(2, "0")}</span>
                      <span style={{ opacity: 0.4 }}>/</span>
                      <span>{String(n).padStart(2, "0")}</span>
                    </div>
                    <button
                      type="button"
                      className="aos-nav"
                      aria-label="Next"
                      onClick={() => step(1)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width={13}
                        height={13}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

AccordionOS.defaultProps = {
  items: SAMPLE,
  defaultOpen: 1,
  autoplay: true,
  interval: 3.5,
  pauseOnHover: true,
  radius: 24,
  scale: 100,
  background: "#f6f6f8",
  font: DEFAULT_FONT,
};

export { AccordionOS };

// Control order arranged in the builder.
