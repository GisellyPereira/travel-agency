"use client";

import { Container } from "../components/Container";
import { motion } from "framer-motion";
import { SectionEyebrow } from "./SectionEyebrow";

const rows = [
  { feature: "AI-powered recommendations", us: true, them: false },
  { feature: "Real-time price tracking", us: true, them: false },
  { feature: "Best price guarantee", us: true, them: false },
  { feature: "24/7 human + AI support", us: true, them: false },
  { feature: "Mobile app (iOS & Android)", us: true, them: true },
  { feature: "API integrations available", us: true, them: false },
  { feature: "Flexible cancellations", us: true, them: false },
  { feature: "Travel insurance included", us: true, them: false },
  { feature: "Blockchain-secure payments", us: true, them: false },
];

export function Comparison() {
  return (
    <section className="relative bg-white py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <SectionEyebrow className="mb-2">Why choose us</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            Better value. Better support. Better trips.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] text-[#5E6282]">
            We focus on what really matters: price transparency, human support and unforgettable experiences.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white"
        >
          <div className="grid grid-cols-[1.3fr_1fr_1fr] items-center bg-gradient-to-r from-zinc-50 to-white px-6 py-4 text-[14px] font-semibold text-[#1E1D4C] sm:px-8">
            <div className="text-left">Feature</div>
            <div className="text-center text-[#F1A501]">Jadoo</div>
            <div className="text-center text-zinc-500">Others</div>
          </div>
          <div className="divide-y divide-zinc-100">
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="grid grid-cols-[1.3fr_1fr_1fr] items-center px-6 py-4 text-[14px] transition-colors hover:bg-zinc-50/50 sm:px-8"
              >
                <div className="font-medium text-[#1E1D4C]">{row.feature}</div>
                <div className="text-center">
                  {row.us ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F1A501] text-sm font-semibold text-white shadow-sm">✓</span>
                  ) : (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">–</span>
                  )}
                </div>
                <div className="text-center">
                  {row.them ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-300 text-zinc-600 text-sm">✓</span>
                  ) : (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">–</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
