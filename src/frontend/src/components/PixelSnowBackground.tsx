import { type PixelSnowHandle, mountPixelSnow } from "@/lib/pixel-snow";
import { useEffect, useRef } from "react";

/**
 * App-wide pixel snow background layer.
 *
 * Full-viewport canvas behind all content (-z-10 over the root's
 * bg-background, under normal flow), pointer-events none: the app's
 * native cursor drives the brush-aside through window-level listeners.
 *
 * Tuning: variation D (hybrid fall + eased drift) at the owner config —
 * 3-tone palette, mixed pixel glyphs, sparse field (Founding Engineer's
 * density 0.1875 tuning), no wind, pixelSize 2, glow 0.4, edge fade 0.1,
 * largest particles 20% smaller.
 *
 * The palette prop hot-swaps at runtime (header snow toggle): the engine
 * rebuilds its colour table and recolours the live field in place.
 */

/** 3-tone palettes, far -> near tiers (variation D tiering). */
export const SNOW_GREEN = ["#2fbf7a", "#5fd0a0", "#9cf7c4"];
export const SNOW_RED = ["#be2f37", "#d06065", "#f79ea0"];

export function PixelSnowBackground({ palette }: { palette: string[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const apiRef = useRef<PixelSnowHandle | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const api = mountPixelSnow(canvas, {
      palette: SNOW_GREEN,
      // 0.1875 -> 108 flakes, 25% below the approved 0.25 (144). The
      // uniform-spawn fix spread the same field over the full viewport
      // instead of clumping it top-left, which read as a density increase.
      density: 0.1875,
      speed: 1,
      wind: 0,
      sway: 1,
      flakeSize: 1,
      pixelSize: 2,
      glow: 0.4,
      mouseInteraction: true,
      fade: 0.1,
      maxSizeScale: 0.8,
    });
    apiRef.current = api;
    return () => {
      api.destroy();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setPalette(palette);
  }, [palette]);

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      aria-hidden="true"
      data-ocid="layout.pixel_snow_bg"
    >
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
