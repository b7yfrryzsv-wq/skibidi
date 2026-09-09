"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CtaButtonProps = ComponentProps<typeof motion.a> &
  VariantProps<typeof buttonVariants>;

/**
 * The primary call to action. Same visual language as `Button`, plus the
 * hover lift and tap-scale feedback, and it always renders as a link.
 *
 * The gesture props stay present even under reduced motion — dropping
 * `whileTap` would make Motion stop injecting its `tabIndex`, and since
 * `useReducedMotion` only resolves on the client that attribute would differ
 * between the server and client markup. Only the values collapse.
 */
export function CtaButton({
  className,
  variant,
  size,
  shape,
  ...props
}: CtaButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.a
      whileHover={reduceMotion ? {} : { y: -2 }}
      whileTap={reduceMotion ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}
