/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import * as THREE from "three";

/** Public asset under /sections/hero-13/assets */
function asset(file: string) {
  return `/originkit/hero-13/${file}`;
}

/**
 * Ported from the units.gr hero — a minified webpack bundle, rebuilt from the
 * class that drove it.
 *
 * A tunnel of segments rushes past the camera forever. Every other segment is
 * papered with slabs: each slot is a coin flip between an image and a block of
 * colour, and only about half the slots take one at all, so the walls never
 * settle into a pattern. Hold the pointer down and the whole thing accelerates —
 * that is what "Press to Start" is asking for.
 *
 * The original leaned on GSAP for two tweens and a 10000vh spacer for page
 * scroll. Neither is here: the spacer was a red herring (the tunnel drives itself
 * off its own velocity, never off scroll position), and two eases are not worth a
 * dependency.
 */

// Shown before anything is uploaded, and in the code preview, which renders with
// no props at all.
const DEFAULT_IMAGES = [
  asset("potrait-1.png"),
  asset("potrait-2.png"),
  asset("potrait-3.png"),
  asset("potrait-4.png"),
  asset("potrait-5.png"),
  asset("potrait-6.png"),
];

// One DEFAULTS drives both the destructure fallbacks and the control defaults.
// Panel sliders are whole numbers, mapped to effective values inside.
const DEFAULTS = {
  background: "#000000",
  // 0xB0B0B0 — the original's grid line, out of the decimal it stored it as.
  lineColor: "#B0B0B0",
  lineOpacity: 50,
  // The six it cycled the colour slabs through.
  colors: ["#131313"],
  // Divisions up the wall.
  grid: 4,
  cellMode: "stretched" as const,
  tunnelSize: 1, // 1–20 → 1×–3× the tunnel's cross-section
  speed: 100, // → /100
  boost: 100, // → /10
  fade: 100, // → how far back the haze reaches
  label: true,
  labelText: "Press to Start",
  labelFill: "#FFFFFF",
  labelColor: "#000000",
  // ControlType.Font returns fontSize as a string ("14px"), so the fallback
  // is written the same way — the two must agree in shape.
  labelFont: { fontFamily: "Inter", fontSize: "14px", fontWeight: 500 },
};

// The tunnel, exactly as the original had it. The divisions per wall were fixed
// at 4 as well; they are the Grid control now, so the sizes they imply have to be
// worked out per render rather than up here. The cross-section is the Size
// control's base, scaled per render for the same reason.
const TUNNEL_WIDTH = 2;
const TUNNEL_HEIGHT = 1.8;
// A segment is about this deep before it is snapped to a whole number of cells,
// and the tunnel is this long end to end. The length is what is held constant —
// the segment count is worked out from it, so nothing about the grid changes how
// far the tunnel runs.
const BASE_SEGMENT_DEPTH = 1;
const TUNNEL_LENGTH = 15;
// Radius of the tubes the grid is drawn with. Thin enough to read as a line, and
// a tube rather than a line so it holds its width in perspective.
const LINE_RADIUS = 0.003;
// How far the camera travels per unit of scroll, and how hard it chases.
const SCROLL_TO_Z = 0.05;
const CAMERA_CHASE = 0.1;
// Seconds an image takes to fade up once its texture has landed.
const FADE_IN = 1;

// Where the haze ends: just short of the far end of the tunnel, so a segment is
// already invisible by the point it is recycled into place. Anything nearer than
// this is on its way out of the fog and into view. Segment depth is snapped to
// whole cells, so this is worked out per render.
const fogFarFor = (segCount: number, segDepth: number) => segCount * segDepth * 0.95;

interface ImageBoxProps {
  images: any[];
  colors: string[];
  background: string;
  lineColor: string;
  lineOpacity: number;
  grid: number;
  cellMode: "square" | "stretched";
  tunnelSize: number;
  speed: number;
  boost: number;
  fade: number;
  label: boolean;
  labelText: string;
  labelFill: string;
  labelColor: string;
  labelFont: CSSProperties;
  style?: CSSProperties;
}

/**
 * Each entry is { image, y }: the ResponsiveImage control hands back { src },
 * and code may pass a bare string or a bare image object, so all three shapes
 * are unwrapped here. `y` is the vertical crop anchor, 0 = top … 100 = bottom.
 */
type Slide = { url: string; y: number };

