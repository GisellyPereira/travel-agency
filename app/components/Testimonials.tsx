"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Container } from "../components/Container";
import { SectionEyebrow } from "./SectionEyebrow";
import Image from "next/image";

type Testimonial = {
  name: string;
  role: string;
  avatar: string;
  quote: string;
};

const DATA: Testimonial[] = [
  {
    name: "Mike Taylor",
    role: "Lahore, Pakistan",
    avatar: "/london.svg",
    quote:
      "On the Windows talking painted pasture yet its express parties use. Sure last upon he same as knew next."
  },
  {
    name: "Chris Thomas",
    role: "CEO of Red Button",
    avatar: "/roma.svg",
    quote:
      "Yet preference connection unpleasant yet melancholy but end appearance. And excellence partiality estimating terminated day everything."
  },
  {
    name: "Emma Johnson",
    role: "San Francisco, USA",
    avatar: "/europe.svg",
    quote:
      "Arrival entered an if drawing request. How daughters not promotion few knowledge contented."
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const total = DATA.length;
  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  useEffect(() => {
    const start = () => (timerRef.current = setInterval(next, 5000));
    const stop = () => { if (timerRef.current) clearInterval(timerRef.current); };
    start();
    return stop;
  }, [next]);

  const orderedStack = useMemo(() => {
    const stack = [];
    for (let i = 0; i < total; i++) {
      const dataIndex = (index + i) % total;
      stack.push({ ...DATA[dataIndex], originalIndex: dataIndex });
    }
    return stack;
  }, [index, total]);

  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-12 sm:pt-20 sm:pb-14">
      <Container className="grid items-start gap-10 md:grid-cols-2">
        {/* Header à esquerda */}
        <div className="order-2 md:order-1">
          <SectionEyebrow className="mb-3">Testimonials</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            What People Say About Us.
          </h2>

          {/* Dots */}
          <div className="mt-8 flex items-center gap-2" aria-label="Pagination">
            {DATA.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-7 bg-[#39425D]" : "w-2.5 bg-zinc-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Stack à direita */}
        <div className="order-1 md:order-2">
          <div
            className="relative mx-auto w-full max-w-[520px] h-[220px] sm:h-[240px]"
            onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
            onMouseLeave={() => (timerRef.current = setInterval(next, 5000))}
          >
            {/* Controles laterais (dentro do container em mobile, fora em telas grandes) */}
            <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex-col gap-3 md:flex lg:right-[-48px]">
              <button
                aria-label="Previous testimonial"
                onClick={prev}
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
              <button
                aria-label="Next testimonial"
                onClick={next}
                className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>

            {/* Stack real de cards */}
            <div className="absolute inset-0">
              {orderedStack.map((card, stackIndex) => {
                const isCurrent = stackIndex === 0;
                const offset = stackIndex * 14;
                const scale = 1 - stackIndex * 0.01;
                const opacity = isCurrent ? 1 : Math.max(0.7, 1 - stackIndex * 0.2);
                const zIndex = total - stackIndex;

                return (
                  <motion.div
                    key={`${card.originalIndex}-${index}`}
                    initial={{ y: stackIndex > 0 ? offset + 4 : 0, opacity: 0.9 }}
                    animate={{
                      y: offset,
                      opacity,
                      scale,
                      transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    className="absolute left-0 right-0"
                    style={{ zIndex }}
                  >
                    <div className={`rounded-[22px] bg-white p-6 ${isCurrent ? "shadow-[0_30px_70px_rgba(8,15,52,0.12)]" : "shadow-[0_20px_40px_rgba(8,15,52,0.06)]"} ring-1 ring-black/5`}>
                      {isCurrent && (
                        <div className="absolute left-2 top-[-24px] hidden h-12 w-12 overflow-hidden rounded-full ring-4 ring-white md:block lg:left-[-24px]">
                          <div className="relative h-full w-full">
                            <Image 
                              src={card.avatar} 
                              alt="" 
                              fill
                              className="object-cover object-center" 
                              sizes="48px"
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[15px] font-semibold text-[#1E1D4C]">{card.name}</div>
                        <div className="text-[13px] text-[#5E6282]">{card.role}</div>
                      </div>
                      {isCurrent && (
                        <p className="mt-4 text-[14px] leading-6 text-zinc-600">{card.quote}</p>
                      )}
                      {!isCurrent && (
                        <p className="mt-4 line-clamp-2 text-[14px] leading-6 text-zinc-600">{card.quote}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
