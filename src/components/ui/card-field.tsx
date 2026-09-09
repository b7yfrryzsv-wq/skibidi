"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type CardFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  label: string;
  icon: LucideIcon;
  error?: string;
  /** Masks all characters with dots except the last 4 digits when blurred. */
  masked?: boolean;
  /** Formats the value as a card number (spaces every 4 digits). */
  cardFormat?: boolean;
  /** Formats as MM/YY expiration date. */
  expiryFormat?: boolean;
};

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function maskValue(value: string): string {
  const clean = value.replace(/\s/g, "");
  if (clean.length <= 4) return "•".repeat(clean.length);
  return "•".repeat(clean.length - 4) + clean.slice(-4);
}

export function CardField({
  label,
  icon: Icon,
  error,
  className,
  onFocus,
  onBlur,
  onChange,
  value,
  defaultValue,
  masked = false,
  cardFormat = false,
  expiryFormat = false,
  ...props
}: CardFieldProps) {
  const id = useId();
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);

  const rawValue = String(value ?? defaultValue ?? "");
  const hasValue = Boolean(rawValue);
  const active = focused || hasValue;

  const displayValue = focused
    ? rawValue
    : masked && hasValue
      ? maskValue(rawValue)
      : rawValue;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    let newValue = e.target.value;

    if (cardFormat) {
      newValue = formatCardNumber(newValue);
    } else if (expiryFormat) {
      newValue = formatExpiry(newValue);
    } else if (masked) {
      newValue = newValue.replace(/\D/g, "").slice(0, 4);
    }

    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: newValue },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(syntheticEvent);
  }

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
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className={cn(
            "peer min-w-0 flex-1 bg-transparent pt-2.5 text-base text-neutral-900 outline-none placeholder:text-transparent",
            className,
          )}
          value={displayValue}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onFocus={(e) => {
            setFocused(true);
            if (value !== undefined) {
              e.target.value = rawValue;
            }
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          onChange={handleChange}
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