const slideOf = (entry: any): Slide => {
  const raw = entry?.image ?? entry;
  const url = typeof raw === "string" ? raw : (raw?.src ?? "");
  const y = typeof entry?.y === "number" ? entry.y : 50;
  return { url, y };
};

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerIntrinsicWidth 600
 * @framerIntrinsicHeight 600
 * @framerDisableUnlink
 */
export default function ImageBox(props: Partial<ImageBoxProps>) {
  const {
    images,
    colors,
    background = DEFAULTS.background,
    lineColor = DEFAULTS.lineColor,
    lineOpacity = DEFAULTS.lineOpacity,
    grid = DEFAULTS.grid,
    cellMode = DEFAULTS.cellMode,
    tunnelSize = DEFAULTS.tunnelSize,
    speed = DEFAULTS.speed,
    boost = DEFAULTS.boost,
    fade = DEFAULTS.fade,
    label = DEFAULTS.label,
    labelText = DEFAULTS.labelText,
    labelFill = DEFAULTS.labelFill,
    labelColor = DEFAULTS.labelColor,
    labelFont = DEFAULTS.labelFont,
    style,
  } = props;

  const frameRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Fall back on an EMPTY list, not just a missing one: an untouched Array
  // control hands over `[]`, and `[]` is not undefined, so a destructuring
  // default would never fire and the tunnel would come up bare.
  const slides = useMemo<Slide[]>(() => {
    const list = (images ?? []).map(slideOf).filter((s) => s.url);
    return list.length ? list : DEFAULT_IMAGES.map((url) => ({ url, y: 50 }));
  }, [images]);
  // The effect only needs to rebuild when a URL or a crop actually changes,
  // not every time the Array control hands back a fresh object.
  const slideKey = slides.map((s) => `${s.url}|${s.y}`).join(",");

  const palette = useMemo(() => {
    const list = (colors ?? []).filter(Boolean);
    return list.length ? list : DEFAULTS.colors;
  }, [colors]);

  // Live config, read by the render loop, so tweaking a control never tears the
  // WebGL context down and rebuilds it.
  const cfgRef = useRef<any>(null);
  cfgRef.current = {
    speed: Math.max(0, speed) / 100,
    boost: Math.max(0, boost) / 10,
  };

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    let pressed = false;
    let alive = true;

    // Size slider is 1–20 whole, mapped to 1×–3×: 1 is the original
    // cross-section, 20 the widest.
    const sizeUi = Math.max(1, Math.min(20, Math.round(tunnelSize)));
    const sizeK = 1 + ((sizeUi - 1) * 2) / 19;

    // Grid is the number of divisions up the wall, and that fixes one
    // square cell. Width and depth are then snapped to a whole number of
    // those same cells, so every slab is square and the walls still tile
    // exactly.
    //
    // Depth is snapped, not derived: a segment holds however many rows of
    // cells fit along its fixed length, rather than being one cell deep.
    // Tying the segment's depth to the cell size is what made the tunnel
    // collapse as Grid went up — at Grid 12 the whole thing was a seventh
    // of its length, which reads as the walls looming in. Only Tunnel Size
    // moves the tunnel now.
    const rows = Math.max(1, Math.round(grid));
    let cols: number;
    let colW: number;
    let rowH: number;
    let cellDepth: number;
    let depthCells: number;
    let segDepth: number;
    let tunnelW: number;
    let tunnelH: number;

    if (cellMode === "square") {
      // Grid fixes one square cell; width and depth are then snapped to a
      // whole number of those same cells, so every slab is square and the
      // walls still tile exactly.
      //
      // Depth is snapped, not derived: a segment holds however many rows
      // of cells fit along its fixed length, rather than being one cell
      // deep. Tying the segment's depth to the cell size is what made the
      // tunnel collapse as Grid went up.
      const cell = (TUNNEL_HEIGHT * sizeK) / rows;
      cols = Math.max(1, Math.round((TUNNEL_WIDTH * sizeK) / cell));
      depthCells = Math.max(1, Math.round(BASE_SEGMENT_DEPTH / cell));
      cellDepth = cell;
      segDepth = depthCells * cell;
      tunnelH = cell * rows;
      tunnelW = cell * cols;
      colW = cell;
      rowH = cell;
    } else {
      // Stretched, as it originally was: the wall is cut Grid ways in both
      // directions and a segment is one slab deep, so a slab is however
      // long the segment is. Raising Grid narrows the slabs without
      // shortening them, which is what gives the long streaks down the
      // tunnel.
      cols = rows;
      depthCells = 1;
      segDepth = BASE_SEGMENT_DEPTH;
      cellDepth = BASE_SEGMENT_DEPTH;
      tunnelW = TUNNEL_WIDTH * sizeK;
      tunnelH = TUNNEL_HEIGHT * sizeK;
      colW = tunnelW / cols;
      rowH = tunnelH / rows;
    }

    // Segments are counted to fill a fixed length, so neither mode's depth
    // stretches or shortens the tunnel itself.
    const segCount = Math.max(6, Math.round(TUNNEL_LENGTH / segDepth));

    // How likely a slot in a taking row is to be filled.
    //
    // Two things pull against each other here. Coverage of the wall is just
    // 0.5 x this, whatever the cell size, because the cells tile it
    // completely — so matching Stretched on coverage means the same flat
    // 0.5, which buried the walls in images: Square's cells are far smaller
    // and there are far more of them. Matching it on the NUMBER of slabs
    // per unit of tunnel instead lands near a tenth of the wall covered,
    // which reads as bare.
    //
    // So Square sits halfway between the two — noticeably fewer and larger
    // gaps than a flat coin, without the walls emptying out.
    const perimeterCells = 2 * cols + 2 * rows;
    const countMatched = Math.min(0.5, (2 * rows * cellDepth) / perimeterCells);
    const fillChance = cellMode === "square" ? (countMatched + 0.5) / 2 : 0.5;
    const fogFar = fogFarFor(segCount, segDepth);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background);

    // Haze at the far end, in the background's own colour, so the tunnel
    // dissolves into the backdrop instead of ending at a hard mouth. Without
    // it a segment is recycled into place at full strength and simply appears
    // out of nothing at the vanishing point.
    //
    // Fade is how far back the haze reaches: at 0 the fog is a step right at
    // the end and things snap in as they did; at 100 it starts at the camera
    // and the whole tunnel is smoke. The near plane is held off the far one so
    // the two can never meet and divide by zero.
    const fogNear = Math.min(fogFar * (1 - Math.min(100, Math.max(0, fade)) / 100), fogFar - 0.01);
    scene.fog = new THREE.Fog(new THREE.Color(background), fogNear, fogFar);

    const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    // One material for every tube in the grid — thousands of meshes, one
    // material, so recolouring the grid is a single write.
    const lineMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(lineColor),
      transparent: true,
      opacity: Math.max(0, Math.min(100, lineOpacity)) / 100,
    });

    const hw = tunnelW / 2;
    const hh = tunnelH / 2;

    /* ── Everything below is built ONCE and shared ─────────────────────
     *
     * This is the whole optimisation. The original built a fresh geometry,
     * a fresh material and a fresh TEXTURE every time a segment recycled,
     * then threw them away — so at speed it was decoding and uploading JPEGs
     * continuously, on the main thread, forever. That is why it ran smooth
     * with no images and stuttered the moment there were any.
     *
     * Each image is now loaded exactly once. Recycling a segment picks from
     * these and allocates nothing at all.
     */

    // Two geometries cover every slab: the floor and ceiling take one shape,
    // the two walls the other.
    const geoFloor = new THREE.PlaneGeometry(colW, cellDepth);
    const geoWall = new THREE.PlaneGeometry(cellDepth, rowH);

    // Three cover every tube: along the tunnel, across it, and up it. The
    // long one spans the whole run, because the rails are one static
    // lattice now rather than a fresh set bolted to every segment — see
    // below.
    const railLength = segCount * segDepth + segDepth;
    const geoTubeZ = new THREE.TubeGeometry(
      new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -railLength)),
      1,
      LINE_RADIUS,
      8,
    );
    const geoTubeX = new THREE.TubeGeometry(
      new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(tunnelW, 0, 0)),
      1,
      LINE_RADIUS,
      8,
    );
    const geoTubeY = new THREE.TubeGeometry(
      new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, tunnelH, 0)),
      1,
      LINE_RADIUS,
      8,
    );

    const colorMats = palette.map(
      (hex) =>
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(hex),
          side: THREE.DoubleSide,
        }),
    );

    // One material per image, and one load per image. Each starts invisible
    // and fades up when its texture lands, so a slow image never pops in.
    const imageMats = slides.map(({ url, y }) => {
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      loader.load(
        url,
        (tex) => {
          if (!alive) {
            tex.dispose();
            return;
          }
          // LinearFilter skips building a mip chain — the slabs are
          // never far enough away to want one, and generating them is
          // work at exactly the wrong moment.
          tex.minFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.colorSpace = THREE.SRGBColorSpace;

          // Cover, always: scale the shorter axis to fill the slab and
          // crop the overflow off the other one. Slabs are square, so
          // the plane's aspect is 1 and only the image's own aspect
          // decides which axis gets cut.
          const iw = tex.image?.width ?? 1;
          const ih = tex.image?.height ?? 1;
          const aspect = iw / ih;
          if (aspect > 1) {
            // Wider than tall — crop the sides, centred.
            tex.repeat.set(1 / aspect, 1);
            tex.offset.set((1 - 1 / aspect) / 2, 0);
          } else {
            // Taller than wide — crop top/bottom, anchored by Y.
            // 0 keeps the top of the image, 100 the bottom.
            const rY = aspect;
            const anchor = Math.max(0, Math.min(100, y)) / 100;
            tex.repeat.set(1, rY);
            tex.offset.set(0, (1 - rY) * (1 - anchor));
          }

          mat.map = tex;
          mat.needsUpdate = true;
          fading.push(mat);
        },
        undefined,
        () => {
          // A dead URL should cost a blank slab, not a broken tunnel.
        },
      );
      return mat;
    });

    // Materials still fading up after their texture landed.
    const fading: THREE.MeshBasicMaterial[] = [];

    // Counters, not random picks: stepping through the lists by a stride
    // keeps neighbouring slabs off the same image or colour.
    let populateIndex = 0;
    let colorIndex = 0;
    let imageIndex = 0;

    /** A tube on a shared geometry — position and rotation do the rest. */
    const tube = (geo: THREE.BufferGeometry, x: number, y: number, z = 0) => {
      const m = new THREE.Mesh(geo, lineMaterial);
      m.position.set(x, y, z);
      return m;
    };

    // Every place a slab can go, worked out once. A segment builds one mesh
    // per slot and then only ever changes its material and whether it is
    // visible — so recycling never touches the scene graph.
    const SLOTS: Array<{
      geo: THREE.BufferGeometry;
      pos: THREE.Vector3;
      rot: THREE.Euler;
      // Which row down the segment this slot sits in.
      d: number;
    }> = [];
    // A segment is depthCells rows of cells deep, so the slots run in z as
    // well as around the perimeter.
    for (let d = 0; d < depthCells; d++) {
      const z = -(d + 0.5) * cellDepth;
      for (let i = 0; i < cols; i++) {
        const x = -hw + i * colW + colW / 2;
        SLOTS.push({
          geo: geoFloor,
          pos: new THREE.Vector3(x, -hh, z),
          rot: new THREE.Euler(-Math.PI / 2, 0, 0),
          d,
        });
        SLOTS.push({
          geo: geoFloor,
          pos: new THREE.Vector3(x, hh, z),
          rot: new THREE.Euler(Math.PI / 2, 0, 0),
          d,
        });
      }
      for (let i = 0; i < rows; i++) {
        const y = -hh + i * rowH + rowH / 2;
        SLOTS.push({
          geo: geoWall,
          pos: new THREE.Vector3(-hw, y, z),
          rot: new THREE.Euler(0, Math.PI / 2, 0),
          d,
        });
        SLOTS.push({
          geo: geoWall,
          pos: new THREE.Vector3(hw, y, z),
          rot: new THREE.Euler(0, -Math.PI / 2, 0),
          d,
        });
      }
    }

    /**
     * Re-deal a segment's walls.
     *
     * Only every other segment gets anything, only about half of each one's
     * slots are taken, and each slot that is taken is a coin flip between an
     * image and a block of colour. Three rolls of the dice, which is what
     * stops the tunnel reading as wallpaper.
     *
     * Nothing is created or destroyed here — the meshes already exist, and
     * this only points them at a different shared material.
     */
    function populate(group: THREE.Group) {
      // Every other ROW of cells takes slabs, not every other segment. A
      // segment is depthCells rows deep now, so alternating by segment
      // laid down that many solid rows and then that many empty ones —
      // which is what read as batches. The counter advances by the rows a
      // segment holds, so the stripe carries on unbroken across the join.
      const baseRow = populateIndex;
      populateIndex += depthCells;
      const slabs = group.userData.slabs as THREE.Mesh[];

      for (let i = 0; i < slabs.length; i++) {
        const slab = slabs[i];
        // Populate most slots (80% chance) so the tunnel feels rich and full of art
        if (Math.random() > 0.8) {
          slab.visible = false;
          continue;
        }
        slab.visible = true;
        // Heavily favor posters (80% of slabs show posters, 20% dark accent slabs)
        if (imageMats.length > 0 && Math.random() < 0.8) {
          slab.material = imageMats[imageIndex % imageMats.length];
          imageIndex++;
        } else {
          slab.material = colorMats[(5 * colorIndex) % colorMats.length];
          colorIndex++;
        }
      }
    }

    function createSegment(z: number) {
      const group = new THREE.Group();
      group.position.z = z;

      // A hoop at every cell boundary down the segment, so the lines read
      // as squares rather than long corridors. The rails are not here —
      // they are one lattice for the whole tunnel.
      for (let d = 0; d < depthCells; d++) {
        const z = -d * cellDepth;
        group.add(tube(geoTubeX, -hw, -hh, z));
        group.add(tube(geoTubeX, -hw, hh, z));
        group.add(tube(geoTubeY, -hw, -hh, z));
        group.add(tube(geoTubeY, hw, -hh, z));
      }

      // The slab pool: one mesh per slot, for the life of the component.
      const slabs: THREE.Mesh[] = SLOTS.map((slot) => {
        const m = new THREE.Mesh(slot.geo, colorMats[0]);
        m.position.copy(slot.pos);
        m.rotation.copy(slot.rot);
        m.visible = false;
        group.add(m);
        return m;
      });
      group.userData.slabs = slabs;

      populate(group);
      return group;
    }

    // The rails are straight lines down the tunnel, so they look identical
    // wherever they sit along z. One set covering the whole run, slid to
    // follow the camera, replaces the (cols + rows) × segCount copies that
    // used to be rebuilt into every segment — the single biggest chunk of
    // draw calls in the scene, and most of what made this choppy once the
    // cells went square and the segment count went up.
    const rails = new THREE.Group();
    for (let i = 0; i <= cols; i++) {
      const x = -hw + i * colW;
      rails.add(tube(geoTubeZ, x, -hh));
      rails.add(tube(geoTubeZ, x, hh));
    }
    for (let i = 1; i < rows; i++) {
      const y = -hh + i * rowH;
      rails.add(tube(geoTubeZ, -hw, y));
      rails.add(tube(geoTubeZ, hw, y));
    }
    scene.add(rails);

    const segments: THREE.Group[] = [];
    for (let i = 0; i < segCount; i++) {
      const g = createSegment(-i * segDepth);
      scene.add(g);
      segments.push(g);
    }

    const resize = () => {
      // clientWidth, not a bounding rect: the Framer canvas draws inside a
      // zoom transform, and a rect reports those scaled pixels.
      const w = Math.max(1, frame.clientWidth);
      const h = Math.max(1, frame.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(frame);
    resize();

    // Driven off its own velocity, mouse tilt, and wheel scroll.
    let scrollPos = 0;
    let scrollBoost = 0;
    let targetCamX = 0;
    let targetCamY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let raf = 0;
    let last = 0;

    const animate = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(animate);
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;

      const cfg = cfgRef.current;
      // Wheel boost decay
      scrollBoost *= 0.92;
      if (Math.abs(scrollBoost) < 0.01) scrollBoost = 0;

      // Press to go faster or scroll to accelerate
      scrollPos += (pressed ? cfg.boost : cfg.speed) + scrollBoost;

      const want = -SCROLL_TO_Z * scrollPos;
      camera.position.z += CAMERA_CHASE * (want - camera.position.z);

      // Camera gently follows / tilts toward the cursor
      camera.position.x += 0.08 * (targetCamX - camera.position.x);
      camera.position.y += 0.08 * (targetCamY - camera.position.y);
      camera.rotation.y += 0.08 * (targetRotY - camera.rotation.y);
      camera.rotation.x += 0.08 * (targetRotX - camera.rotation.x);

      // Uniform along z, so this never seams — it just has to stay in
      // front of the camera.
      rails.position.z = camera.position.z;

      // Recycle: any segment that falls behind the camera jumps to the far
      // end of the tunnel and is repapered, so the run never ends.
      const span = segCount * segDepth;
      const z = camera.position.z;
      for (const seg of segments) {
        if (seg.position.z > z + segDepth) {
          let min = 0;
          for (const s of segments) min = Math.min(min, s.position.z);
          seg.position.z = min - segDepth;
          populate(seg);
        } else if (seg.position.z < z - span - segDepth) {
          let max = -999999;
          for (const s of segments) max = Math.max(max, s.position.z);
          seg.position.z = max + segDepth;
          populate(seg);
        }
      }

      for (let i = fading.length - 1; i >= 0; i--) {
        const m = fading[i];
        m.opacity = Math.min(1, m.opacity + dt / FADE_IN);
        if (m.opacity >= 1) fading.splice(i, 1);
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    // ── Pointer & Interactive Controls ──────────────────────────────
    const onMove = (e: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetCamX = nx * 0.35;
        targetCamY = ny * 0.25;
        targetRotY = -nx * 0.18;
        targetRotX = ny * 0.14;
      }
      const el = cursorRef.current;
      if (!el) return;
      const sx = rect.width > 0 ? frame.clientWidth / rect.width : 1;
      const sy = rect.height > 0 ? frame.clientHeight / rect.height : 1;
      el.style.left = `${(e.clientX - rect.left) * sx}px`;
      el.style.top = `${(e.clientY - rect.top) * sy}px`;
    };
    const onEnter = () => {
      const el = cursorRef.current;
      if (el) el.style.opacity = "1";
    };
    const onLeave = () => {
      pressed = false;
      targetCamX = 0;
      targetCamY = 0;
      targetRotX = 0;
      targetRotY = 0;
      const el = cursorRef.current;
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translate(0%, -100%) scale(1)";
      }
    };
    const onDown = () => {
      pressed = true;
      const el = cursorRef.current;
      if (el) el.style.transform = "translate(0%, -100%) scale(0.85)";
    };
    const onUp = () => {
      pressed = false;
      const el = cursorRef.current;
      if (el) el.style.transform = "translate(0%, -100%) scale(1)";
    };
    const onWheel = (e: WheelEvent) => {
      // Smooth, gentle acceleration when user scrolls down (not rushing away)
      const intensity = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY) * 0.012, 0.6);
      scrollBoost += intensity > 0 ? intensity : intensity * 0.2;
    };

    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerenter", onEnter);
    frame.addEventListener("pointerleave", onLeave);
    frame.addEventListener("pointerdown", onDown);
    frame.addEventListener("wheel", onWheel, { passive: true });
    // On the window, not the frame: releasing outside it would otherwise
    // leave the tunnel stuck at full speed forever.
    window.addEventListener("pointerup", onUp);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerenter", onEnter);
      frame.removeEventListener("pointerleave", onLeave);
      frame.removeEventListener("pointerdown", onDown);
      frame.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointerup", onUp);

      // Every mesh shares one of these, so they are disposed by name and
      // exactly once. Walking the scene would hand the same geometry to
      // dispose() hundreds of times over.
      geoFloor.dispose();
      geoWall.dispose();
      geoTubeZ.dispose();
      geoTubeX.dispose();
      geoTubeY.dispose();
      for (const m of colorMats) m.dispose();
      for (const m of imageMats) {
        m.map?.dispose();
        m.dispose();
      }
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [slideKey, palette, background, lineColor, lineOpacity, grid, cellMode, tunnelSize, fade]);

  return (
    <div
      ref={frameRef}
      style={{
        ...style,
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: label ? "none" : "default",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
      {label && (
        <div
          ref={cursorRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            // Sits above and to the right of the pointer, as it did.
            transform: "translate(0%, -100%) scale(1)",
            pointerEvents: "none",
            opacity: 0,
            background: labelFill,
            borderRadius: 9999,
            padding: "10px 20px",
            transition: "transform 0.1s ease, opacity 0.2s ease",
            whiteSpace: "nowrap",
            userSelect: "none",
            ...labelFont,
            color: labelColor,
          }}
        >
          {labelText}
        </div>
      )}
    </div>
  );
}

ImageBox.displayName = "Image Box";
