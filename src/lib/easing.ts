/**
 * CSS `cubic-bezier()` evaluated in JavaScript.
 *
 * The Material 3 motion tokens are published as CSS easing curves, but Lenis
 * wants a plain `(t) => progress` function. Rather than eyeballing a lookalike
 * (an ease-out-quint is close but arrives noticeably earlier), this solves the
 * real curve so scripted scrolling and CSS transitions share one feel.
 */

/**
 * A cubic Bézier with fixed endpoints at (0,0) and (1,1) reduces to a
 * polynomial in the control points, which is what these coefficients hold.
 */
function bezier(t: number, a: number, b: number) {
  const c = 3 * a;
  const d = 3 * (b - a) - c;
  const e = 1 - c - d;
  return ((e * t + d) * t + c) * t;
}

function slope(t: number, a: number, b: number) {
  const c = 3 * a;
  const d = 3 * (b - a) - c;
  const e = 1 - c - d;
  return (3 * e * t + 2 * d) * t + c;
}

/**
 * Builds an easing function from the same four numbers CSS takes.
 *
 * `x` and `t` are not the same parameter: the curve is defined against its own
 * parameter, so the x (time) component has to be inverted before the y
 * (progress) component can be read off. Newton–Raphson converges in a handful
 * of steps here because the x component is monotonic for valid control points.
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return (time: number) => {
    if (time <= 0) return 0;
    if (time >= 1) return 1;

    let t = time;
    for (let i = 0; i < 8; i++) {
      const x = bezier(t, x1, x2) - time;
      if (Math.abs(x) < 1e-5) break;

      const dx = slope(t, x1, x2);
      // A flat tangent would send the next guess off to infinity.
      if (Math.abs(dx) < 1e-6) break;
      t -= x / dx;
    }

    return bezier(t, y1, y2);
  };
}

/**
 * `md.sys.motion.easing.emphasized` — the curve Google uses for its own
 * product pages. Kept in sync with the CSS token of the same name.
 */
export const emphasized = cubicBezier(0.2, 0, 0, 1);
