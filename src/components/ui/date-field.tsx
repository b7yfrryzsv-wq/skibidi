"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useId, useState } from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

type DateFieldProps = {
  label: string;
  value: string; // "yyyy-MM-dd", same contract the native input used
  onChange: (value: string) => void;
  error?: string;
  /** ISO date string; days after this are disabled. Defaults to today. */
  max?: string;
};

function parseIso(value: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * A calendar popover replacing the browser's native `<input type="date">`.
 * The native control is correct and accessible, but its picker is whatever
 * the OS/browser theme happens to be — flat white Chrome-on-Windows chrome
 * for this reader, unrelated to the rest of the page. This renders the same
 * calendar everywhere instead, in the same rounded/M3 language as the other
 * fields.
 *
 * `react-day-picker` supplies the calendar logic (month grid, keyboard nav,
 * locale-aware weekday order) unstyled; everything visual below is this
 * project's own Tailwind classes via its `classNames` prop.
 */
export function DateField({ label, value, onChange, error, max }: DateFieldProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const selected = parseIso(value);
  const maxDate = (max && parseIso(max)) || new Date();

  return (
    <div className="relative">
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            id={id}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              "flex h-14 w-full items-center gap-3 rounded-2xl border bg-white px-4 pt-2.5 text-left transition-colors",
              "duration-[var(--md-duration-short4)] ease-[var(--md-easing-standard)]",
              error
                ? "border-red-400"
                : open
                  ? "border-primary"
                  : "border-neutral-200 hover:border-neutral-300",
            )}
          >
            <CalendarIcon
              className={cn(
                "size-5 shrink-0 transition-colors",
                error
                  ? "text-red-500"
                  : open
                    ? "text-primary"
                    : "text-neutral-400",
              )}
            />
            <span
              className={cn(
                "text-[0.95rem]",
                selected ? "text-neutral-900" : "text-neutral-400",
              )}
            >
              {selected ? format(selected, "dd/MM/yyyy", { locale: fr }) : "jj/mm/aaaa"}
            </span>
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={cn(
              "z-30 rounded-3xl border border-neutral-200/80 bg-white p-4 shadow-lift outline-none",
              "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95",
              "duration-[var(--md-duration-short4)]",
            )}
          >
            <DayPicker
              mode="single"
              locale={fr}
              captionLayout="dropdown"
              startMonth={new Date(1900, 0)}
              endMonth={maxDate}
              selected={selected}
              defaultMonth={selected ?? maxDate}
              disabled={{ after: maxDate }}
              onSelect={(date) => {
                if (date) {
                  onChange(toIso(date));
                  setOpen(false);
                }
              }}
              classNames={{
                months: "flex flex-col",
                month: "space-y-3",
                month_caption: "flex items-center justify-center px-9 py-1",
                caption_label: "sr-only",
                dropdowns: "flex items-center gap-1.5 text-sm font-semibold text-neutral-900",
                dropdown:
                  "rounded-lg border-none bg-neutral-100 px-2 py-1 text-sm font-semibold text-neutral-900 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                nav: "flex items-center justify-between",
                button_previous:
                  "absolute left-1 top-1 flex size-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-30",
                button_next:
                  "absolute right-1 top-1 flex size-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 disabled:pointer-events-none disabled:opacity-30",
                month_grid: "mt-2 w-full border-collapse",
                weekdays: "flex",
                weekday: "w-9 text-center text-xs font-medium text-neutral-400",
                week: "mt-1 flex w-full",
                day: "flex size-9 items-center justify-center p-0 text-sm",
                day_button:
                  "flex size-9 items-center justify-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                today: "font-bold text-primary",
                selected: "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary-hover",
                outside: "text-neutral-300",
                disabled: "text-neutral-300 pointer-events-none",
                hidden: "invisible",
              }}
              components={{
                Chevron: ({ orientation }) =>
                  orientation === "left" ? (
                    <ChevronLeft className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  ),
              }}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute top-0 left-11 -translate-y-1/2 rounded bg-white px-1 text-[0.8em] select-none",
          error ? "text-red-500" : open ? "text-primary" : "text-neutral-500",
        )}
      >
        {label}
      </label>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 ml-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
