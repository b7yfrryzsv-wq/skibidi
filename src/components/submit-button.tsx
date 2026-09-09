"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import { M3Spinner } from "@/components/ui/m3-spinner";
import { cn } from "@/lib/utils";

type SubmitButtonProps = Omit<ComponentProps<typeof motion.button>, "children"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    children: ReactNode;
  };

/**
 * The form-submitting counterpart to `CtaButton`, which only ever renders an
 * `<a>` — a submit action needs a real `<button type="submit">` so it
 * participates in form validation and works without JavaScript routing.
 *
 * The label is layered under the spinner with `invisible` rather than
 * unmounted, so the button's width never changes when `loading` flips — a
 * button that reflows out from under the pointer while it's being pressed is
 * its own small piece of jank.
 */
export function SubmitButton({
  className,
  variant,
  size,
  shape,
  loading = false,
  disabled,
  children,
  ...props
}: SubmitButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="submit"
      whileHover={reduceMotion || loading ? {} : { y: -2 }}
      whileTap={reduceMotion || loading ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size, shape }), "relative", className)}
      {...props}
    >
      <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <M3Spinner className="text-current" />
        </span>
      )}
    </motion.button>
  );
}
