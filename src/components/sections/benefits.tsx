import { CheckCircle, Home, Users, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { EnergyCheckVisual } from "@/components/energy-check-visual";
import { Reveal } from "@/components/reveal";

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: Wallet,
    title: "Zéro avance de frais",
    description:
      "Vous ne sortez pas un euro. L’aide est versée sous forme de chèque, jamais avancée par vos soins.",
  },
  {
    icon: Home,
    title: "Maison ou appartement",
    description:
      "Résidence principale, en ville comme à la campagne : propriétaires et locataires peuvent y prétendre.",
  },
  {
    icon: Users,
    title: "Un conseiller dédié",
    description:
      "La même personne suit votre dossier, du premier appel jusqu’à la réception du chèque.",
  },
  {
    icon: CheckCircle,
    title: "Démarche encadrée",
    description:
      "Dossier conforme, partenaires certifiés RGE et récapitulatif écrit à chaque étape.",
  },
];

export function Benefits() {
  return (
    <section id="avantages" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
          <div>
            <Reveal className="max-w-xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-balance text-neutral-900 sm:text-4xl">
                Une aide pensée pour votre foyer
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-pretty text-neutral-600">
                Le dispositif s’adresse aux ménages qui subissent la hausse des
                factures. Voici ce qu’il change concrètement chez vous.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {BENEFITS.map((benefit, index) => (
                <Reveal key={benefit.title} delay={index * 0.1}>
                  <div className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <benefit.icon className="size-5" strokeWidth={1.9} />
                    </span>
                    <h3 className="mt-5 text-base font-bold tracking-tight text-neutral-900">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-[0.925rem] leading-relaxed text-neutral-600">
                      {benefit.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <EnergyCheckVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
