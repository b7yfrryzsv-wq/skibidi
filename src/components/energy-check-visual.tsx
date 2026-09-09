"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Euro, Leaf, Sparkles, Zap } from "lucide-react";

import { Logo } from "@/components/logo";

/**
 * Composed entirely from Lucide icons and rounded surfaces — no bitmap and no
 * hand-drawn artwork, so it stays crisp at any size and follows the theme.
 *
 * The two chips straddle the card's top and bottom edges only. Anything
 * floating over its left or right edge would sit on top of the copy once the
 * column narrows, so those positions are deliberately left empty.
 */
export function EnergyCheckVisual() {
  const reduceMotion = useReducedMotion();
  const float = (delay: number) =>
    reduceMotion
      ? {}
      : {
          animate: { y: [0, -7, 0] },
          transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay,
          },
        };

  return (
    <div className="relative mx-auto w-full max-w-[420px] py-7 sm:max-w-[440px]">
      {/* Soft rounded backdrop. */}
      <div
        aria-hidden
        className="absolute inset-x-2 inset-y-0 rounded-[2.25rem] bg-gradient-to-br from-emerald-50 via-white to-orange-50"
      />
      <div
        aria-hidden
        className="absolute -top-4 right-6 size-28 rounded-full bg-emerald-100/60 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-2 left-4 size-24 rounded-full bg-orange-100/60 blur-2xl"
      />

      <motion.div
        {...float(0)}
        className="absolute top-0 right-3 z-10 flex items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-3.5 py-2.5 shadow-soft sm:right-5"
      >
        <Zap className="size-4 shrink-0 text-brand-orange" strokeWidth={2.2} />
        <span className="text-xs font-semibold text-neutral-800">
          Facture allégée
        </span>
      </motion.div>

      <motion.div
        {...float(1.4)}
        className="relative rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-lift sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <Logo className="h-7 w-auto sm:h-7" />
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] font-semibold text-emerald-700">
            Estimation
          </span>
        </div>

        <p className="mt-7 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
          Chèque énergie
        </p>

        <p className="mt-1.5 flex items-baseline gap-1.5 text-5xl font-extrabold tracking-tight text-neutral-900 tabular-nums">
          457
          <Euro className="size-7 text-primary" strokeWidth={2.5} />
        </p>

        <p className="mt-3 flex items-center gap-2 text-[0.8rem] font-medium text-neutral-600">
          <Leaf className="size-4 shrink-0 text-emerald-600" strokeWidth={2.2} />
          Pour un logement plus sobre
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-5">
          <div>
            <dt className="text-[0.7rem] font-medium text-neutral-500">
              Reste à charge
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-neutral-900">0 €</dd>
          </div>
          <div>
            <dt className="text-[0.7rem] font-medium text-neutral-500">
              Délai moyen
            </dt>
            <dd className="mt-0.5 text-sm font-bold text-neutral-900">
              Quelques semaines
            </dd>
          </div>
        </dl>
      </motion.div>

      <motion.div
        {...float(2.6)}
        className="absolute bottom-0 left-3 z-10 flex items-center gap-2 rounded-2xl border border-neutral-200/80 bg-white px-3.5 py-2.5 shadow-soft sm:left-5"
      >
        <Sparkles
          className="size-4 shrink-0 text-brand-navy"
          strokeWidth={2.2}
        />
        <span className="text-xs font-semibold text-neutral-800">
          Sans démarche compliquée
        </span>
      </motion.div>
    </div>
  );
}
