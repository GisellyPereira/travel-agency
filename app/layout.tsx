import type { Metadata } from "next";
import { Geist, Geist_Mono, Volkhov } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const volkhov = Volkhov({
  variable: "--font-volkhov",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.exemplo-agencia-viagens.com"),
  title: {
    default: "Agência de Viagens — Explore o mundo com confiança",
    template: "%s | Agência de Viagens",
  },
  description:
    "Planeje sua próxima viagem com experiências exclusivas, suporte 24/7 e os melhores destinos.",
  keywords: [
    "agência de viagens",
    "pacotes de viagem",
    "passagens aéreas",
    "turismo",
    "destinos",
  ],
  authors: [{ name: "Agência de Viagens" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.exemplo-agencia-viagens.com",
    siteName: "Agência de Viagens",
    title: "Agência de Viagens — Explore o mundo com confiança",
    description:
      "Planeje sua próxima viagem com experiências exclusivas, suporte 24/7 e os melhores destinos.",
    images: [
      {
        url: "/next.svg",
        width: 1200,
        height: 630,
        alt: "Agência de Viagens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agência de Viagens — Explore o mundo com confiança",
    description:
      "Planeje sua próxima viagem com experiências exclusivas, suporte 24/7 e os melhores destinos.",
    images: ["/next.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${volkhov.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
