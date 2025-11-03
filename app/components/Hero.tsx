"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "../components/Container";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { SectionEyebrow } from "../components/SectionEyebrow";
import { PlayDemo } from "../components/PlayDemo";

export function Hero() {
  return (
    <section className="relative overflow-x-hidden bg-white pb-0 pt-0 sm:pb-0 sm:pt-0">
      {/* Menu sobre a Hero */}
      <Header />
      {/* Decoração amarela à direita (aumentada) */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 z-0 hidden h-[70%] w-[72%] min-w-[620px] md:block">
        <Image src="/Decore.svg" alt="" fill priority className="object-contain object-right-top" />
      </div>

        <Container className="grid min-h-[560px] items-center gap-6 pt-1 md:min-h-[640px] md:[grid-template-columns:0.9fr_1.1fr] lg:[grid-template-columns:0.8fr_1.2fr] lg:gap-10">
        <div className="relative z-20">
          <SectionEyebrow className="mb-3">BEST DESTINATIONS AROUND THE WORLD</SectionEyebrow>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-volkhov text-balance text-[clamp(38px,6vw,72px)] font-extrabold leading-[1.02] tracking-tight text-[#14183E]"
          >
            Travel, enjoy <span className="relative inline-block">
              <span className="relative z-10">and live a new</span>
            </span>
            <br />
            and full life
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mt-5 max-w-xl text-pretty text-[16px] leading-7 text-zinc-600"
          >
            Discover amazing places around the world. Plan your dream trip with confidence, get the best prices guaranteed, and enjoy 24/7 support from real humans.
          </motion.p>

          {/* Trust Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="mt-6 flex flex-wrap items-center gap-6 text-[13px]"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <span className="font-medium text-zinc-700"><strong className="text-[#14183E]">250k+</strong> trips booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="font-medium text-zinc-700"><strong className="text-[#14183E]">4.9/5</strong> rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span className="font-medium text-zinc-700"><strong className="text-[#14183E]">100%</strong> secure</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-8 flex items-center gap-6"
          >
            <Button className="h-12 rounded-xl bg-[#F1A501] px-6 text-white shadow-lg shadow-[#F1A501]/30 hover:bg-[#d99601] transition-all hover:scale-105">Find out more</Button>
            <PlayDemo />
          </motion.div>
        </div>
        {/* Coluna da imagem (normal no grid) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative hidden aspect-[4/5] w-full md:max-w-[560px] lg:max-w-[620px] xl:max-w-[660px] md:justify-self-end md:block"
        >
          <Image
            src="/Image-woman.svg"
            alt="Viajante sorrindo com mala"
            fill
            priority
            sizes="(min-width: 1440px) 660px, (min-width: 1024px) 560px, 100vw"
            className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)]"
          />
        </motion.div>
        </Container>

      {/* Imagem no mobile (abaixo do texto) */}
      <div className="relative mx-auto mt-6 aspect-[4/5] w-full max-w-[420px] md:hidden">
        <Image src="/Image-woman.svg" alt="Viajante sorrindo com mala" fill priority sizes="92vw" className="object-contain" />
      </div>

    </section>
  );
}



