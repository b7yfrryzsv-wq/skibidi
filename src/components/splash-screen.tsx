"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Logo } from "@/components/logo";

/**
 * `true` once the splash has started fading out — the hero waits on this so
 * its entrance plays as the overlay clears instead of behind it.
 */
const AppReadyContext = createContext(true);

export function useAppReady() {
  return useContext(AppReadyContext);
}

/** Keep the logo on screen at least this long, however fast assets load. */
const MIN_VISIBLE_MS = 900;

export function SplashScreen({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const hasFinished = useRef(false);

  useEffect(() => {
    const started = performance.now();
    let cancelled = false;
    let timeoutId: number | undefined;

    const finish = () => {
      if (hasFinished.current || cancelled) return;
      hasFinished.current = true;
      setVisible(false);
      setReady(true);
    };

    const onLoad = () => {
      const remaining = MIN_VISIBLE_MS - (performance.now() - started);
      timeoutId = window.setTimeout(finish, Math.max(0, remaining));
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // Nothing behind the overlay should scroll while it is up.
  useEffect(() => {
    document.body.dataset.splash = visible ? "visible" : "hidden";

    if (visible) {
      lenis?.stop();
    } else {
      // The body sat at `overflow: hidden` for the whole splash, so Lenis's
      // cached page height is from before the real layout settled. Handing
      // scrolling back without remeasuring is what made the first scroll jump
      // to a stale offset — the "teleport".
      lenis?.resize();
      lenis?.start();
    }

    return () => {
      delete document.body.dataset.splash;
      lenis?.start();
    };
  }, [visible, lenis]);

  return (
    <AppReadyContext.Provider value={ready}>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            key="splash"
            data-splash-overlay=""
            className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-9 bg-white"
            initial={{ opacity: 1 }}
            // M3 emphasized, matching the rest of the page's motion.
            exit={{
              opacity: 0,
              transition: { duration: 0.6, ease: [0.2, 0, 0, 1] },
            }}
            role="status"
            aria-live="polite"
            aria-label="Chargement en cours"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Logo priority className="h-14 w-auto sm:h-16" />
            </motion.div>

            {/* M3 indeterminate linear progress — see globals.css. */}
            <div className="m3-linear-progress w-56 max-w-[70vw]" aria-hidden>
              <div className="m3-lp-bar m3-lp-primary">
                <div className="m3-lp-bar-inner" />
              </div>
              <div className="m3-lp-bar m3-lp-secondary">
                <div className="m3-lp-bar-inner" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Without JavaScript the overlay would never clear itself. */}
      <noscript>
        <style>{`[data-splash-overlay] { display: none !important; }`}</style>
      </noscript>
    </AppReadyContext.Provider>
  );
}
