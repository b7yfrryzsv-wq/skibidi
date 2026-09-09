import Image from "next/image";

import { Reveal } from "@/components/reveal";

/**
 * Full-bleed photographic band. The source is a 1920×560 panorama, so the
 * band keeps a wide ratio at every breakpoint rather than cropping it into a
 * portrait sliver on phones.
 */
export function PhotoBand() {
  return (
    <section aria-labelledby="territoires-title">
      <Reveal distance={16} amount={0.1}>
        <div className="relative h-[220px] w-full overflow-hidden sm:h-[300px] lg:h-[380px]">
          <Image
            src="/brand/aix-les-bains.jpg"
            alt="Vue aérienne des quartiers résidentiels d’Aix-les-Bains, en bord de lac"
            fill
            sizes="100vw"
            className="object-cover"
          />

          {/* Scrim so the caption stays legible over any part of the photo. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-neutral-950/25 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8 sm:pb-10">
            <h2
              id="territoires-title"
              className="max-w-xl text-xl font-extrabold tracking-tight text-balance text-white sm:text-2xl lg:text-3xl"
            >
              Un accompagnement présent partout en France
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-pretty text-neutral-200 sm:text-base">
              Villes, bourgs et communes rurales : le dispositif s’applique
              partout, quel que soit votre territoire.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
