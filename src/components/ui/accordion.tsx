"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "rounded-2xl border border-neutral-200/80 bg-white shadow-soft transition-colors data-[state=open]:border-neutral-300",
        className,
      )}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left text-base font-semibold text-neutral-900 outline-none transition-colors hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:px-6 sm:text-lg",
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors duration-[var(--md-duration-short4)] ease-[var(--md-easing-standard)] group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground"
        >
          {/* A single "+" that rotates a quarter turn into a "×" when open. */}
          <Plus className="size-4 transition-transform duration-[var(--md-duration-medium4)] ease-[var(--md-easing-emphasized)] group-data-[state=open]:rotate-135" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      // `duration-*`/`ease-*` feed tw-animate-css's --tw-duration/--tw-ease,
      // which is how the shared accordion keyframes pick up M3 timing.
      className="overflow-hidden duration-[var(--md-duration-medium4)] ease-[var(--md-easing-emphasized)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div
        className={cn(
          "px-5 pb-5 text-[0.975rem] leading-relaxed text-neutral-600 sm:px-6 sm:pb-6",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
