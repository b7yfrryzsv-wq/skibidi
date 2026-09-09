import { ClipboardCheck, PhoneCall, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Reveal } from "@/components/reveal";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    icon: ClipboardCheck,
    title: "Vérifiez votre éligibilité",
    description:
      "Répondez à quatre questions sur votre logement et votre foyer. Aucune pièce justificative n’est demandée à ce stade.",
  },
  {
    icon: PhoneCall,
    title: "Validez votre dossier",
    description:
      "Un conseiller confirme le montant auquel vous avez droit et monte le dossier avec vous, par téléphone.",
  },
  {
    icon: Send,
    title: "Recevez votre chèque",
    description:
      "Le chèque est établi à votre nom et vous parvient sous quelques semaines, à encaisser directement.",
  },
];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="scroll-mt-24 bg-neutral-50/70 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-neutral-900 sm:text-4xl">
            Comment ça marche ?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pretty text-neutral-600">
            Trois étapes, aucune paperasse à préparer seul. Vous êtes accompagné
            du premier clic jusqu’au versement.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
          {STEPS.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 0.12}>
              <div className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
                    <step.icon className="size-5.5" strokeWidth={1.8} />
                  </span>
                  <span
                    aria-hidden
                    className="text-4xl font-extrabold tracking-tight text-neutral-200 tabular-nums"
                  >
                    {index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold tracking-tight text-neutral-900">
                  <span className="sr-only">Étape {index + 1} : </span>
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.975rem] leading-relaxed text-neutral-600">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
