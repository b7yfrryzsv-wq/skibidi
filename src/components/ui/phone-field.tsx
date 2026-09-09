"use client";

import { useId, useState } from "react";
import PhoneInput from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import fr from "react-phone-number-input/locale/fr.json";
import "react-phone-number-input/style.css";

import { cn } from "@/lib/utils";

type PhoneFieldProps = {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  error?: string;
};

/**
 * Sovereign states and dependent territories conventionally counted as part
 * of Europe (ISO 3166-1 alpha-2), so the country picker isn't a ~245-entry
 * list of every country on earth for a benefit that only exists in France.
 * All 51 codes are present in this library's bundled metadata — verified
 * against `getCountries()` rather than assumed.
 */
const EUROPEAN_COUNTRIES: Country[] = [
  "AD", "AL", "AT", "AX", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK",
  "EE", "ES", "FI", "FO", "FR", "GB", "GG", "GI", "GR", "HR", "HU", "IE", "IM",
  "IS", "IT", "JE", "LI", "LT", "LU", "LV", "MC", "MD", "ME", "MK", "MT", "NL",
  "NO", "PL", "PT", "RO", "RS", "RU", "SE", "SI", "SJ", "SK", "SM", "UA", "VA",
];

/**
 * Same bordered shell as the other fields. `react-phone-number-input` ships
 * its own CSS (imported above) for the flag and country-select chrome; the
 * overrides in `globals.css` under `.PhoneInput` strip its default input
 * styling so ours shows through instead, and `defaultCountry="FR"` matches
 * the only market this scheme applies to.
 *
 * Label stays permanently floated, same reasoning as `DateField`: the
 * flag + calling-code prefix is itself a persistent visual element, so a
 * centered resting label would collide with it.
 */
export function PhoneField({ label, value, onChange, error }: PhoneFieldProps) {
  const id = useId();
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-14 items-center rounded-2xl border bg-white px-4 pt-2.5 transition-colors",
          "duration-[var(--md-duration-short4)] ease-[var(--md-easing-standard)]",
          error
            ? "border-red-400"
            : focused
              ? "border-primary"
              : "border-neutral-200 hover:border-neutral-300",
        )}
      >
        <PhoneInput
          id={id}
          className="w-full"
          defaultCountry="FR"
          countries={EUROPEAN_COUNTRIES}
          international
          labels={fr}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          numberInputProps={{
            // 16px: below that, iOS Safari zooms the page in on focus.
            className:
              "min-w-0 flex-1 bg-transparent text-base text-neutral-900 outline-none",
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
          }}
        />
      </div>

      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute top-0 left-4 -translate-y-1/2 rounded bg-white px-1 text-[0.8em] select-none",
          error ? "text-red-500" : focused ? "text-primary" : "text-neutral-500",
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
