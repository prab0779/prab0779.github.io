import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedItem } from "../Shared/AnimatedList";
import TextType from "../Shared/TextType";

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
      "Our comprehensive AOTR item database includes over 200+ items from Attack on Titan Revolution, covering weapons, accessories, clothing, consumables, and rare collectibles.",
  },
  {
    question: "How does the AOTR trade calculator work?",
    answer:
      "Our AOTR trade calculator allows you to add items you're sending and receiving, automatically calculating total values, tax costs, and net profit/loss.",
  },
  {
    question: "What do the demand ratings mean in AOTR?",
    answer:
      "Demand ratings (1–10) indicate how much players want specific items. Higher demand means items are more sought after.",
  },
  {
    question: 'What does "Rate of Change" mean?',
    answer:
      "Rate of Change indicates whether an item's value is trending upward, downward, stable, or overpriced.",
  },
  {
    question: "How do taxes work?",
    answer:
      "Some items require gem or gold taxes when trading. Our calculator automatically computes these costs.",
  },
  {
    question: "Can I suggest updates?",
    answer:
      "Yes! Join our Discord to suggest value changes or report inaccurate information.",
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-20">
      <div className="text-center mb-12">
        <p className="tracking-wide uppercase text-sm justify-center flex flex-wrap">
          {"FAQs".split("").map((char, i) => (
            <span key={i} className="silver-letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </p>

        <h2 className="text-3xl sm:text-4xl font-extrabold mt-3 drop-shadow-[0_0_6px_rgba(255,225,150,0.35)]">
          {"We’ve Got the Answers".split("").map((char, i) => (
            <span key={i} className="gold-letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h2>

        <p className="mt-4 max-w-xl mx-auto text-sm justify-center flex flex-wrap">
          {"A list of commonly asked questions from our community."
            .split(" ")
            .map((word, i, arr) => (
              <span key={i} className="silver-letter">
                {word}
                {i < arr.length - 1 && "\u00A0"}
              </span>
            ))}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqItems.map((item, index) => (
          <AnimatedItem key={index} index={index} delay={index * 0.05}>
            <div className="bg-[#0b0b0d] border border-gray-800 rounded-xl overflow-hidden shadow-[0_0_12px_rgba(255,220,150,0.05)] transition-all">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[rgba(255,220,150,0.05)] transition"
              >
                <span
                  className={`text-base font-medium transition-colors flex flex-wrap ${
                    openIndex === index
                      ? ""
                      : ""
                  }`}
                >
                  {item.question.split("").map((char, i) => (
                    <span
                      key={i}
                      className={
                        openIndex === index
                          ? "gold-letter"
                          : "gold-letter"
                      }
                    >
                      {char === " " ? "\u00A0" : char}
                    </span>
                  ))}
                </span>

                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openIndex === index
                      ? "rotate-180 text-[var(--gold-bright)]"
                      : "text-white-400"
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-black border-t border-gray-800">
                  <TextType
                    key={index + "-" + openIndex}
                    text={item.answer}
                    typingSpeed={20}
                    deletingSpeed={0}
                    pauseDuration={999999}
                    loop={false}
                    showCursor
                    cursorCharacter="|"
                    className="text-gray-300 text-sm leading-relaxed"
                  />
                </div>
              )}
            </div>
          </AnimatedItem>
        ))}
      </div>
    </div>
  );
};