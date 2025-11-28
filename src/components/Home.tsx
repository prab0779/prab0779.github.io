import React from "react";
import { Link } from "react-router-dom";
import { Item } from "../types/Item";
import { FAQSection } from "./FAQSection";

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  return (
    <div className="relative">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none"></div>

      {/* -------------------------------------- */}
      {/* HERO SECTION — EXACT LAYOUT LIKE IMAGE */}
      {/* -------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE — TEXT */}
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            AOT:R <span className="text-blue-400">Values</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-lg mt-6">
            The ultimate hub for Attack on Titan Revolution trading.  
            Discover real-time values, analyze trades, and browse community trade ads.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/calculator"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              Start Trading →
            </Link>

            <Link
              to="/value-list"
              className="px-6 py-3 rounded-xl bg-gray-800 text-gray-200 font-medium hover:bg-gray-700 transition border border-gray-700 flex items-center gap-2"
            >
              Values ★
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE — IMAGE CARD */}
        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-800 bg-black/40 backdrop-blur">
            <img
              src="/hero.png"
              alt="AOTR Hero"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Floating badge top-right */}
          <Link
            to="/calculator"
            className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl text-white px-4 py-2 rounded-xl shadow-lg border border-gray-700"
          >
            <span className="font-medium">Calculator</span>
            <div className="text-xs text-gray-400">Smart trade analysis</div>
          </Link>

          {/* Floating badge bottom-left */}
          <Link
            to="/trade-ads"
            className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2"
          >
            → Trade Ads
          </Link>
        </div>

      </section>

      {/* -------------------------------------- */}
      {/* FEATURES SECTION */}
      {/* -------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white mb-6">Trading Corps. Features</h2>
        <p className="text-gray-400 mb-10">
          Everything you need for successful Attack on Titan Revolution trading.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              title: "Real-Time Values",
              desc: "Live updated trading values with accurate market metrics.",
              link: "/value-list",
            },
            {
              title: "Trade Ads",
              desc: "Post and browse offers from active traders.",
              link: "/trade-ads",
            },
            {
              title: "Smart Calculator",
              desc: "Analyze trades instantly and avoid losing value.",
              link: "/calculator",
            },
            {
              title: "Safe Trading",
              desc: "Avoid scams with verified scam logs.",
              link: "/scam-logs",
            },
          ].map((feature, i) => (
            <Link
              to={feature.link}
              key={i}
              className="
                block bg-gray-900/40 backdrop-blur-xl border border-gray-800
                rounded-2xl p-6 shadow-lg transition
                hover:border-blue-500 hover:bg-gray-900/60 hover:-translate-y-1
              "
            >
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{feature.desc}</p>
              <span className="text-blue-400">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* -------------------------------------- */}
      {/* FAQ SECTION */}
      {/* -------------------------------------- */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <FAQSection />
      </section>
    </div>
  );
};
