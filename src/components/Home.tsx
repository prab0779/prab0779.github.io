import React from "react";
import { Link } from "react-router-dom";
import { Item } from "../types/Item";
import { FAQSection } from "./FAQSection";
import { VideoSlider } from "./VideoSlider";
import { StockRestocker } from "../components/StockRestocker";
import { LineChart, Sparkles, Calculator, Shield } from "lucide-react";

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  // TODO: replace with your real invite
  const DISCORD_INVITE = "https://discord.gg/YOURCODE";

  return (
    <div className="relative">
      {/* GOLD GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[url('/gridd.svg')] opacity-10 mix-blend-soft-light pointer-events-none" />

      {/* MAIN CONTENT */}
      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* TEXT */}
          <div className="text-center lg:text-left space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--gold-soft)] mb-2">
                AOT:R Trading Hub
              </p>

              {/* TITLE ROW + DISCORD BUTTON (DESKTOP ONLY) */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--gold-bright)] leading-tight drop-shadow-lg">
                    AOT:R <span className="text-[var(--gold-soft)]">Values</span>
                  </h1>

                  <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold-bright)] to-transparent rounded-full mt-3 mx-auto lg:mx-0" />
                </div>

                {/* Desktop-only (NOT on mobile topbar) */}
                <a
                  href={DISCORD_INVITE}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl
                    bg-[#0b0b10]/70 backdrop-blur
                    border border-[rgba(255,220,150,0.22)]
                    shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                    text-[var(--gold-bright)] font-semibold
                    hover:border-[var(--gold-bright)] hover:bg-[#12121a]
                    hover:-translate-y-0.5 active:translate-y-0 transition"
                >
                  {/* Discord icon (SVG, no image) */}
                  <span
                    className="grid place-items-center w-8 h-8 rounded-lg
                      bg-gradient-to-br from-[var(--gold-bright)] to-[var(--gold-soft)]
                      text-black shadow-inner"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M19.54 6.83A16.4 16.4 0 0 0 15.7 5.5c-.18.33-.38.77-.52 1.12a15.2 15.2 0 0 0-4.37 0c-.14-.35-.35-.79-.53-1.12A16.2 16.2 0 0 0 6.46 6.83C4.1 10.3 3.46 13.68 3.78 17c1.56 1.16 3.06 1.87 4.54 2.34.36-.5.68-1.03.96-1.6-.52-.2-1.02-.45-1.5-.74.13-.1.25-.2.37-.3 2.9 1.36 6.04 1.36 8.9 0 .12.1.25.2.37.3-.48.29-.98.54-1.5.74.28.57.6 1.1.96 1.6 1.48-.47 2.98-1.18 4.54-2.34.38-3.88-.65-7.23-2.46-10.17ZM9.35 14.7c-.87 0-1.58-.8-1.58-1.79 0-.98.7-1.78 1.58-1.78s1.6.8 1.58 1.78c0 .99-.7 1.79-1.58 1.79Zm5.3 0c-.87 0-1.58-.8-1.58-1.79 0-.98.7-1.78 1.58-1.78s1.6.8 1.58 1.78c0 .99-.7 1.79-1.58 1.79Z" />
                    </svg>
                  </span>
                  <span className="tracking-wide">Discord</span>
                </a>
              </div>

              <p className="text-gray-300 text-base md:text-lg max-w-md mt-4 mx-auto lg:mx-0">
                The ultimate hub for Attack on Titan Revolution trading. Discover
                values, analyze trades, and browse verified trade ads — all in
                one place.
              </p>

              {/* Mobile-only note (puts Discord in NAV only, so give a tiny hint here if you want) */}
              <p className="md:hidden text-xs text-gray-400 mt-3">
                Join the Discord from the menu.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center lg:justify-start">
              <Link
                to="/trade-ads"
                className="px-6 py-3 rounded-xl 
                  bg-[var(--gold-bright)] text-black font-semibold 
                  hover:bg-[var(--gold-soft)] transition 
                  shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Start Trading →
              </Link>

              <Link
                to="/value-list"
                className="px-6 py-3 rounded-xl 
                  bg-[#111] text-[var(--gold-soft)] font-medium 
                  hover:bg-[#1a1a1a] transition border border-gray-700
                  hover:border-[var(--gold-bright)] hover:-translate-y-0.5"
              >
                View Values ★
              </Link>
            </div>

            {/* QUICK STATS / BADGES */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <div className="px-3 py-1.5 rounded-full bg-black/40 border border-gray-800 text-xs text-gray-300">
                Community-driven & frequently updated
              </div>
              <div className="px-3 py-1.5 rounded-full bg-black/40 border border-gray-800 text-xs text-gray-300">
                Trade safer • Value smarter
              </div>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-full">
            <div className="absolute -inset-6 rounded-3xl bg-[var(--gold-bright)] opacity-10 blur-3xl pointer-events-none" />
            <div className="relative rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.7)] border border-[rgba(255,220,150,0.15)] bg-black/40 backdrop-blur">
              <img src="/hero.png" alt="AOTR Hero" className="w-full h-auto object-cover" />
            </div>
          </div>
        </section>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent opacity-25 mb-10 md:mb-14" />
        </div>

        {/* VIDEO HIGHLIGHTS */}
        <section className="relative max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--gold-bright)]">
                Popular Highlights
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                AOT:R clips, updates and moments from the community.
              </p>
            </div>
          </div>

          <div className="relative">
            {/* Side fades for premium look */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#090A0F] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#090A0F] to-transparent" />

            <VideoSlider />
          </div>
        </section>

        {/* DIVIDER */}
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent opacity-20 mb-10 md:mb-14" />
        </div>

        {/* STOCK RESTOCKER SECTION */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--gold-bright)]">
                Stock Restocker
              </h2>
              <p className="text-gray-400 text-sm md:text-base mt-1">
                Track limited-time stocks and cosmetics so you never miss out.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-gray-800 text-xs text-gray-300">
              <Sparkles className="w-4 h-4 text-[var(--gold-bright)]" />
              Live restocks for active traders
            </span>
          </div>

          <div className="rounded-2xl bg-[#050509]/80 border border-[rgba(255,220,150,0.18)] shadow-[0_0_35px_rgba(0,0,0,0.7)] p-4 md:p-5">
            <StockRestocker />
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-12">
          <h2 className="text-3xl font-bold text-[var(--gold-bright)] mb-2">
            AOT:R Values Features
          </h2>
          <p className="text-gray-400 mb-8 text-sm md:text-base max-w-xl">
            Everything you need for successful Attack on Titan Revolution trading —
            from accurate values to smarter tools and safer deals.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            <Link
              to="/value-list"
              className="group block bg-[#111]/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 md:p-6 
                shadow-lg transition-transform duration-200 hover:border-[var(--gold-bright)] hover:bg-[#1a1a1a] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <LineChart className="w-8 h-8 text-[var(--gold-bright)] opacity-90" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-soft)]">
                  Values
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--gold-bright)] mb-1">
                Real-Time Values
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Manually curated values based on active trades, demand and market trends.
              </p>
              <span className="text-[var(--gold-soft)] text-sm group-hover:text-[var(--gold-bright)]">
                Open value list →
              </span>
            </Link>

            <Link
              to="/trade-ads"
              className="group block bg-[#111]/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 md:p-6 
                shadow-lg transition-transform duration-200 hover:border-[var(--gold-bright)] hover:bg-[#1a1a1a] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <Sparkles className="w-8 h-8 text-[var(--gold-bright)] opacity-90" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-soft)]">
                  Trading
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--gold-bright)] mb-1">
                Trade Ads
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Post your offers and find traders looking for the exact items you have.
              </p>
              <span className="text-[var(--gold-soft)] text-sm group-hover:text-[var(--gold-bright)]">
                Browse trade ads →
              </span>
            </Link>

            <Link
              to="/calculator"
              className="group block bg-[#111]/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 md:p-6 
                shadow-lg transition-transform duration-200 hover:border-[var(--gold-bright)] hover:bg-[#1a1a1a] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <Calculator className="w-8 h-8 text-[var(--gold-bright)] opacity-90" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-soft)]">
                  Tools
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--gold-bright)] mb-1">
                Smart Trade Calculator
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Compare offers, calculate total value on both sides and avoid one-sided trades.
              </p>
              <span className="text-[var(--gold-soft)] text-sm group-hover:text-[var(--gold-bright)]">
                Use calculator →
              </span>
            </Link>

            <Link
              to="/scam-logs"
              className="group block bg-[#111]/70 backdrop-blur-xl border border-gray-800 rounded-2xl p-5 md:p-6 
                shadow-lg transition-transform duration-200 hover:border-[var(--gold-bright)] hover:bg-[#1a1a1a] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <Shield className="w-8 h-8 text-[var(--gold-bright)] opacity-90" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold-soft)]">
                  Safety
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--gold-bright)] mb-1">
                Safer Trading
              </h3>
              <p className="text-gray-400 text-sm mb-3">
                Check scam logs and stay away from flagged users before you trade.
              </p>
              <span className="text-[var(--gold-soft)] text-sm group-hover:text-[var(--gold-bright)]">
                View scam logs →
              </span>
            </Link>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-16">
          <FAQSection />
        </section>
      </div>
    </div>
  );
};
