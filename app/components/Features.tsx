"use client";

import { Container } from "../components/Container";
import { motion } from "framer-motion";
import { SectionEyebrow } from "./SectionEyebrow";

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "AI-Powered Recommendations",
    desc: "Machine learning algorithms analyze your preferences to suggest perfect destinations and experiences tailored just for you.",
    color: "text-[#4B7BF5]",
    bgColor: "bg-[#4B7BF5]/10"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Secure Payment Gateway",
    desc: "Bank-level encryption and PCI-DSS compliance ensure your financial data is always protected with 256-bit SSL security.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: "Real-Time Booking System",
    desc: "Instant confirmation with live inventory updates. Book flights, hotels, and experiences in seconds with real-time availability.",
    color: "text-[#F1A501]",
    bgColor: "bg-[#F1A501]/10"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    title: "24/7 Live Support",
    desc: "Round-the-clock assistance via chat, phone, or email. Our AI-powered support handles common queries instantly, with human agents ready for complex issues.",
    color: "text-[#DF6951]",
    bgColor: "bg-[#DF6951]/10"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Global Coverage",
    desc: "Access to over 500+ destinations worldwide with partnerships across 100+ countries. Your next adventure is just a click away.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Lightning Fast Performance",
    desc: "Optimized platform with sub-200ms load times. Built on modern tech stack for seamless user experience across all devices.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <SectionEyebrow className="mb-2">Technology</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            Powered by Advanced Technology
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] text-[#5E6282]">
            We leverage cutting-edge technology to deliver seamless, secure, and intelligent travel solutions.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative rounded-2xl bg-white p-6 ring-1 ring-zinc-200 transition-all hover:ring-[#F1A501]/40"
            >
              <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="mb-2 font-volkhov text-lg font-extrabold text-[#1E1D4C]">{feature.title}</h3>
              <p className="text-[14px] leading-6 text-zinc-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

