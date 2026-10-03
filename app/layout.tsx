import type { Metadata } from "next";
import localFont from "next/font/local";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "./components/SmoothScroll";

const archivo = localFont({
  src: "../public/fonts/archivo.ttf", variable: "--font-sans", weight: "100 900", display: "swap",
});
const oswald = localFont({
  src: "../public/fonts/oswald.ttf", variable: "--font-display", weight: "200 700", display: "swap",
});
const handwriting = localFont({
  src: "../public/fonts/kaushan-script.ttf", variable: "--font-hand", weight: "400", display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agency-travvel.netlify.app"),
  title: "Travel Agency — O mundo te espera",
  description:
    "Descubra paisagens, culturas e bons caminhos. Explore destinos, guarde suas ideias e comece a imaginar sua próxima viagem com a Travel Agency.",
  authors: [
    { name: "Giselly Pereira", url: "https://github.com/GisellyPereira" },
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Travel Agency",
    title: "Travel Agency — Vá viver histórias.",
    description:
      "Lugares que despertam a curiosidade. Viagens que ficam com você.",
    images: [
      {
        url: "/images/travel/hero.webp",
        width: 2200,
        height: 1467,
        alt: "O lago Oeschinen e os Alpes suíços",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Agency — O mundo te espera",
    images: ["/images/travel/hero.webp"],
  },
  icons: { icon: "/icon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${archivo.variable} ${oswald.variable} ${handwriting.variable}`}><SmoothScroll>{children}</SmoothScroll></body>
    </html>
  );
}
