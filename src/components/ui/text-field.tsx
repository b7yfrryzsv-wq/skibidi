"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  icon: LucideIcon;
  error?: string;
};

/**
 * Material 3 "outlined" text field: a full border, and a label that rests
 * centered next to the icon until the field is focused or filled, then floats
 * up to sit on the border line — the M3 signature, not the M2 "label above
 * the box" pattern.
 *
 * The floating label is real markup with a solid background, not a border
 * notch cut with a mask: it sits on top of the border and its own background
 * colour simply paints over the line behind the text. Simpler to get right
 * than clipping the border itself, and visually identical.
 */
export function TextField({
  label,
  icon: Icon,
  error,
  className,
  onFocus,
  onBlur,
  value,
  defaultValue,
  ...props
}: TextFieldProps) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);

  const hasValue = Boolean(value ?? defaultValue);
  const active = focused || hasValue;

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-14 items-center gap-3 rounded-2xl border bg-white px-4 transition-colors",
          "duration-[var(--md-duration-short4)] ease-[var(--md-easing-standard)]",
          error
            ? "border-red-400"
            : focused
              ? "border-primary"
              : "border-neutral-200 hover:border-neutral-300",
        )}
      >
        <Icon
          className={cn(
            "size-5 shrink-0 transition-colors",
            error
              ? "text-red-500"
              : focused
                ? "text-primary"
                : "text-neutral-400",
          )}
        />
        <input
          id={id}
          className={cn(
            // 16px, not 15.2px (`text-[0.95rem]`) — iOS Safari zooms the
            // whole page in on focus for any text input under 16px, which on
            // a real phone (not Chromium, which doesn't reproduce this) reads
            // as the page lurching every time a field is tapped.
            "peer min-w-0 flex-1 bg-transparent pt-2.5 text-base text-neutral-900 outline-none placeholder:text-transparent",
            className,
          )}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </div>

      <motion.label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-11 origin-left select-none whitespace-nowrap",
          active && "rounded bg-white px-1",
          error ? "text-red-500" : focused ? "text-primary" : "text-neutral-500",
        )}
        initial={false}
        animate={
          active
            ? { top: "0%", y: "-50%", scale: 0.8 }
            : { top: "50%", y: "-50%", scale: 1 }
        }
        // A label shifting 20px is small-scale UI feedback, not the spatial
        // travel reduced motion is about — same reasoning as the accordion
        // height change. So, unlike a `Reveal`'s travel distance, this keeps
        // animating; only the duration shortens, matching the short-but-never-
        // zero rule used everywhere else motion responds to the preference.
        transition={{
          duration: reduceMotion ? 0.12 : 0.2,
          ease: [0.2, 0, 0, 1],
        }}
      >
        {label}
      </motion.label>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 ml-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
