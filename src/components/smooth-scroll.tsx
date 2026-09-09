"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { emphasized } from "@/lib/easing";

/**
 * Lenis inertia scrolling for the whole document.
 *
 * The provider always stays mounted so `useLenis()` is available everywhere
 * (the splash screen uses it to lock scrolling).
 *
 * Reduced motion tightens the smoothing rather than switching it off. Cutting
 * it entirely is the usual reflex, but the preference is about motion the
 * visitor did not ask for — scrolling is direct manipulation, and a page that
 * lurches by a screen per wheel notch is not obviously the kinder outcome. A
 * higher `lerp` keeps the content glued to the input while still absorbing the
 * step, and scripted jumps get short enough to read as a cut.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        /*
         * Wheel smoothing, and *only* `lerp` — deliberately no top-level
         * `duration`/`easing`.
         *
         * Lenis picks its integrator as `if (duration && easing) … else if
         * (lerp)`, and it forwards all three to wheel scrolling too. So a
         * top-level duration made every wheel notch start a fresh 1.15s eased
         * animation, restarting on each event instead of tracking the input.
         * That is what felt laggy. With `lerp` alone it uses frame-rate
         * independent damping, which follows the wheel and settles quickly.
         */
        lerp: reduced ? 0.35 : 0.1,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.6,
        // Lenis defaults this to `true`, which hard-disables smoothing under
        // reduced motion: it pins `lerp` to 1 and makes scripted scrolls
        // instant, overriding everything above. We opt out and apply the
        // preference ourselves (the `reduced` branches) so it degrades to a
        // tighter scroll instead of vanishing.
        respectReducedMotion: false,
        /*
         * The M3 emphasized curve belongs here instead: anchor jumps are a
         * single scripted scroll, which is where a long weighted glide reads
         * as intentional rather than as lag. The offset clears the sticky
         * header.
         */
        anchors: {
          offset: -88,
          duration: reduced ? 0.4 : 1.15,
          easing: emphasized,
        },
      }}
    >
      {children}
    </ReactLenis>
  );
}
