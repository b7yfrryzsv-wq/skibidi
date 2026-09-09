"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

export type AddressSuggestion = {
  label: string;
  name: string;
  postcode: string;
  city: string;
  /** "housenumber" | "street" | "locality" | "municipality" */
  type: string;
};

/**
 * Not every address the BAN knows about is geocoded down to an individual
 * house number — rural roads and some newer streets often only have a
 * street-level entry. Restricting the search to `type=housenumber` (an
 * earlier version of this did) made those searches return nothing at all,
 * even though the street itself was a good match — e.g. "113 rue de la
 * Motte" has no indexed housenumber in Poitiers, but "Rue de la Motte" does.
 *
 * So the search is left unfiltered, and a street-level pick's `name` (just
 * the street, no number) would otherwise silently drop the house number the
 * visitor already typed. This puts it back by reading it off what they'd
 * typed before the suggestion replaced it.
 */
function withPreservedHouseNumber(typed: string, suggestion: AddressSuggestion) {
  if (suggestion.type === "housenumber") return suggestion.name;

  // Digits, then an optional French repetition suffix (bis/ter/quater, or a
  // bare letter like "12b") — captured as its own group so the whitespace
  // in between isn't part of either capture and doesn't end up duplicated
  // against the space the template below adds.
  const match = typed.trim().match(/^(\d+)\s*(bis|ter|quater|[a-zA-Z])?\b/i);
  if (!match) return suggestion.name;

  const houseNumber = match[1] + (match[2] ?? "");
  return `${houseNumber} ${suggestion.name}`;
}

type AddressFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  error?: string;
};

/**
 * IGN Géoplateforme address search — the current home of the BAN (Base
 * Adresse Nationale), France's own address database.
 *
 * `api-adresse.data.gouv.fr` (the older, more commonly documented URL for
 * this same API) sends back `Deprecation`/`Sunset` response headers pointing
 * here, so this uses the successor directly rather than the address that's
 * already past its own published sunset date.
 *
 * This is the government's data, not Google's: no API key, no billing
 * account, and a more accurate source for a form that only ever needs
 * addresses inside France. If Google Places is specifically wanted instead,
 * that requires a Google Cloud project with billing enabled — a decision
 * (and a cost) that has to be made on your end; it isn't something that can
 * be provisioned here.
 */
const SEARCH_URL = "https://data.geopf.fr/geocodage/search/";

/**
 * Same bordered shell and animated floating label as `TextField` — copied
 * rather than shared, matching how `DateField`/`PhoneField` already each
 * carry their own shell instead of factoring one out, since none of these
 * fields are simple enough to be one component with a prop for the
 * difference (this one also owns a listbox, a fetch, and its own keyboard
 * handling).
 *
 * Suggestions are an assist, not a requirement — the input stays a normal
 * free-text field, so an address the lookup doesn't know about can still be
 * typed and submitted as-is.
 */
export function AddressField({
  label,
  value,
  onChange,
  onSelect,
  error,
}: AddressFieldProps) {
  const id = useId();
  const listId = `${id}-listbox`;
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  /*
   * Two separate guards, for two separate questions:
   *
   * `requestIdRef` answers "is this response still wanted by the time it
   * arrives?" — bumped by anything that should invalidate a pending or
   * in-flight lookup (Escape, blur, a further keystroke). A result only
   * applies if its captured id still matches the current one. This alone
   * used to be built from an `AbortController`, which only closes the race
   * if the fetch had already started — blurring 200ms into the 350ms debounce
   * aborts nothing, since no request has been made yet, and the list would
   * still reopen on top of whatever the visitor moved to next. A counter
   * checked once, at the point a result is about to be applied, catches every
   * such path in one place instead of needing an abort call added at each one
   * as it's found.
   *
   * `skipSearchRef` answers a different question: "did `value` just change
   * because *we* set it?" `choose()` below calls `onChange` with the picked
   * address, which re-runs this effect exactly like a keystroke would —
   * without this flag, the effect can't tell that apart from the visitor
   * having typed it, and searches the freshly-picked address as if it were
   * new input, reopening the list with fresh results for what's already been
   * chosen. `requestIdRef` doesn't help here: this is about whether to start
   * a new search at all, not about discarding a stale response.
   */
  const requestIdRef = useRef(0);
  const skipSearchRef = useRef(false);

  useEffect(() => {
    if (skipSearchRef.current) {
      skipSearchRef.current = false;
      requestIdRef.current++; // still invalidate whatever was pending
      return;
    }

    const requestId = ++requestIdRef.current;
    const query = value.trim();

    if (query.length < 3) {
      // Deferred rather than called directly: React (correctly) flags
      // setState called synchronously from inside an effect body, since it
      // forces an extra render before the browser paints. A 0ms timeout
      // moves it off the synchronous effect pass without any perceptible
      // delay — this only clears an empty dropdown.
      const id = setTimeout(() => {
        setSuggestions([]);
        setOpen(false);
      }, 0);
      return () => clearTimeout(id);
    }

    const timer = setTimeout(async () => {
      try {
        const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}&limit=5&autocomplete=1`;
        const res = await fetch(url);
        if (!res.ok || requestIdRef.current !== requestId) return;
        const data: {
          features?: {
            properties: {
              label: string;
              name: string;
              postcode: string;
              city: string;
              type: string;
            };
          }[];
        } = await res.json();

        if (requestIdRef.current !== requestId) return; // stale by the time it landed

        setSuggestions(
          (data.features ?? []).map((f) => ({
            label: f.properties.label,
            name: f.properties.name,
            postcode: f.properties.postcode,
            city: f.properties.city,
            type: f.properties.type,
          })),
        );
        setActiveIndex(-1);
        setOpen(true);
      } catch {
        // A dropped request (network error, or the page navigating away) is
        // not worth surfacing — the field just quietly keeps whatever it had.
      }
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  function choose(s: AddressSuggestion) {
    skipSearchRef.current = true;
    onChange(withPreservedHouseNumber(value, s));
    onSelect(s);
    setOpen(false);
    setSuggestions([]);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      requestIdRef.current++;
      setOpen(false);
      return;
    }

    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      // Only swallow Enter when a suggestion is actually highlighted, so the
      // form still submits normally on Enter otherwise.
      e.preventDefault();
      choose(suggestions[activeIndex]);
    }
  }

  const active = focused || value.length > 0;

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
        <MapPin
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
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
          }
          // Not "off": Chrome has special-cased that literal value away since
          // ~2015 and still runs its own address-autofill heuristic anyway
          // (it goes by the field's label text and surrounding form context,
          // not just `name`/`autocomplete`) — which is what was popping up
          // its own "113 rue de la motte / Gérer les adresses…" suggestion
          // list on top of this component's. An unrecognized, non-"off"
          // token doesn't fall into that special case, so Chrome treats it
          // like any other unknown value and leaves the field alone.
          autoComplete="do-not-autofill"
          // 16px: below that, iOS Safari zooms the page in on focus.
          className="peer min-w-0 flex-1 bg-transparent pt-2.5 text-base text-neutral-900 outline-none placeholder:text-transparent"
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            requestIdRef.current++;
            setFocused(false);
            setOpen(false);
          }}
          onKeyDown={onKeyDown}
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

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white py-1.5 shadow-lift"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.label}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={i === activeIndex}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-sm text-neutral-700",
                i === activeIndex && "bg-emerald-50 text-neutral-900",
              )}
              // Prevents the input's blur (which would close the list) from
              // firing before the click is registered.
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => choose(s)}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1.5 ml-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
