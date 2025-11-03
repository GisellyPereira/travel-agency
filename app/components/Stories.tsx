"use client";

import { useEffect, useState } from "react";
import { Container } from "../components/Container";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionEyebrow } from "./SectionEyebrow";

const stats = [
  { 
    value: 250, 
    suffix: "k+", 
    label: "Happy Travelers", 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    color: "text-[#F1A501]",
    bgColor: "bg-[#F1A501]/10"
  },
  { 
    value: 500, 
    suffix: "+", 
    label: "Destinations", 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    color: "text-[#DF6951]",
    bgColor: "bg-[#DF6951]/10"
  },
  { 
    value: 98, 
    suffix: "%", 
    label: "Satisfaction Rate", 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: "text-[#F1A501]",
    bgColor: "bg-[#F1A501]/10"
  },
  { 
    value: 24, 
    suffix: "/7", 
    label: "Support Available", 
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
    color: "text-[#4B7BF5]",
    bgColor: "bg-[#4B7BF5]/10"
  },
];

function Counter({ end, suffix, delay = 0 }: { end: number; suffix: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, end, delay]);

  return (
    <span ref={ref} className="font-volkhov text-[clamp(40px,8vw,64px)] font-extrabold text-[#14183E]">
      {count}{suffix}
    </span>
  );
}

export function Stories() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <SectionEyebrow className="mb-2">Numbers that speak</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            Trusted by Travelers Worldwide
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] text-[#5E6282]">
            Real numbers from real travelers who trusted us with their dream trips.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="group rounded-2xl bg-white p-6 text-center ring-1 ring-zinc-200 transition-all hover:ring-[#F1A501]/40"
            >
              <div className={`mb-3 mx-auto flex h-14 w-14 items-center justify-center rounded-full ${stat.bgColor}`}>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
              <div className="mb-2">
                <Counter end={stat.value} suffix={stat.suffix} delay={i * 150} />
              </div>
              <div className="text-[13px] font-medium text-[#5E6282]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
