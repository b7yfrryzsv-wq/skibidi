import { SiteHeader } from "@/components/site-header";
import { Benefits } from "@/components/sections/benefits";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PhotoBand } from "@/components/sections/photo-band";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Benefits />
        <PhotoBand />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
