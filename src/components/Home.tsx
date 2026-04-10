import React from "react";
import { Link } from "react-router-dom";
import { Item } from "../types/Item";
import { FAQSection } from "./FAQSection";
import { VideoSlider } from "./VideoSlider";
import { StockRestocker } from "../components/StockRestocker";
import { LineChart, Sparkles, Calculator, Shield } from "lucide-react";
import { ShapeGrid } from "./shared/ShapeGrid"; 

interface HomeProps {
  items: Item[];
}

export const Home: React.FC<HomeProps> = ({ items }) => {
  return (
    <div className="relative">

      {/* 🔥 SHAPE GRID BACKGROUND */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ShapeGrid
          speed={0.4}
          squareSize={40}
          direction="diagonal"
          borderColor="#271E37"
          hoverFillColor="#222222"
          shape="square"
          hoverTrailAmount={0}
        />
      </div>

      {/* 🔥 DARK FADE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060010]/80 via-transparent to-[#060010] z-[1]" />

      {/* MAIN CONTENT */}
      <div className="relative z-10">

        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 pt-[240px] md:pt-[320px] pb-[160px] md:pb-[220px] grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* TEXT */}
          <div className="text-center lg:text-left space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--gold-soft)] mb-2">
                AOT:R Trading Hub
              </p>

              <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--gold-bright)] leading-tight drop-shadow-lg">
                AOT:R <span className="text-[var(--gold-soft)]">Values</span>
              </h1>

              <div className="h-0.5 w-20 bg-gradient-to-r from-[var(--gold-soft)] via-[var(--gold-bright)] to-transparent rounded-full mt-3 mx-auto lg:mx-0" />

              <p className="text-gray-300 text-base md:text-lg max-w-md mt-4 mx-auto lg:mx-0">
                The ultimate hub for Attack on Titan Revolution trading.
                Discover values, analyze trades, and browse verified trade ads —
                all in one place.
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

            {/* ICONS */}
            <div className="flex justify-center lg:justify-start gap-4 pt-3">
              {/* X */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-blue-500/60 text-white hover:border-blue-400 hover:bg-blue-500/10 transition"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-7-6.1 7H1.7l8.1-9.2L1 2h6.9l4.8 6.4L18.9 2Zm-2.4 18h1.9L7.4 4H5.4l11.1 16Z" />
                </svg>
              </a>

              {/* Roblox */}
              <a
                href="https://www.roblox.com/games/13379208636/Attack-on-Titan-Revolution"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-[#D4AF37]/70 text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M6 2 2 18l16 4 4-16L6 2Zm6.2 6.2 3.6.9-.9 3.6-3.6-.9.9-3.6Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto w-full max-w-sm md:max-w-md lg:max-w-full">
            <div className="absolute -inset-6 rounded-3xl bg-[var(--gold-bright)] opacity-10 blur-3xl pointer-events-none" />
            <div className="relative rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.7)] border border-[rgba(255,220,150,0.15)] bg-black/40 backdrop-blur">
              <img
                src="/hero.png"
                alt="AOTR Hero"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </section>

        {/* KEEP REST SAME */}
        {/* (everything below unchanged) */}

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold-soft)] to-transparent opacity-25 mb-10 md:mb-14" />
        </div>

        <section className="relative max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
          <VideoSlider />
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14">
          <StockRestocker />
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-12">
          {/* features... unchanged */}
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-16">
          <FAQSection />
        </section>

      </div>
    </div>
  );
};