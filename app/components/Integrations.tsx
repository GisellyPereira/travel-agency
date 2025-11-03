"use client";

import { Container } from "../components/Container";
import { motion } from "framer-motion";
import { SectionEyebrow } from "./SectionEyebrow";

const integrations = [
  { name: "Stripe", logo: "💳", desc: "Payment processing" },
  { name: "Google Maps", logo: "🗺️", desc: "Location services" },
  { name: "AWS", logo: "☁️", desc: "Cloud infrastructure" },
  { name: "SendGrid", logo: "📧", desc: "Email delivery" },
  { name: "Amadeus", logo: "✈️", desc: "Flight APIs" },
  { name: "Booking.com", logo: "🏨", desc: "Hotel inventory" },
];

export function Integrations() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <SectionEyebrow className="mb-2">Integrations</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            Seamless Integrations
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] text-[#5E6282]">
            Connect with the world's leading travel and payment platforms for a complete solution.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex flex-col items-center rounded-xl bg-white p-6 ring-1 ring-zinc-200 transition-all hover:ring-[#F1A501]/40"
            >
              <div className="mb-3 text-4xl">{integration.logo}</div>
              <div className="text-center">
                <div className="mb-1 text-[14px] font-semibold text-[#1E1D4C]">{integration.name}</div>
                <div className="text-[12px] text-zinc-500">{integration.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

