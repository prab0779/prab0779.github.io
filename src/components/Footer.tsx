import React from 'react';
import { ExternalLink, Mail, Home, List, Calculator, History, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitText from "../Shared/SplitText";
import BlurText from "../Shared/BlurText";

export const Footer: React.FC = () => {
  return (
    <footer
      className="
      relative 
      bg-gradient-to-b from-[#0A0A0A] to-black
      border-t border-[var(--gold-soft)]/20
      rounded-t-3xl
      shadow-[0_-10px_25px_rgba(255,215,100,0.05)]
      mt-16
    "
    >
      {/* Glow line */}
      <div className="absolute -top-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-bright)] to-transparent opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-4">
              <SplitText
                text="AOT:R Value Hub"
                tag="h2"
                enabled={false}
                textAlign="left"
                className="text-xl font-bold text-[var(--gold-bright)]"
              />
            </div>

            <BlurText
              text="aotrvalue.com is a 3rd party site not affiliated with Attack on Titan Revolution or Roblox."
              enabled={false}
              className="text-gray-400 text-sm leading-relaxed max-w-xs"
            />
          </div>

          {/* Navigation */}
          <div>
            <SplitText
              text="Navigation"
              tag="h3"
              enabled={false}
              textAlign="left"
              className="text-[var(--gold-bright)] font-semibold text-sm mb-3"
            />

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Home className="w-4 h-4" />
                  <BlurText text="Home" enabled={false} />
                </Link>
              </li>
              <li>
                <Link to="/value-list" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <List className="w-4 h-4" />
                  <BlurText text="Value List" enabled={false} />
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Calculator className="w-4 h-4" />
                  <BlurText text="Calculator" enabled={false} />
                </Link>
              </li>
              <li>
                <Link to="/value-changes" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <History className="w-4 h-4" />
                  <BlurText text="Value Changes" enabled={false} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <SplitText
              text="Community"
              tag="h3"
              enabled={false}
              textAlign="left"
              className="text-[var(--gold-bright)] font-semibold text-sm mb-3"
            />

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/trade-ads" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Shield className="w-4 h-4" />
                  <BlurText text="Trade Ads" enabled={false} />
                </Link>
              </li>
              <li>
                <Link to="/scam-logs" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Shield className="w-4 h-4" />
                  <BlurText text="Scam Logs" enabled={false} />
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <BlurText text="Discord" enabled={false} />
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <SplitText
              text="Support"
              tag="h3"
              enabled={false}
              textAlign="left"
              className="text-[var(--gold-bright)] font-semibold text-sm mb-3"
            />

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition"
                >
                  <Mail className="w-4 h-4" />
                  <BlurText text="Contact Us" enabled={false} />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-5 flex flex-col sm:flex-row items-center justify-between text-center gap-3">
          <BlurText
            text="© 2026 AOT:R Value Hub — Not affiliated with AoT:R or Roblox."
            enabled={false}
            className="text-gray-500 text-xs sm:text-sm"
          />
        </div>

      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="
          fixed bottom-6 right-6
          bg-[var(--gold-bright)]
          text-black
          p-3 rounded-full
          shadow-[0_0_12px_rgba(255,215,100,0.6)]
          hover:scale-105 active:scale-95
          transition-all
        "
      >
        ↑
      </button>

    </footer>
  );
};
