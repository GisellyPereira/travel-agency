"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "../components/Container";
import { SectionEyebrow } from "./SectionEyebrow";

type FAQItem = {
  question: string;
  answer: string;
};

const FAQ_DATA: FAQItem[] = [
  {
    question: "How does the best price guarantee work?",
    answer:
      "If you find the same trip package at a lower price within 24 hours of booking with us, we'll match that price and refund the difference. We're committed to offering you the best value for your travel investment.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and digital wallets. All payments are processed securely through encrypted channels to protect your information.",
  },
  {
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, our flexible cancellation policy allows you to cancel or modify most bookings. Cancellation terms vary by package type - free cancellations up to 48 hours before departure for most trips. Please check your specific booking details for exact terms.",
  },
  {
    question: "Is travel insurance included?",
    answer:
      "Yes, comprehensive travel insurance is included with all bookings. This covers trip cancellation, medical emergencies, lost luggage, and more. You'll receive full insurance details upon booking confirmation.",
  },
  {
    question: "How do I get support during my trip?",
    answer:
      "We provide 24/7 support via phone, email, and in-app chat. Our dedicated support team is available around the clock to assist with any issues, changes, or emergencies during your travels.",
  },
  {
    question: "Are your travel packages customizable?",
    answer:
      "Absolutely! We specialize in creating fully customized itineraries. Work with our travel specialists to tailor every aspect of your trip - from accommodations to activities, dining, and experiences - to match your preferences and budget.",
  },
];

function AccordionItem({ question, answer, isOpen, onClick, index }: { question: string; answer: string; isOpen: boolean; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={false}
      animate={{ backgroundColor: isOpen ? "#FFF9F0" : "#FFFFFF" }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-[#F1A501]/40"
    >
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-zinc-50/50"
        onClick={onClick}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="text-[15px] font-semibold text-[#1E1D4C] pr-4">{question}</span>
        <motion.span
          initial={false}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-zinc-500"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
            id={`faq-answer-${index}`}
          >
            <p className="px-6 pb-5 text-[14px] leading-6 text-[#5E6282]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24">
      <Container>
        <div className="text-center">
          <SectionEyebrow className="mb-2">FAQ</SectionEyebrow>
          <h2 className="font-volkhov text-[clamp(28px,6vw,40px)] font-extrabold leading-tight tracking-tight text-[#14183E]">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[14px] text-[#5E6282]">
            Everything you need to know about booking, traveling, and getting support with Jadoo.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mx-auto mt-12 max-w-3xl space-y-4"
        >
          {FAQ_DATA.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => toggleItem(index)}
              index={index}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

