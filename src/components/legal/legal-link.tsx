"use client";

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LEGAL_NOTICES, type LegalKey } from "@/components/legal/legal-content";
import { cn } from "@/lib/utils";

/**
 * Opens a legal notice in place, without leaving the page.
 *
 * Deliberately a button rather than a hover target: hover does not exist on
 * touch devices, cannot be reached from the keyboard, and is invisible to
 * assistive technology — so a hover-only notice would be unreachable for most
 * visitors, which is the opposite of the "directement accessible" the LCEN
 * requires. A dialog keeps the no-navigation behaviour and works everywhere.
 */
export function LegalLink({
  notice,
  className,
}: {
  notice: LegalKey;
  /** Overrides the default plain footer-link look, e.g. for inline body copy. */
  className?: string;
}) {
  const { title, description, body } = LEGAL_NOTICES[notice];

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          "rounded text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
          className,
        )}
      >
        {title}
      </DialogTrigger>

      {/* Radix wires aria-describedby to <DialogDescription> automatically. */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody>{body}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}
