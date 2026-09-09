"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useMemo } from "react";
import { BanknoteCheck, CircleEuro } from "lucide-react";
import Image from "next/image";

import { CtaButton } from "@/components/cta-button";
import { M3Check } from "@/components/ui/m3-check";
import { useAppReady } from "@/components/splash-screen";

/** Each point carries its own outline icon rather than a repeated checkmark. */
const TRUST_POINTS = [
  { label: "Aucune avance de frais", icon: CircleEuro },
  { label: "Chèque à encaisser directement", icon: BanknoteCheck },
];

/**
 * `useReducedMotion` reports `false` on the very first render and only settles
 * afterwards, so the variants have to stay wired up in both cases: swapping
 * them out would strand whatever inline style the first render already wrote.
 * Instead the hidden state collapses onto the visible one.
 *
 * Reduced motion removes the travel and shortens the timing, but it must still
 * start from `opacity: 0`. Collapsing `hidden` all the way onto `visible` left
 * nothing to play, so the section simply existed the moment it mounted.
 */
function useHeroVariants(reduceMotion: boolean) {
  return useMemo(() => {
    const container: Variants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: reduceMotion ? 0.04 : 0.09,
          delayChildren: reduceMotion ? 0.05 : 0.1,
        },
      },
    };

    const item: Variants = {
      hidden: { opacity: 0, y: reduceMotion ? 0 : 28 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduceMotion ? 0.25 : 0.7,
          // M3 emphasized, matching the rest of the page.
          ease: [0.2, 0, 0, 1],
        },
      },
    };

    return { container, item };
  }, [reduceMotion]);
}

export function Hero() {
  const ready = useAppReady();
  const reduceMotion = Boolean(useReducedMotion());
  const { container, item } = useHeroVariants(reduceMotion);
  // Gated purely on the splash clearing. This used to be `ready || reduceMotion`,
  // which meant that with reduced motion on the hero played immediately —
  // finishing while the overlay was still fully opaque, so the content was
  // simply *there* when the white lifted instead of arriving.
  const play = ready;

  return (
    // `overflow-x-clip` rather than `overflow-hidden`: the wash below is taller
    // than this section and sits partly above it, so clipping both axes sliced
    // it flat against the section's top edge and drew a hard line under the
    // header. Clipping only the x axis still contains the offset badge on the
    // image (no sideways scroll) while letting the wash fade out naturally
    // behind the transparent header.
    <section id="top" className="relative overflow-x-clip">
      {/* Soft emerald wash behind the fold. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-72 h-[640px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(16,185,129,0.16),rgba(16,185,129,0)_70%)]"
      />

      <motion.div
        suppressHydrationWarning
        variants={container}
        initial="hidden"
        animate={play ? "visible" : "hidden"}
        className="relative mx-auto grid w-full max-w-6xl gap-14 px-5 pt-12 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-16 lg:pb-28"
      >
        <div className="flex flex-col items-start">
          <motion.span
            suppressHydrationWarning
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700"
          >
            <M3Check className="size-3.5" />
            Simulation gratuite · Réponse en 2 minutes
          </motion.span>

          <motion.h1
            suppressHydrationWarning
            variants={item}
            className="mt-6 text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-balance text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            Un chèque énergie de{" "}
            <span className="whitespace-nowrap text-primary">457 €</span>{" "}
            vous attend
          </motion.h1>

          <motion.p
            suppressHydrationWarning
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-neutral-600"
          >
            Vérifiez en moins de deux minutes si votre logement ouvre droit à
            l’aide énergie. Vous n’avancez pas un euro : le chèque est établi à
            votre nom et s’encaisse directement sur votre compte.
          </motion.p>

          <motion.div
            suppressHydrationWarning
            variants={item}
            className="mt-9 w-full sm:w-auto"
          >
            <CtaButton
              href="/eligibilite"
              size="lg"
              className="w-full text-base sm:w-auto"
            >
              Réclamez mon chèque
            </CtaButton>
          </motion.div>

          <motion.ul
            suppressHydrationWarning
            variants={item}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-7"
          >
            {TRUST_POINTS.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-[0.95rem] font-medium text-neutral-700"
              >
                <Icon
                  className="size-[1.15rem] shrink-0 text-neutral-500"
                  strokeWidth={1.8}
                />
                {label}
              </li>
            ))}
          </motion.ul>

          <motion.p
            suppressHydrationWarning
            variants={item}
            className="mt-5 max-w-md text-xs leading-relaxed text-neutral-400"
          >
            Montant maximum indicatif. L’éligibilité et le montant dépendent de
            vos revenus, de votre logement et de la composition de votre foyer.
          </motion.p>
        </div>

        <motion.div
          suppressHydrationWarning
          variants={item}
          className="relative mx-auto w-full max-w-[440px] sm:max-w-[500px] lg:mr-0 lg:ml-auto lg:max-w-[540px]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200/80 bg-neutral-100 shadow-lift">
            <Image
              src="/brand/ville-durable.png"
              alt="Résidence contemporaine et jardins paysagers au coucher du soleil"
              width={768}
              height={768}
              priority
              sizes="(min-width: 1024px) 540px, (min-width: 640px) 500px, 92vw"
              className="h-auto w-full"
            />
          </div>

          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl border border-neutral-200/80 bg-white/95 px-5 py-4 shadow-lift backdrop-blur-sm sm:-left-6"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <M3Check className="size-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold tracking-tight text-neutral-900">
                457 €
              </span>
              <span className="text-xs font-medium text-neutral-500">
                montant maximum 2026
              </span>
            </span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
