"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "../components/Container";
import { SectionEyebrow } from "./SectionEyebrow";

function Step({ color, title, desc, variant }: { color: string; title: string; desc: string; variant: "destination" | "payment" | "airport" }) {
  return (
    <div className="flex items-start gap-4">
      <span className={`flex h-10 w-10 min-w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 md:h-12 md:w-12 ${color} text-white flex-shrink-0`}>
        {variant === "destination" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.7"/>
            <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.7"/>
          </svg>
        )}
        {variant === "payment" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.7"/>
            <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.7"/>
            <rect x="6" y="13" width="6" height="2.5" rx="1.2" fill="currentColor"/>
          </svg>
        )}
        {variant === "airport" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M2 12l20-7-4 7 4 7-20-7z" stroke="currentColor" strokeWidth="1.7"/>
            <path d="M12 12v7" stroke="currentColor" strokeWidth="1.7"/>
          </svg>
        )}
      </span>
      <div>
        <div className="mb-1 text-[15px] font-semibold text-[#1E1D4C]">{title}</div>
        <p className="text-[14px] leading-6 text-zinc-600">{desc}</p>
      </div>
    </div>
  );
}

export function Steps() {
  return (
    <section className="relative overflow-x-hidden bg-white py-16 sm:py-24">
      {/* decoração lateral */}
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 z-0 hidden -translate-y-1/2 lg:block lg:right-[-32px] xl:right-[-40px] 2xl:right-[-48px]">
        <div className="relative w-[400px] aspect-[1.05/1] lg:w-[520px] xl:w-[680px] 2xl:w-[820px]">
          <Image src="/card-decor.svg" alt="" fill className="object-contain" priority />
        </div>
      </div>

      <Container className="grid items-start gap-10 md:gap-12 lg:grid-cols-2">
        {/* Texto à esquerda */}
        <div>
          <SectionEyebrow className="mb-3">Easy and Fast</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            Book Your Next Trip
            <br />
            In 3 Easy Steps
          </h2>
          <p className="mt-3 text-[14px] text-[#5E6282]">
            Our streamlined process powered by smart automation makes booking faster than ever.
          </p>

          <div className="mt-6 flex flex-col gap-6 sm:mt-7 sm:gap-7">
            <Step
              color="bg-[#F1A501]"
              title="Choose Destination"
              desc="Browse 500+ destinations with AI-powered recommendations. Filter by budget, weather, interests, and get instant availability across all dates."
              variant="destination"
            />
            <Step
              color="bg-[#DF6951]"
              title="Secure Payment"
              desc="Multiple payment options with instant processing. SSL encrypted transactions, saved payment methods for faster checkout, and flexible installment plans available."
              variant="payment"
            />
            <Step
              color="bg-[#4B7BF5]"
              title="Digital Confirmation"
              desc="Receive instant booking confirmation via email and SMS. Access your digital itinerary with QR codes, mobile check-in, and real-time flight updates."
              variant="airport"
            />
          </div>
        </div>

        {/* Apenas a decoração lateral solicitada (sem card) */}
      </Container>
    </section>
  );
}
