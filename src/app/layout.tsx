import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { SplashScreen } from "@/components/splash-screen";
import "./globals.css";

/**
 * Roboto is Material 3's system typeface. (M3's newer Google Sans is not
 * licensed for third-party use, so Roboto is the correct public equivalent.)
 */
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chèque énergie — vérifiez vos 457 € en 2 minutes | EDF",
  description:
    "Vérifiez gratuitement si votre logement ouvre droit à l’aide énergie. Aucune avance de frais, chèque à encaisser directement, réponse en deux minutes.",
  openGraph: {
    title: "Un chèque énergie de 457 € vous attend",
    description:
      "Vérifiez gratuitement votre éligibilité à l’aide énergie. Sans avance de frais et sans engagement.",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${roboto.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <SplashScreen>{children}</SplashScreen>
        </SmoothScroll>
      </body>
    </html>
  );
}
