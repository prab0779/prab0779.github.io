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
      "Values are for guidance purposes only and are not official. They change daily and are based on three key factors: Rarity, Demand, and Player Needs. This means an item's value can shift depending on how hard it is to obtain, how many players want it, and what it's worth to the person you're trading with. Trading is about negotiation and finding a deal both sides agree on. We also advise against relying on unofficial value lists made by players, as they often misrepresent true market value.",
  },
  {
    question: "How often are values updated?",
    answer:
      "We update our AOTR trading values daily to reflect current market conditions. Major value changes are tracked and displayed in our value changes section for transparency and market analysis.",
  },
  {
    question: "What items are included in the AOTR value list?",
    answer:
      "Our comprehensive AOTR item database includes over 200+ items from Attack on Titan Revolution, covering weapons, accessories, clothing, consumables, and rare collectibles. Each item includes detailed information about value, demand, rarity, and how to obtain it.",
  },
  {
    question: "How does the AOTR trade calculator work?",
    answer:
      "Our AOTR trade calculator allows you to add items you're sending and receiving, automatically calculating total values, tax costs (gem and gold), and net profit/loss. It helps ensure fair trades and prevents you from losing value in Attack on Titan Revolution exchanges.",
  },
  {
    question: "What do the demand ratings mean in AOTR?",
    answer:
      "Demand ratings (1–10) indicate how much players want specific items in Attack on Titan Revolution. Higher demand means items are more sought after and harder to obtain.",
  },
  {
    question: 'What does "Rate of Change" mean for AOTR items?',
    answer:
      "Rate of Change indicates whether an item's value is trending upward, downward, stable, or overpriced based on market behavior.",
  },
  {
    question: "How do taxes work in AOTR trading?",
    answer:
      "Some AOTR items require gem or gold taxes when trading. Our calculator automatically computes these costs so you know exactly what you'll pay.",
  },
  {
    question: "Can I suggest updates?",
    answer:
      "Yes! We welcome community feedback. Join our Discord to suggest value changes or report inaccurate information.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20">
      {/* Heading Section */}
      <div className="text-center mb-12">
        <span className="text-gray-400 tracking-wide uppercase text-sm">
          FAQs
        </span>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
          We’ve Got the Answers <br className="hidden sm:block" />
          You're Looking For
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          A list of commonly asked questions from our community.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-[#0d0d10] border border-gray-800 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-900 transition"
            >
              <span className="text-white font-medium text-base">
                {item.question}
              </span>

              <ChevronDown
                className={`w-5 h-5 text-gray-300 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <div className="px-6 py-4 bg-black border-t border-gray-800">
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
