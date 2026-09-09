import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EligibiliteForm } from "@/components/eligibilite-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Vérifiez votre éligibilité | EDF",
  description:
    "Renseignez vos coordonnées pour vérifier votre éligibilité au chèque énergie.",
};

export default function EligibilitePage() {
  return (
    /*
     * `min-h-dvh` (an absolute viewport unit), not `min-h-full` (a
     * percentage). `min-h-full` needs `html`/`body` to already resolve to a
     * definite height for the percentage to resolve against, and on a page
     * this short — especially the confirmation card once submitted — that
     * chain collapsed to the content's own height instead of the viewport,
     * leaving the grey background clipped partway down with plain white
     * underneath it. `dvh` reads the viewport directly, so it doesn't depend
     * on that chain at all, and it accounts for mobile browsers' address bar
     * showing/hiding, which a plain `vh` wouldn't.
     */
    <main className="flex min-h-dvh flex-1 flex-col bg-neutral-50">
      <header className="w-full">
        <div className="mx-auto flex h-18 w-full max-w-2xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-1 text-sm font-medium text-neutral-500 outline-none transition-colors hover:text-neutral-900 focus-visible:ring-[3px] focus-visible:ring-ring/40"
          >
            <ArrowLeft className="size-4" />
            Retour
          </Link>
          <Logo className="h-8 w-auto" />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-10 sm:px-8 sm:py-14">
        <EligibiliteForm />
      </div>
    </main>
  );
}
