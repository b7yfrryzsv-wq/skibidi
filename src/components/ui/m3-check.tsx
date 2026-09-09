import { cn } from "@/lib/utils";

/**
 * The Material 3 checkmark.
 *
 * Google does not ship this as a path — `md-checkbox` draws it from two
 * rectangles so the two arms can animate in independently, and the shape only
 * exists once the component's transforms are applied. This mirrors that
 * construction exactly rather than tracing a lookalike, so the proportions
 * match a real M3 checkbox:
 *
 *   - an 18×18 viewport and a 2dp stroke
 *   - arms of √32 and √128, the hypotenuses of the 4×4 and 8×8 right
 *     triangles the checkmark is built from
 *   - `scale(1,-1) translate(7,-14) rotate(45)`, which lands the corner the
 *     two arms share at the bottom point of the mark
 *
 * Geometry taken from `@material/web/checkbox/internal/_checkbox.scss`.
 */
export function M3Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="currentColor"
      aria-hidden
      className={cn("size-4 shrink-0", className)}
    >
      <g transform="scale(1,-1) translate(7,-14) rotate(45)">
        {/* Short arm, then long arm — the two strokes meet at the origin. */}
        <rect width="2" height="5.657" />
        <rect width="11.314" height="2" />
      </g>
    </svg>
  );
}
