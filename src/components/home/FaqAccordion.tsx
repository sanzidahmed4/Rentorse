"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Is Rentorce free for prospective renters?",
    a: "Yes, 100% free! We never charge renters fees to browse, match, or schedule tours. Property managers and leasing companies coordinate directly with you.",
  },
  {
    q: "Can I search for apartments anywhere in the United States?",
    a: "Yes. You can enter any city, state, or 5-digit US ZIP code (such as NY 11004, Chicago 60007, 78701, etc.). Our matching algorithm calibrates relevant listings tailored to your target location.",
  },
  {
    q: "Are the apartment prices guaranteed?",
    a: "All displayed rents are calibrated based on your target budget range and current community availability. Official lease agreements are finalized with the property manager upon approval.",
  },
  {
    q: "What if I have pets or special amenity needs?",
    a: "Our 8-step matching quiz asks specifically about pet types (dogs, cats) and desired amenities like in-unit laundry, parking, pool, or gym. We only show listings that welcome your lifestyle.",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="space-y-3.5">
      {FAQ_ITEMS.map((faq, idx) => {
        const isOpen = openIndex === idx;

        return (
          <div
            key={idx}
            className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
              isOpen
                ? "border-blue-300/80 bg-blue-50/30 shadow-md shadow-blue-500/5 ring-1 ring-blue-500/10"
                : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleItem(idx)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isOpen
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-200/70 text-slate-600"
                  }`}
                >
                  Q{idx + 1}
                </span>
                <span
                  className={`font-bold text-base sm:text-lg transition-colors ${
                    isOpen ? "text-blue-600" : "text-slate-900"
                  }`}
                >
                  {faq.q}
                </span>
              </div>

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen
                    ? "bg-blue-100 text-blue-600 rotate-180"
                    : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: "auto",
                    opacity: 1,
                    transition: {
                      height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.25, delay: 0.1 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.15 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-blue-100/60 pl-14 sm:pl-16">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
