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

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/bg.png')] opacity-20 pointer-events-none"></div>

      {/* ---------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-white mb-6">
          Attack on Titan Revolution{" "}
          <span className="text-blue-400">Value List</span>
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto mb-10">
          The most accurate and trusted AOT:R trading values.  
          Updated by experienced analysts, based on real trading activity.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <Link
            to="/calculator"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
          >
            Start Trading →
          </Link>

          <Link
            to="/value-list"
            className="px-6 py-3 rounded-lg bg-gray-800 text-gray-200 font-medium hover:bg-gray-700 transition border border-gray-700"
          >
            Browse Values
          </Link>
        </div>
      </section>

      {/* ---------------------------- */}
      {/* FEATURES GRID SECTION */}
      {/* ---------------------------- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          Trading Corps. Features
        </h2>
        <p className="text-gray-400 mb-10">
          Everything you need for successful Attack on Titan Revolution trading.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
  {[
    {
      title: "Real-Time Values",
      desc: "Live updated trading values with accurate market trends.",
      link: "/value-list",
    },
    {
      title: "Trade Ads",
      desc: "Post and browse trades from an active community.",
      link: "/trade-ads",
    },
    {
      title: "Smart Calculator",
      desc: "Analyze trades instantly and avoid losing value.",
      link: "/calculator",
    },
    {
      title: "Safe Trading",
      desc: "Avoid scams with verified logs and trusted guidance.",
      link: "/scam-logs",
    },
  ].map((feature, i) => (
    <Link
      to={feature.link}
      key={i}
      className="
        block
        bg-gray-900/40
        backdrop-blur-xl
        border border-gray-800
        rounded-2xl
        p-6
        shadow-lg
        transition
        hover:border-blue-500
        hover:bg-gray-900/60
        hover:shadow-blue-500/20
        hover:-translate-y-1
      "
    >
      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
        {feature.title}
      </h3>

      <p className="text-gray-400 text-sm mb-4">
        {feature.desc}
      </p>

      <span className="text-blue-400 hover:text-blue-300 font-medium text-sm">
        Explore →
      </span>
    </Link>
  ))}
</div>

      </section>

      {/* ---------------------------- */}
      {/* FAQ SECTION */}
      {/* ---------------------------- */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <FAQSection />
      </section>
    </div>
  );
};
