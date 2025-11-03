"use client";

import Image from "next/image";
import { Container } from "../components/Container";
import { motion } from "framer-motion";
import { SectionEyebrow } from "./SectionEyebrow";

const cards = [
  {
    icon: "/icon-card01.svg",
    title: "AI Weather Intelligence",
    desc: "Advanced machine learning algorithms analyze weather patterns from 50+ global data sources. Get 14-day forecasts with 95% accuracy to plan your perfect trip timing.",
    tech: "AI/ML · Real-time APIs",
  },
  {
    icon: "/icon-card02.svg",
    title: "Smart Flight Engine",
    desc: "Our proprietary algorithm compares 500k+ flight options across 200+ airlines in real-time. Dynamic pricing ensures you always get the best deal with instant price match guarantee.",
    featured: true,
    tech: "Real-time · Price Intelligence",
  },
  {
    icon: "/icon-card03.svg",
    title: "Event Discovery API",
    desc: "Integrated with global event databases and local partners. Discover concerts, festivals, and cultural events happening during your stay. Automatically syncs with your itinerary.",
    tech: "API Integration · Location-based",
  },
  {
    icon: "/icon-card04.svg",
    title: "Dynamic Itinerary Builder",
    desc: "Advanced customization engine with AI recommendations. Drag-and-drop interface, real-time availability checks, and collaborative planning with travel experts via live chat.",
    tech: "Custom Engine · Collaborative Tools",
  },
];

export function Services() {
  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute right-[2%] top-6 z-0 hidden md:block">
        <Image src="/decore-plus.svg" alt="" width={153} height={166} priority />
      </div>

      <Container>
        <div className="text-center">
          <SectionEyebrow className="mb-2">CATEGORY</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            We Offer Best Services
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative overflow-visible rounded-3xl bg-white p-6 text-center ring-1 ring-zinc-200 transition-all duration-300 hover:ring-[#F1A501]/40"
            >
              <div className="relative mx-auto h-[78px] w-[92px]">
                <span className="absolute -right-3 -top-2 h-6 w-8 rounded-md bg-[#FFF1DA]" />
                <Image src={card.icon} alt="" width={92} height={78} />
              </div>
              <h3 className="mt-6 font-volkhov text-lg font-extrabold text-[#1E1D4C]">{card.title}</h3>
              <p className="mt-3 text-[14px] leading-6 text-zinc-600">{card.desc}</p>
              {card.tech && (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {card.tech.split(" · ").map((tech, idx) => (
                    <span key={idx} className="rounded-full bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-600">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

