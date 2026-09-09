import { LegalLink } from "@/components/legal/legal-link";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "#fonctionnement", label: "Comment ça marche" },
  { href: "#avantages", label: "Avantages" },
  { href: "#faq", label: "Questions fréquentes" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/80 bg-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {/*
            `self-start` matters here: this row is a flex column on mobile, so
            without it the logo is stretched to the full container width by the
            default `align-items: stretch`. That beats `w-auto`, which breaks
            the aspect ratio and squashes the mark.
          */}
          <Logo className="self-start" />

          <nav aria-label="Pied de page">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded text-sm font-medium text-neutral-600 transition-colors outline-none hover:text-neutral-900 focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 max-w-3xl text-xs leading-relaxed text-neutral-400">
          Le montant de 457 € correspond au montant maximum. L’éligibilité et la
          somme réellement versée dépendent de vos revenus, de votre logement et
          de la composition de votre foyer. Aucun frais ne vous est demandé pour
          vérifier votre éligibilité.
        </p>

        <p className="mt-3 max-w-3xl text-xs leading-relaxed text-neutral-400">
          EDF est une marque déposée d’Électricité de France SA.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-400">
          <span>© {new Date().getFullYear()} EDF</span>
          <LegalLink notice="mentions" />
          <LegalLink notice="donnees" />
          <LegalLink notice="cookies" />
        </div>
      </div>
    </footer>
  );
}
