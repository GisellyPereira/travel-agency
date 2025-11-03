"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../components/Container";

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white py-12 sm:py-16">
      <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="font-volkhov text-2xl font-extrabold text-[#14183E]">Jadoo</div>
          <p className="mt-3 max-w-xs text-[14px] leading-6 text-[#5E6282]">
            Book your trip in minutes, get full control for much longer. Trusted by over 250,000 travelers worldwide.
          </p>
          <div className="mt-4">
            <div className="text-[12px] font-medium text-zinc-500 mb-2">Security & Compliance:</div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-8 items-center gap-1.5 rounded border border-zinc-200 bg-white px-2.5 text-[10px] font-medium text-zinc-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                SSL 256-bit
              </div>
              <div className="flex h-8 items-center gap-1.5 rounded border border-zinc-200 bg-white px-2.5 text-[10px] font-medium text-zinc-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                PCI-DSS
              </div>
              <div className="flex h-8 items-center gap-1.5 rounded border border-zinc-200 bg-white px-2.5 text-[10px] font-medium text-zinc-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                  <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                </svg>
                GDPR
              </div>
            </div>
            <div className="mt-3 text-[11px] text-zinc-400">
              <span className="inline-flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Fast & Reliable
              </span>
              <span className="mx-2">·</span>
              <span>99.9% Uptime</span>
              <span className="mx-2">·</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mb-4 text-[15px] font-semibold text-[#1E1D4C]">Company</div>
          <ul className="space-y-3 text-[14px] text-[#5E6282]">
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">About</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Mobile</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Blog</Link></li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="mb-4 text-[15px] font-semibold text-[#1E1D4C]">Contact</div>
          <ul className="space-y-3 text-[14px] text-[#5E6282]">
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Help/FAQ</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Press</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Affiliates</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Partners</Link></li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="mb-4 text-[15px] font-semibold text-[#1E1D4C]">More</div>
          <ul className="space-y-3 text-[14px] text-[#5E6282]">
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Travel Guides</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Travel Tips</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Airline Fees</Link></li>
            <li><Link href="#" className="hover:text-[#F1A501] transition-colors">Low Fare Tips</Link></li>
          </ul>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-10 border-t border-zinc-100 pt-6"
      >
        <Container className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row">
          <p className="text-[12px] text-[#5E6282]">
            © {new Date().getFullYear()} Jadoo. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-[#5E6282]">
            <Link href="#" className="hover:text-[#F1A501] transition-colors">Privacy Policy</Link>
            <span className="text-zinc-300">•</span>
            <Link href="#" className="hover:text-[#F1A501] transition-colors">Terms of Service</Link>
            <span className="text-zinc-300">•</span>
            <Link href="#" className="hover:text-[#F1A501] transition-colors">Cookies</Link>
          </div>
        </Container>
      </motion.div>
    </footer>
  );
}
