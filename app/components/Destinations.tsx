"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "../components/Container";

type Card = {
  img: string;
  city: string;
  price: string;
  days: string;
};

const cards: Card[] = [
  { img: "/roma.svg", city: "Rome, Italy", price: "$5,42k", days: "10 Days Trip" },
  { img: "/london.svg", city: "London, UK", price: "$4,2k", days: "12 Days Trip" },
  { img: "/europe.svg", city: "Full Europe", price: "$15k", days: "28 Days Trip" },
];

export function Destinations() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      {/* decoração à direita do 3º card */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/3 -z-10 hidden lg:block">
        <Image src="/card-decor.svg" alt="" width={220} height={220} />
      </div>

      <Container>
        <div className="text-center">
          <p className="mb-2 text-[12px] font-semibold tracking-[0.18em] text-orange-600">Top Selling</p>
          <h2 className="font-volkhov text-[34px] font-extrabold leading-tight tracking-tight text-[#14183E] sm:text-[40px]">Top Destinations</h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <motion.article
              key={c.city}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="group relative rounded-[26px] bg-white shadow-[0_30px_70px_rgba(8,15,52,0.06)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-t-[26px]">
                <Image src={c.img} alt={c.city} width={630} height={420} className="h-[240px] w-full object-cover md:h-[260px]" />
                {/* overlay sutil no hover */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              <div className="flex items-start justify-between gap-3 px-5 pt-4">
                <h3 className="text-[15px] font-medium text-[#1E1D4C]">{c.city}</h3>
                <span className="text-[15px] font-semibold text-[#5E6282]">{c.price}</span>
              </div>

              <div className="flex items-center gap-2 px-5 pb-5 pt-2 text-[13px] text-[#5E6282]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 3L3 11l7 2 2 7 9-17z" fill="#5E6282"/>
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


