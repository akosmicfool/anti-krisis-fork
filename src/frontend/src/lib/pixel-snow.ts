/**
 * Pixel Snow — app background engine (adopted from variation D:
 * "hybrid fall + eased drift", the owner-selected winner).
 *
 * Vanilla canvas 2D, zero dependencies. The whole scene is drawn into a
 * low-resolution buffer and blitted upscaled with nearest-neighbour, so
 * every glyph is a hard-edged pixel shape. The engine renders onto a
 * transparent layer so the app's own background token shows through.
 *
 * Motion: two velocity layers per flake —
 *   1. ballistic (gravity + per-flake quadratic air drag -> terminal
 *      speeds with a slow tail of nearly-hanging flakes, plus slow sway)
 *   2. drift (react-bits-style eased breeze: velocity eases toward the
 *      per-flake sine swing target)
 * blended ~78/22 so gravity clearly dominates.
 *
 * Cursor: the app's native cursor is used as-is (never hidden, nothing
 * drawn). Flakes within 120px are gently brushed aside by radial
 * repulsion plus a wake carry, scaled by a transient push scalar that
 * decays to zero when the pointer is still. Nothing accumulates
 * anywhere, ever.
 *
 * The options mirror the react-bits PixelSnow prop set the owner tuned
 * (color #10B981, variant snowflake, density 0.25, speed 1, wind 0,
 * flakeSize 1, pixelSize 2, glow 0.8, mouseInteraction true, sway 1,
 * fade 0.1) plus maxSizeScale (owner: largest particles ~20% smaller).
 */

export interface PixelSnowOptions {
  /** flake color, hex (default #10B981) */
  color?: string;
  /** 3-tone palette, far -> near tiers (variation D look); overrides color */
  palette?: string[];
  /** 0..1 -> flake count (0.25 reproduces the approved sparse field) */
  density?: number;
  /** global fall speed multiplier (1 = tuned) */
  speed?: number;
  /** -2..2 lateral gust scale (0 = calm, no sideways wind) */
  wind?: number;
  /** sway amplitude multiplier (1 = tuned) */
  sway?: number;
  /** 0..2 size bias: <1 smaller glyphs, >1 larger (1 = tuned) */
  flakeSize?: number;
  /** CSS px per buffer pixel (1..12) — 2 gives the fine pixel look */
  pixelSize?: number;
  /** 0..1 soft bloom strength around the field */
  glow?: number;
  /** brush-aside interaction (default true) */
  mouseInteraction?: boolean;
  /** 0..1 edge fade of the snow toward the canvas borders (0.1) */
  fade?: number;
  /** 0..1 cap on the largest glyph (0.8 = max particles 20% smaller) */
  maxSizeScale?: number;
}

interface Flake {
  level: number;
  x: number;
  y: number;
  vt: number;
  g: number;
  k: number;
  bx: number;
  by: number;
  dx: number;
  dy: number;
  vx: number;
  vy: number;
  wresp: number;
  swf: number;
  swp: number;
  swa: number;
  drft: number;
  drp: number;
  swayAmp: number;
  ci: number;
  col: string;
  pat: number[];
}

const LAYERS = 5;
/* size-level weighting (react-bits): mostly tiny flakes */
const LEVEL_W = [0.46, 0.27, 0.15, 0.08, 0.04];
/* fall-speed tier per level, px/s */
const TIER_VT = [16, 24, 34, 48, 66];
const PARALLAX = [0.55, 0.75, 0.95, 1.15, 1.35];

const GRAV = 260; // px/s^2 at the mid tier
const MAX_V = 900;
const BALLISTIC_MIX = 0.78;
const DRIFT_MIX = 0.22;
const DRIFT_EASE = 2.2;
const SWING_BASE = 6;
const SWING_PER_LEVEL = 7;
const PUSH_RADIUS = 120;

