"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Container } from "../components/Container";
import { SectionEyebrow } from "./SectionEyebrow";

type Card = {
  img: string;
  city: string;
  price: string;
  days: string;
  badge?: string;
  priceDrop?: string;
  category: "beach" | "city" | "nature";
};

const cards: Card[] = [
  { img: "/pexels-chaitaastic-1796736.jpg", city: "Rome, Italy", price: "$5,42k", days: "10 Days Trip", badge: "Popular", priceDrop: "12%", category: "city" },
  { img: "/pexels-samson-bush-1387215-2678456.jpg", city: "London, UK", price: "$4,2k", days: "12 Days Trip", badge: "Best Deal", category: "city" },
  { img: "/pexels-athul-shigo-774998744-18951617.jpg", city: "Full Europe", price: "$15k", days: "28 Days Trip", priceDrop: "8%", category: "nature" },
  { img: "/pexels-chaitaastic-1796736.jpg", city: "Maldives Beach", price: "$3,8k", days: "7 Days Trip", badge: "Popular", category: "beach" },
];

const filters = [
  { label: "All", value: "all" },
  { label: "Beach", value: "beach" },
  { label: "City", value: "city" },
  { label: "Nature", value: "nature" },
];

export function Destinations() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filteredCards = activeFilter === "all" ? cards : cards.filter(c => c.category === activeFilter);

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/3 -z-10 hidden lg:block">
        <Image src="/card-decor.svg" alt="" width={220} height={220} />
      </div>

      <Container>
        <div className="text-center">
          <SectionEyebrow className="mb-2">Top Selling</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            Top Destinations
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                activeFilter === filter.value
                  ? "bg-[#F1A501] text-white shadow-md"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCards.map((c, i) => (
            <motion.article
              key={c.city}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="group relative rounded-[26px] bg-white ring-1 ring-zinc-200 transition-all duration-300 hover:ring-[#F1A501]/40"
            >
              <div className="relative overflow-hidden rounded-t-[26px] aspect-[16/11] md:aspect-[4/3]">
                <Image 
                  src={c.img} 
                  alt={c.city} 
                  fill 
                  sizes="(min-width: 1024px) 30vw, 90vw" 
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute left-3 top-3 flex flex-col gap-2">
                  {c.badge && (
                    <span className="rounded-full bg-[#F1A501] px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
                      {c.badge}
                    </span>
                  )}
                  {c.priceDrop && (
                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white shadow-lg">
                      ⬇ Price dropped {c.priceDrop}
                    </span>
                  )}
                </div>
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="flex items-start justify-between gap-3 px-5 pt-4">
                <h3 className="text-[15px] font-semibold text-[#1E1D4C]">{c.city}</h3>
                <span className="text-[15px] font-bold text-[#14183E]">{c.price}</span>
              </div>

              <div className="flex items-center gap-2 px-5 pb-5 pt-2 text-[13px] text-[#5E6282]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
                <span>{c.days}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
