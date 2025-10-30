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
    <section className="relative overflow-visible bg-white pb-0 pt-0 sm:pb-0 sm:pt-0">
      {/* Menu sobre a Hero */}
      <Header />
      {/* Decoração amarela à direita (aumentada) */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-0 z-0 hidden h-[70%] w-[72%] min-w-[620px] md:block">
        <Image src="/Decore.svg" alt="" fill priority className="object-contain object-right-top" />
      </div>

        <Container className="grid min-h-[640px] items-center gap-6 md:[grid-template-columns:0.9fr_1.1fr] lg:[grid-template-columns:0.8fr_1.2fr] lg:gap-10">
        <div className="relative z-20">
          <SectionEyebrow className="mb-3">BEST DESTINATIONS AROUND THE WORLD</SectionEyebrow>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-volkhov text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-[#14183E] sm:text-[72px]"
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
            Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening. Park gate sell they west hard for the.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mt-8 flex items-center gap-6"
          >
            <Button className="h-12 rounded-xl bg-[#F1A501] px-6 text-white shadow-lg shadow-[#F1A501]/30 hover:bg-[#d99601]">Find out more</Button>
            <PlayDemo />
          </motion.div>
        </div>
        {/* Coluna da imagem (normal no grid) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative hidden aspect-[4/5] w-full md:block"
        >
          <Image
            src="/Image-woman.svg"
            alt="Viajante sorrindo com mala"
            fill
            priority
            sizes="(min-width: 1440px) 700px, (min-width: 1024px) 560px, 100vw"
            className="object-contain"
          />
        </motion.div>
        </Container>

      {/* Imagem no mobile (abaixo do texto) */}
      <div className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-[560px] md:hidden">
        <Image src="/Image-woman.svg" alt="Viajante sorrindo com mala" fill priority sizes="92vw" className="object-contain" />
      </div>

      {/* Sublinhado vermelho sobre parte do título */}
      <div aria-hidden className="pointer-events-none absolute left-[min(6vw,72px)] top-[210px] hidden h-4 w-64 sm:block md:left-[8%]">
        <Image src="/Rectangle 14.svg" alt="" fill className="object-contain" />
      </div>
    </section>
  );
}


