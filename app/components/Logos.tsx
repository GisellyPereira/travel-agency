"use client";

import Image from "next/image";
import { Container } from "../components/Container";
import { motion } from "framer-motion";
import { SectionEyebrow } from "./SectionEyebrow";

const logos = [
  { src: "/logo-01.svg", alt: "Logo 1" },
  { src: "/logo-02.svg", alt: "Logo 2" },
  { src: "/logo-03.svg", alt: "Logo 3" },
];

export function Logos() {
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="bg-white pt-12 pb-20 sm:pt-16 sm:pb-28">
      <Container>
        <div className="text-center mb-12 sm:mb-16">
          <SectionEyebrow className="mb-2">Trusted Partners</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            These companies are already with us
          </h2>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex items-center gap-12 sm:gap-16 animate-logo-scroll">
            {duplicatedLogos.map((logo, i) => (
              <div
                key={`${logo.src}-${i}`}
                className="flex-shrink-0 flex items-center justify-center opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105"
                style={{ width: '192px', height: '80px' }}
              >
                <Image 
                  src={logo.src} 
                  alt={logo.alt} 
                  width={192}
                  height={80}
                  className="object-contain"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