/* snowflake-family glyphs (owner: variant = snowflake), as [dx, dy] pairs */
const G_DOT = [0, 0];
const G_X = [0, 0, -1, -1, 1, -1, -1, 1, 1, 1];
const G_DEN = [
  0, -2, 0, -1, 0, 0, 0, 1, 0, 2, -1, 0, 1, 0, -2, -1, 2, -1, -2, 1, 2, 1,
];
/* trimmed dendrite for the largest level (maxSizeScale < 1) */
const G_DEN_S = [0, -1, 0, 0, 0, 1, -1, 0, 1, 0, -1, -1, 1, -1, -1, 1, 1, 1];
const G_2X2 = [0, 0, 1, 0, 0, 1, 1, 1];
const G_RND = [0, 0, 1, 0, -1, 0, 0, 1, 0, -1];
const G_SQ3 = [0, 0, 1, 0, 2, 0, 0, 1, 1, 1, 2, 1, 0, 2, 1, 2, 2, 2];

/* per-level glyph mix (owner: mixed glyphs, as in variation D) */
const MIX: Array<Array<{ g: number[]; w: number }>> = [
  [
    { g: G_DOT, w: 0.7 },
    { g: G_2X2, w: 0.3 },
  ],
  [
    { g: G_2X2, w: 0.4 },
    { g: G_RND, w: 0.4 },
    { g: G_DOT, w: 0.2 },
  ],
  [
    { g: G_RND, w: 0.35 },
    { g: G_X, w: 0.25 },
    { g: G_2X2, w: 0.2 },
    { g: G_SQ3, w: 0.1 },
    { g: G_DEN, w: 0.1 },
  ],
  [
    { g: G_X, w: 0.3 },
    { g: G_DEN, w: 0.3 },
    { g: G_RND, w: 0.15 },
    { g: G_SQ3, w: 0.15 },
    { g: G_2X2, w: 0.1 },
  ],
  [
    { g: G_DEN, w: 0.35 },
    { g: G_X, w: 0.25 },
    { g: G_SQ3, w: 0.2 },
    { g: G_RND, w: 0.1 },
    { g: G_2X2, w: 0.1 },
  ],
];

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export interface PixelSnowHandle {
  destroy: () => void;
  setPalette: (palette: string[]) => void;
}

const NOOP_HANDLE: PixelSnowHandle = {
  destroy: () => {},
  setPalette: () => {},
};

