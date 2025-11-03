"use client";

import { Container } from "../components/Container";
import { motion } from "framer-motion";
import { Button } from "../components/Button";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:pt-14 sm:pb-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl rounded-2xl bg-white p-8 sm:p-10 ring-1 ring-zinc-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <h3 className="font-volkhov text-[clamp(24px,5vw,36px)] font-extrabold leading-tight text-[#14183E]">
            Subscribe to get our latest updates
          </h3>
          <p className="mt-3 text-[14px] text-[#5E6282]">
            Get promotions, best destinations and tips straight to your inbox.
          </p>

          <form
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Subscribe newsletter"
          >
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Your email"
              className="h-12 w-full max-w-md rounded-xl border border-zinc-200 bg-white px-4 text-[14px] shadow-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-[#F1A501] focus:ring-2 focus:ring-[#F1A501]/20"
            />
            <Button className="h-12 rounded-xl px-6 shadow-lg shadow-[#F1A501]/30">Subscribe</Button>
          </form>
        </motion.div>
      </Container>
    </section>
  );
}
