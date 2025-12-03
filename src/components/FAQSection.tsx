import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "What is Aotr Values?",
    answer:
      "Aotr Values is the ultimate resource for Attack on Titan Revolution item values, featuring a comprehensive trade calculator, real-time market data, and an extensive item database to help players make informed trading decisions. Aotr Values is a fan-made resource and is not affiliated with, sponsored by, or endorsed by Attack on Titan, its creators, or the Roblox game Attack on Titan Revolution.",
  },
  {
    question: "How accurate are the values?",
    answer:
      "Our item values are updated regularly based on market trends, community feedback, and trading data to ensure the most accurate and current pricing information for Attack on Titan Revolution items.",
  },
  {
    question: "How are values determined?",
    answer:
      "Values are for guidance purposes only and are not official. They change daily and are based on three key factors: Rarity, Demand, and Player Needs.",
  },
  {
    question: "How often are values updated?",
    answer:
      "We update our AOTR trading values daily to reflect current market conditions.",
  },
  {
    question: "What items are included in the value list?",
    answer:
      "Our database includes 200+ items with value, demand, rarity, and obtainment info.",
  },
  {
    question: "How does the trade calculator work?",
    answer:
      "It automatically calculates totals, tax, and profit/loss.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20">

      {/* Heading */}
      <div className="text-center mb-12">
        <span className="tracking-wide uppercase text-sm text-[var(--gold-soft)]">
          FAQs
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--gold-bright)] mt-3 drop-shadow-[0_0_6px_rgba(255,225,150,0.35)]">
          We’ve Got the Answers
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          A list of commonly asked questions from our community.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-[#0b0b0d] border border-gray-800 rounded-xl overflow-hidden shadow-[0_0_12px_rgba(255,220,150,0.05)] transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[rgba(255,220,150,0.05)] transition"
            >
              <span className="text-[var(--gold-soft)] text-base font-medium">
                {item.question}
              </span>

              <ChevronDown
                className={`w-5 h-5 text-[var(--gold-soft)] transition-transform duration-300 ${
                  openIndex === index ? "rotate-180 text-[var(--gold-bright)]" : ""
                }`}
              />
            </button>

            {/* Answer */}
            {openIndex === index && (
              <div
                className="px-6 py-4 bg-black border-t border-gray-800 animate-fade-in"
                style={{ animationDuration: "0.35s" }}
              >
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
