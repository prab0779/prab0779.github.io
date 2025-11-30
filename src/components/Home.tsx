import React from "react";
import { Link } from "react-router-dom";
import { Item } from "../types/Item";
import { FAQSection } from "./FAQSection";
import { VideoSlider } from "./VideoSlider";

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  return (
    <div className="relative">

      {/* LIGHT GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>

      {/* ------------------------------------------------ */}
      {/* HERO SECTION — MOBILE OPTIMIZED / NO EXTRA SPACE */}
      {/* ------------------------------------------------ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* TEXT */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            AOT:R <span className="text-blue-400">Values</span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-md mt-4 mx-auto lg:mx-0">
            The ultimate hub for Attack on Titan Revolution trading.  
            Discover real-time values, analyze trades, and browse community trade ads.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
            <Link
              to="/trade-ads"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
            >
              Start Trading →
            </Link>

            <Link
              to="/value-list"
              className="px-6 py-3 rounded-xl bg-gray-800 text-gray-200 font-medium hover:bg-gray-700 transition border border-gray-700"
            >
              Values ★
            </Link>
          </div>
        </div>

        {/* HERO IMAGE — MOBILE OPTIMIZED */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-full">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-800 bg-black/40 backdrop-blur">
            <img
              src="/hero.png"
              alt="AOTR Hero"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </section>

      {/* ------------------------------- */}
      {/* VIDEO HIGHLIGHTS (NEW SECTION) */}
      {/* ------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          Popular Highlights
        </h2>

        <VideoSlider />
      </section>

      {/* ------------------------------- */}
      {/* FEATURES SECTION */}
      {/* ------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <h2 className="text-3xl font-bold text-white mb-3">AOTR Values Features</h2>
        <p className="text-gray-400 mb-10 text-sm md:text-base">
          Everything you need for successful Attack on Titan Revolution trading.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              title: "Real-Time Values",
              desc: "Live updated trading values with accurate market metrics.",
              link: "/value-list"
            },
            {
              title: "Trade Ads",
              desc: "Post and browse offers from active traders.",
              link: "/trade-ads"
            },
            {
              title: "Smart Calculator",
              desc: "Analyze trades instantly and avoid losing value.",
              link: "/calculator"
            },
            {
              title: "Safe Trading",
              desc: "Avoid scams with verified scam logs.",
              link: "/scam-logs"
            }
          ].map((feature, i) => (
            <Link
              to={feature.link}
              key={i}
              className="block bg-gray-900/40 backdrop-blur-xl border border-gray-800
                         rounded-2xl p-5 md:p-6 shadow-lg transition
                         hover:border-blue-500 hover:bg-gray-900/60 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm mb-3">{feature.desc}</p>
              <span className="text-blue-400 text-sm">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------- */}
      {/* FAQ */}
      {/* ------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-16">
        <FAQSection />
      </section>
    </div>
  );
};