export function mountPixelSnow(
  canvas: HTMLCanvasElement,
  options: PixelSnowOptions = {},
): PixelSnowHandle {
  let paletteRgb = (options.palette ?? []).map(hexToRgb);
  const color = paletteRgb[0] ?? hexToRgb(options.color ?? "#10B981");
  const density = Math.max(0, Math.min(1, options.density ?? 0.25));
  const speedScale = options.speed ?? 1;
  const windScale = options.wind ?? 0;
  const swayScale = options.sway ?? 1;
  const sizeBias = Math.max(0, Math.min(2, options.flakeSize ?? 1));
  const PX = Math.max(1, Math.min(12, Math.round(options.pixelSize ?? 2)));
  const glow = Math.max(0, options.glow ?? 0.8);
  const mouseInteraction = options.mouseInteraction ?? true;
  const fade = Math.max(0, Math.min(1, options.fade ?? 0.1));
  const maxSizeScale = Math.max(0, Math.min(1, options.maxSizeScale ?? 0.8));

  /* Linear in density so a density change is a proportional flake-count
     change (the old 60 + density*336 curve had a floor that made small
     reductions under-deliver). 0.25 -> 144 flakes, the approved field.
     0.1875 -> 108 (-25%). The count never changed with the uniform-spawn
     fix: that fix stopped the initial field packing into the top-left
     corner, so the SAME 144 flakes now spread over the whole viewport and
     read denser than the old clumped fill. */
  const NF = Math.max(24, Math.round(density * 576));

  const ctxOrNull = canvas.getContext("2d");
  if (!ctxOrNull) return NOOP_HANDLE;
  const ctx: CanvasRenderingContext2D = ctxOrNull;
  const buf = document.createElement("canvas");
  const bgOrNull = buf.getContext("2d");
  if (!bgOrNull) return NOOP_HANDLE;
  const bg: CanvasRenderingContext2D = bgOrNull;

  /* Measured from the start: spawnFlake scatters x over the canvas width
     (and y over the whole height) for the initial fill, so the 1px
     placeholders used to pack the whole first field into the top-left
     corner until flakes began respawning across the width. resize()
     recomputes the same values below. */
  let W = Math.max(1, canvas.clientWidth || window.innerWidth);
  let H = Math.max(1, canvas.clientHeight || window.innerHeight);
  let BW = 1;
  let BH = 1;

  /* colour table: depth tiers, ordered far -> near so drawing in table
     order is also a depth order. Transparent layer: dimming is alpha.
     3-tone tiering (variation D): far levels take the darkest tone. */
  const toneFor = (L: number): [number, number, number] => {
    if (paletteRgb.length < 2) return color;
    if (paletteRgb.length === 2) return L <= 2 ? paletteRgb[0] : paletteRgb[1];
    return L <= 1 ? paletteRgb[0] : L <= 3 ? paletteRgb[1] : paletteRgb[2];
  };
  const COLORS: string[] = [];
  function buildColors() {
    COLORS.length = 0;
    for (let L = 0; L < LAYERS; L++) {
      const tone = toneFor(L);
      const alpha = 0.38 + 0.155 * L;
      for (let j = 0; j < 4; j++) {
        const k = alpha * (0.9 + 0.055 * j);
        COLORS.push(`rgba(${tone[0]},${tone[1]},${tone[2]},${k.toFixed(3)})`);
      }
    }
  }
  buildColors();

  function pickGlyph(L: number): number[] {
    const mix = MIX[L];
    let r = Math.random();
    let acc = 0;
    for (const entry of mix) {
      acc += entry.w;
      if (r <= acc) {
        return entry.g === G_DEN && maxSizeScale < 0.95 ? G_DEN_S : entry.g;
      }
    }
    return mix[0].g;
  }

  function levelForIndex(i: number, n: number): number {
    const r = (i + 0.5) / n;
    let acc = 0;
    for (let L = 0; L < LAYERS; L++) {
      acc += LEVEL_W[L];
      if (r <= acc) return L;
    }
    return LAYERS - 1;
  }

  function spawnFlake(L: number, anywhere: boolean): Flake {
    const vt = Math.max(
      8,
      Math.min(
        60,
        TIER_VT[L] * speedScale * (0.45 + 0.85 * Math.random() ** 1.8),
      ),
    );
    const g = GRAV * (vt / 34) ** 1.5;
    const f: Flake = {
      level: L,
      x: rand(-40, W + 40),
      y: anywhere ? rand(-60, H) : rand(-60, -10),
      vt,
      g,
      k: g / (vt * vt),
      bx: 0,
      by: rand(vt * 0.3, vt * 0.6),
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
      wresp: rand(0.85, 1.15),
      swf: rand(0.2, 0.7),
      swp: rand(0, Math.PI * 2),
      swa: rand(9, 20) * (0.6 + 0.4 * PARALLAX[L]) * swayScale,
      drft: rand(0.25, 0.85),
      drp: rand(0, Math.PI * 2),
      swayAmp: rand(0.6, 1.4) * swayScale,
      ci: L * 4 + ((Math.random() * 4) | 0),
      col: COLORS[L * 4 + ((Math.random() * 4) | 0)],
      pat: pickGlyph(L),
    };
    return f;
  }

  /* size bias: shift the level mix toward smaller/larger glyphs */
  const flakes: Flake[] = [];
  for (let i = 0; i < NF; i++) {
    let L = levelForIndex(i, NF);
    if (sizeBias < 1 && Math.random() > sizeBias) L = Math.max(0, L - 1);
    else if (sizeBias > 1 && Math.random() < sizeBias - 1)
      L = Math.min(LAYERS - 1, L + 1);
    flakes.push(spawnFlake(L, true));
  }
  flakes.sort((a, b) => a.ci - b.ci);

  /* ---- pointer: native cursor, subtle brush-aside ------------------ */
  const pointer = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    active: false,
    rect: null as DOMRect | null,
    t: 0,
  };
  let push = 0;

  function updateRect() {
    pointer.rect = canvas.getBoundingClientRect();
  }

  function onMove(ev: PointerEvent) {
    const r = pointer.rect;
    if (!r || !r.width) return;
    const x = (ev.clientX - r.left) * (W / r.width);
    const y = (ev.clientY - r.top) * (H / r.height);
    const now = performance.now();
    const h = Math.max(0.004, (now - pointer.t) / 1000);
    pointer.t = now;
    if (pointer.active) {
      const nvx = Math.max(-4000, Math.min(4000, (x - pointer.x) / h));
      const nvy = Math.max(-4000, Math.min(4000, (y - pointer.y) / h));
      pointer.vx = pointer.vx * 0.6 + nvx * 0.4;
      pointer.vy = pointer.vy * 0.6 + nvy * 0.4;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
  }

  function onLeave() {
    pointer.active = false;
    pointer.vx = 0;
    pointer.vy = 0;
    push = 0;
  }

  /* ---- sizing ------------------------------------------------------ */
  function resize() {
    const w = Math.max(1, canvas.clientWidth || window.innerWidth);
    const h = Math.max(1, canvas.clientHeight || window.innerHeight);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = w;
    H = h;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    BW = Math.max(1, Math.ceil(w / PX));
    BH = Math.max(1, Math.ceil(h / PX));
    buf.width = BW;
    buf.height = BH;
    updateRect();
  }

  /* ---- physics ----------------------------------------------------- */
  let time = 0;

  function easeDrift(dt: number) {
    const ease = 1 - Math.exp(-dt * DRIFT_EASE);
    /* slow pulsing lateral gust (owner config wind = 0 keeps this at 0) */
    const g1 = Math.max(0, Math.sin(time * 0.061 + 0.7)) ** 3 * 0.34;
    const g2 = Math.max(0, Math.sin(time * 0.0235 + 2.9)) ** 2 * 0.5;
    const gx = 46 * (0.24 + g1 + g2) * windScale;
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      const p = PARALLAX[f.level];
      const swing =
        Math.sin(time * f.drft + f.drp) *
        f.swayAmp *
        (SWING_BASE + f.level * SWING_PER_LEVEL);
      /* sway is independent of the wind knob: wind=0 still sways */
      const tx = gx * p * f.wresp + swing;
      const ty = 0;
      f.dx += (tx - f.dx) * ease;
      f.dy += (ty - f.dy) * ease;
    }
  }

  function brushAside(dt: number) {
    if (!mouseInteraction || !pointer.active || push < 0.02) return;
    const r2 = PUSH_RADIUS * PUSH_RADIUS;
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      const dx = f.x - pointer.x;
      const dy = f.y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) continue;
      const d = Math.sqrt(d2) || 1e-6;
      const near = 1 - d / PUSH_RADIUS;
      const n3 = near * near * near;
      const n2 = near * near;
      const inv = 1 / d;
      f.bx +=
        dx * inv * n3 * push * 1500 * dt + pointer.vx * n2 * push * dt * 5;
      f.by +=
        dy * inv * n3 * push * 1500 * dt + pointer.vy * n2 * push * dt * 5;
      const sp2 = f.bx * f.bx + f.by * f.by;
      if (sp2 > MAX_V * MAX_V) {
        const s = MAX_V / Math.sqrt(sp2);
        f.bx *= s;
        f.by *= s;
      }
    }
  }

  function stepFlakes(h: number) {
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      f.by += f.g * h;
      f.bx += Math.sin(time * f.swf + f.swp) * f.swa * h;
      const bs = Math.sqrt(f.bx * f.bx + f.by * f.by) + 1e-6;
      const dk = f.k * bs * h;
      f.bx -= f.bx * dk;
      f.by -= f.by * dk;
      f.vx = BALLISTIC_MIX * f.bx + DRIFT_MIX * f.dx;
      f.vy = BALLISTIC_MIX * f.by + DRIFT_MIX * f.dy;
      f.x += f.vx * h;
      f.y += f.vy * h;
      if (f.x < -30) f.x += W + 60;
      else if (f.x > W + 30) f.x -= W + 60;
      if (f.y > H + 20 || f.y < -60) {
        f.y = -rand(10, 60);
        f.x = rand(-20, W + 20);
        f.bx = rand(-3, 3);
        f.by = rand(f.vt * 0.3, f.vt * 0.6);
      }
    }
  }

  function step(dt: number) {
    easeDrift(dt);
    brushAside(dt);
    const sub = Math.max(1, Math.min(8, Math.ceil(dt / (1 / 180))));
    const h = dt / sub;
    for (let s = 0; s < sub; s++) stepFlakes(h);
  }

  /* ---- render ------------------------------------------------------ */
  const drawGlyph = (f: Flake) => {
    const x = Math.round(f.x / PX);
    const y = Math.round(f.y / PX);
    const p = f.pat;
    for (let i = 0; i < p.length; i += 2) {
      bg.fillRect(x + p[i], y + p[i + 1], 1, 1);
    }
  };

  const render = () => {
    bg.clearRect(0, 0, BW, BH);
    let col: string | null = null;
    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];
      if (f.col !== col) {
        bg.fillStyle = col = f.col;
      }
      drawGlyph(f);
    }

    /* edge fade: erase toward the canvas borders (owner: fade = 0.1) */
    if (fade > 0) {
      const edge = Math.max(1, Math.round(BW * fade * 0.5));
      const edgeY = Math.max(1, Math.round(BH * fade * 0.5));
      bg.globalCompositeOperation = "destination-out";
      const gradients = [
        bg.createLinearGradient(0, 0, edge, 0), // left
        bg.createLinearGradient(BW, 0, BW - edge, 0), // right
        bg.createLinearGradient(0, 0, 0, edgeY), // top
        bg.createLinearGradient(0, BH, 0, BH - edgeY), // bottom
      ];
      const rects: Array<[number, number, number, number]> = [
        [0, 0, edge, BH],
        [BW - edge, 0, edge, BH],
        [0, 0, BW, edgeY],
        [0, BH - edgeY, BW, edgeY],
      ];
      for (let i = 0; i < 4; i++) {
        gradients[i].addColorStop(0, "rgba(0,0,0,1)");
        gradients[i].addColorStop(1, "rgba(0,0,0,0)");
        bg.fillStyle = gradients[i];
        bg.fillRect(rects[i][0], rects[i][1], rects[i][2], rects[i][3]);
      }
      bg.globalCompositeOperation = "source-over";
    }

    /* glow: one soft self-copy scaled up under the crisp blit */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;
    if (glow > 0) {
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = glow * 0.16;
      const gw = canvas.width * 1.04;
      const gh = canvas.height * 1.04;
      ctx.drawImage(
        buf,
        (canvas.width - gw) / 2,
        (canvas.height - gh) / 2,
        gw,
        gh,
      );
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.drawImage(buf, 0, 0, BW, BH, 0, 0, canvas.width, canvas.height);
  };

  /* ---- loop / reduced motion ---------------------------------------- */
  let last = 0;
  let raf = 0;

  function tick(now: number) {
    const raw = (now - last) / 1000;
    last = now;
    const dt = Math.min(0.05, Math.max(0, raw));
    time += dt;
    const dec = Math.exp(-dt * 6);
    pointer.vx *= dec;
    pointer.vy *= dec;
    const psp = Math.hypot(pointer.vx, pointer.vy);
    const pushTarget = Math.min(1, psp / 650);
    push += (pushTarget - push) * (1 - Math.exp(-dt * 5));
    step(dt);
    render();
    raf = requestAnimationFrame(tick);
  }

  function staticFrame() {
    const h = 1 / 120;
    for (let i = 0; i < 600; i++) {
      time += h;
      step(h);
    }
    render();
  }

  resize();
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (reduce?.matches) {
    staticFrame();
  } else {
    if (mouseInteraction) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", resize);
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }

  /* live palette swap (header toggle): rebuild the colour table and
     recolour every flake in place — no restart, no visual jump */
  function setPalette(palette: string[]) {
    paletteRgb = palette.map(hexToRgb);
    buildColors();
    for (const f of flakes) f.col = COLORS[f.ci];
  }

  return {
    destroy: () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
    },
    setPalette,
  };
}
