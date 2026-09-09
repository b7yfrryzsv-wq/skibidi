"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { ComponentProps } from "react";

import { M3Check } from "@/components/ui/m3-check";
import { cn } from "@/lib/utils";

/** Accessible checkbox built on Radix, styled to match the M3 checkmark. */
export function Checkbox({
  className,
  ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white outline-none transition-colors",
        "duration-[var(--md-duration-short4)] ease-[var(--md-easing-standard)]",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "aria-invalid:border-red-400",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-primary-foreground">
        <M3Check className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
