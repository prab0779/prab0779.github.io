import React from "react";
import { Link } from "react-router-dom";
import { Item } from "../types/Item";
import { FAQSection } from "./FAQSection";
import { VideoSlider } from "./VideoSlider";
import { StockRestocker } from "../components/StockRestocker";

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  return (
    <div className="relative">

      {/* GOLD GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/gridd.svg')] opacity-10 pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* TEXT */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--gold-bright)] leading-tight drop-shadow-lg">
            AOT:R <span className="text-[var(--gold-soft)]">Values</span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-md mt-4 mx-auto lg:mx-0">
            The ultimate hub for Attack on Titan Revolution trading.
            Discover values, analyze trades, and browse verified trade ads.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
            <Link
              to="/trade-ads"
              className="px-6 py-3 rounded-xl 
              bg-[var(--gold-bright)] text-black font-medium 
              hover:bg-[var(--gold-soft)] transition shadow-lg shadow-[rgba(255,220,150,0.3)]"
            >
              Start Trading →
            </Link>

            <Link
              to="/value-list"
              className="px-6 py-3 rounded-xl 
              bg-[#111] text-[var(--gold-soft)] font-medium 
              hover:bg-[#1a1a1a] transition border border-gray-700"
            >
              Values ★
            </Link>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-full">
          <div className="rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(255,220,150,0.15)] border border-[rgba(255,220,150,0.15)] bg-black/40 backdrop-blur">
            <img
              src="/hero.png"
              alt="AOTR Hero"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

      </section>

      {/* VIDEO HIGHLIGHTS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--gold-bright)] mb-4">
          Popular Highlights
        </h2>

        <VideoSlider />
      </section>

      {/* STOCK RESTOCKER */}
      <StockRestocker />

      {/* FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h2 className="text-3xl font-bold text-[var(--gold-bright)] mb-3">
          AOTR Values Features
        </h2>
        <p className="text-gray-400 mb-8 text-sm md:text-base">
          Everything you need for successful Attack on Titan Revolution trading.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { title: "Real-Time Values", desc: "Live updated trading values with accurate market metrics.", link: "/value-list" },
            { title: "Trade Ads", desc: "Post and browse offers from active traders.", link: "/trade-ads" },
            { title: "Smart Calculator", desc: "Analyze trades instantly and avoid losing value.", link: "/calculator" },
            { title: "Safe Trading", desc: "Avoid scams with verified scam logs.", link: "/scam-logs" }
          ].map((feature, i) => (
            <Link
              to={feature.link}
              key={i}
              className="block bg-[#111]/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 md:p-6 
              shadow-lg transition hover:border-[var(--gold-bright)] hover:bg-[#1a1a1a] hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold text-[var(--gold-bright)] mb-1">{feature.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{feature.desc}</p>
              <span className="text-[var(--gold-soft)] text-sm">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <FAQSection />
      </section>

    </div>
  );
};
