import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'What is Trading Corps.?',
    answer: 'Trading Corps. is the ultimate resource for Attack on Titan Revolution item values, featuring a comprehensive trade calculator, real-time market data, and an extensive item database to help players make informed trading decisions. Trading Corps. is a fan-made resource and is not affiliated with, sponsored by, or endorsed by Attack on Titan, its creators, or the Roblox game Attack on Titan Revolution'
  },
  {
    question: 'How accurate are the values?',
    answer: 'Our item values are updated regularly based on market trends, community feedback, and trading data to ensure the most accurate and current pricing information for Attack on Titan Revolution items.'
  },
  {
    question: 'Is the Trading Corps. calculator free?',
    answer: 'Yes! Trading Corps. is completely free to use. Our trade calculator, item database, and all features are available at no cost to help the Attack on Titan Revolution community.'
  },
  {
    question: 'How often are values updated?',
    answer: 'We update our AOTR trading values daily to reflect current market conditions. Major value changes are tracked and displayed in our value changes section for transparency and market analysis.'
  },
  {
    question: 'What items are included in the AOTR value list?',
    answer: 'Our comprehensive AOTR item database includes over 200+ items from Attack on Titan Revolution, covering weapons, accessories, clothing, consumables, and rare collectibles. Each item includes detailed information about value, demand, rarity, and how to obtain it.'
  },
  {
    question: 'How does the AOTR trade calculator work?',
    answer: 'Our AOTR trade calculator allows you to add items you\'re sending and receiving, automatically calculating total values, tax costs (gem and gold), and net profit/loss. It helps ensure fair trades and prevents you from losing value in Attack on Titan Revolution exchanges.'
  },
  {
    question: 'What do the demand ratings mean in AOTR?',
    answer: 'Demand ratings (1-10) indicate how much players want specific items in Attack on Titan Revolution. Higher demand (8-10) means items are highly sought after and may be harder to trade for. Lower demand (1-3) items are easier to obtain but may have less trading value.'
  },
  {
    question: 'What does "Rate of Change" mean for AOTR items?',
    answer: 'Rate of Change indicates market trends for AOTR items: "Rising" means values are increasing, "Falling" means decreasing, "Stable" means consistent pricing, and "Overpriced" suggests the item may be valued higher than market demand warrants.'
  },
  {
    question: 'How do taxes work in AOTR trading?',
    answer: 'Some AOTR items require gem or gold taxes when trading. Our calculator automatically computes these costs so you know exactly what you\'ll pay. Tax amounts vary by item rarity and type, with rarer items typically having higher tax requirements.'
  },
  {
    question: 'Can I suggest updates to AOTR item values?',
    answer: 'Yes! We welcome community feedback on AOTR item values. Join our Discord community to report value changes, suggest corrections, or discuss market trends with other Attack on Titan Revolution traders. Community input helps keep our database accurate and up-to-date.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 mx-4">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 transition-colors">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors duration-200"
              >
                <h3 className="text-sm sm:text-base font-semibold text-blue-400 pr-4">
                  {item.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-800 border-t border-gray-700 animate-in fade-in duration-200">
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
