"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useState } from "react";

import { Logo } from "@/components/logo";
import { useAppReady } from "@/components/splash-screen";
import { CtaButton } from "@/components/cta-button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const reduceMotion = useReducedMotion();
  const ready = useAppReady();
  const [scrolled, setScrolled] = useState(false);

  // Lenis drives the scroll position, so read it from there when available.
  // Stable identity keeps `useLenis` from re-subscribing on every render.
  const onScroll = useCallback(
    (lenis: { scroll: number }) => setScrolled(lenis.scroll > 12),
    [],
  );
  useLenis(onScroll);

  // Fallback for the reduced-motion path, and correct on a restored scroll
  // position where no scroll event fires before first paint.
  useEffect(() => {
    const sync = () => setScrolled(window.scrollY > 12);

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);

  return (
    <motion.header
      suppressHydrationWarning
      // Reduced motion drops the slide but keeps the fade, so the header still
      // arrives with the rest of the page rather than being there already.
      initial={{ y: reduceMotion ? 0 : -80, opacity: 0 }}
      // Held back until the splash starts clearing, so it arrives on cue.
      animate={ready ? { y: 0, opacity: 1 } : undefined}
      transition={{
        duration: reduceMotion ? 0.25 : 0.6,
        delay: reduceMotion ? 0.05 : 0.1,
        ease: [0.2, 0, 0, 1],
      }}
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-neutral-200/70 bg-white/75 shadow-soft backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#top"
          className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
          aria-label="EDF — retour en haut de page"
        >
          <Logo priority />
        </a>

        <CtaButton href="/eligibilite" size="sm" className="px-5">
          <span className="hidden sm:inline">Réclamez mon chèque</span>
          <span className="sm:hidden">Mon chèque</span>
        </CtaButton>
      </div>
    </motion.header>
  );
}
