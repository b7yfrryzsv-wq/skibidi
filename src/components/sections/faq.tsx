"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/reveal";

const QUESTIONS = [
  {
    id: "montant",
    question: "À quoi correspondent les 457 € ?",
    answer:
      "C’est le montant maximum que peut atteindre l’aide pour un foyer éligible. Le montant réel dépend de vos revenus, de la composition de votre foyer et des caractéristiques de votre logement. Il vous est confirmé avant toute démarche.",
  },
  {
    id: "avance",
    question: "Dois-je avancer de l’argent ?",
    answer:
      "Non. Aucun frais ne vous est demandé, ni au moment de la vérification d’éligibilité, ni pendant le montage du dossier. Si on vous réclame un paiement pour obtenir cette aide, il ne s’agit pas de ce dispositif.",
  },
  {
    id: "locataire",
    question: "Je suis locataire, puis-je en bénéficier ?",
    answer:
      "Oui. L’aide concerne votre résidence principale, que vous en soyez propriétaire ou locataire. Pour certains travaux, l’accord du propriétaire reste nécessaire ; le conseiller vous indique la marche à suivre.",
  },
  {
    id: "delai",
    question: "Sous quel délai vais-je recevoir le chèque ?",
    answer:
      "Comptez généralement quelques semaines entre la validation du dossier et l’envoi du chèque. Vous êtes informé par écrit à chaque étape, et vous pouvez joindre votre conseiller à tout moment.",
  },
  {
    id: "documents",
    question: "Quels documents dois-je préparer ?",
    answer:
      "Rien pour la vérification d’éligibilité. Ensuite, il vous sera généralement demandé un avis d’imposition, un justificatif de domicile et un RIB. La liste exacte vous est transmise par votre conseiller.",
  },
  {
    id: "engagement",
    question: "Est-ce que la vérification m’engage à quelque chose ?",
    answer:
      "Non. La vérification est gratuite et sans engagement. Vous restez libre de ne pas donner suite après avoir pris connaissance du montant auquel vous avez droit.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-neutral-50/70 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-balance text-neutral-900 sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pretty text-neutral-600">
            Tout ce qu’il faut savoir avant de vérifier votre éligibilité.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {QUESTIONS.map(({ id, question, answer }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
