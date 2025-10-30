"use client";

import Image from "next/image";
import { Container } from "../components/Container";
import { motion } from "framer-motion";

const cards = [
  {
    icon: "/icon-card01.svg",
    title: "Calculated Weather",
    desc: "Built Wicket longer admire do barton vanity itself do in it.",
  },
  {
    icon: "/icon-card02.svg",
    title: "Best Flights",
    desc: "Engrossed listening. Park gate sell they west hard for the.",
    featured: true,
  },
  {
    icon: "/icon-card03.svg",
    title: "Local Events",
    desc: "Barton vanity itself do in it. Preferred to men it engrossed listening.",
  },
  {
    icon: "/icon-card04.svg",
    title: "Customization",
    desc: "We deliver outsourced aviation services for military customers",
  },
];

export function Services() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 sm:pb-24">
      {/* Decoração com + no canto superior direito */}
      <div aria-hidden className="pointer-events-none absolute right-[2%] top-6 z-0 hidden md:block">
        <Image src="/decore-plus.svg" alt="" width={153} height={166} priority />
      </div>

      <Container>
        <div className="text-center">
          <p className="mb-2 text-[12px] font-semibold tracking-[0.18em] text-orange-600">CATEGORY</p>
          <h2 className="font-volkhov text-3xl font-extrabold tracking-tight text-[#14183E] sm:text-4xl">We Offer Best Services</h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`group relative overflow-visible rounded-3xl bg-white p-6 text-center ring-1 ring-black/[0.06] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:ring-0`}
            >
              {/* canto decorativo (apenas no hover) */}
              <span className="pointer-events-none absolute -left-5 bottom-6 hidden h-12 w-12 rounded-2xl bg-[#DF6951] opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inline-block -z-10" />

              <div className="relative mx-auto h-[78px] w-[92px]">
                <span className="absolute -right-3 -top-2 h-6 w-8 rounded-md bg-[#FFF1DA]" />
                <Image src={card.icon} alt="" width={92} height={78} />
              </div>
              <h3 className="mt-6 font-volkhov text-lg font-extrabold text-[#1E1D4C]">{card.title}</h3>
              <p className="mt-3 text-[14px] leading-6 text-zinc-600">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}


