import { CtaButton } from "@/components/cta-button";
import { Reveal } from "@/components/reveal";
import { M3Check } from "@/components/ui/m3-check";

const POINTS = [
  "Aucune avance de frais",
  "Chèque à encaisser directement",
  "Sans engagement",
];

export function FinalCta() {
  return (
    <section id="eligibilite" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-14 text-center sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_0%,rgba(16,185,129,0.35),rgba(16,185,129,0)_70%)]"
          />

          <div className="relative flex flex-col items-center">
            <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl">
              Vérifiez si vos 457 € vous attendent
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-pretty text-neutral-300">
              Deux minutes suffisent pour savoir où vous en êtes. Gratuit, sans
              engagement, et sans le moindre frais à avancer.
            </p>

            <CtaButton
              href="/eligibilite"
              size="lg"
              className="mt-9 w-full text-base sm:w-auto"
            >
              Réclamez mon chèque
            </CtaButton>

            <ul className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-x-7">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2.5 text-sm font-medium text-neutral-300"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                    <M3Check className="size-3" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
