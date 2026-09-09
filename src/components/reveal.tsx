"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const TAGS = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  li: motion.li,
  p: motion.p,
  span: motion.span,
} as const;

type RevealTag = keyof typeof TAGS;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to hold before the element starts moving. */
  delay?: number;
  /** Distance in pixels the element travels up into place. */
  distance?: number;
  as?: RevealTag;
  /** Fraction of the element that must be on screen before it plays. */
  amount?: number;
};

/**
 * Scroll-triggered entrance: a short upward translate paired with a fade,
 * played once the element scrolls into view and never replayed.
 *
 * `useReducedMotion` cannot be read while server rendering, so it only
 * settles once mounted. Swapping the rendered tag on it would give the server
 * and the client different tree shapes, and React derives `useId` from tree
 * position — that shifts every generated id further down the page (the Radix
 * accordion ids among them) and breaks hydration. The tag therefore stays
 * fixed and only the animated values collapse.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  as = "div",
  amount = 0.2,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = TAGS[as];

  return (
    <MotionTag
      suppressHydrationWarning
      className={className}
      // Reduced motion drops the travel but keeps a short fade — the section
      // still announces itself, it just no longer moves across the viewport.
      initial={{ opacity: 0, y: reduceMotion ? 0 : distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -80px 0px" }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.65,
        delay: reduceMotion ? 0 : delay,
        // M3 "emphasized" — see the motion tokens in globals.css.
        ease: [0.2, 0, 0, 1],
      }}
    >
      {children}
    </MotionTag>
  );
}
