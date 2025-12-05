import React from 'react';
import { ExternalLink, Mail, Home, List, Calculator, History, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

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

      {/* Ambient gold glow line */}
      <div className="absolute -top-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-bright)] to-transparent opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* GRID */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-4
            gap-10
          "
        >

          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl text-[var(--gold-bright)] drop-shadow-[0_0_6px_rgba(255,215,100,0.6)]">⚔️</span>
              <h2 className="text-xl font-bold text-[var(--gold-bright)]">AOT:R Value Hub</h2>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              aotrvalue.com is a 3rd party site not affiliated with Attack on Titan Revolution or Roblox.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[var(--gold-bright)] font-semibold text-sm mb-3 drop-shadow-[0_0_4px_rgba(255,215,100,0.4)]">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all">
                  <Home className="w-4 h-4" /> Home
                </Link>
              </li>
              <li>
                <Link to="/value-list" className="flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all">
                  <List className="w-4 h-4" /> Value List
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all">
                  <Calculator className="w-4 h-4" /> Calculator
                </Link>
              </li>
              <li>
                <Link to="/value-changes" className="flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all">
                  <History className="w-4 h-4" /> Value Changes
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-[var(--gold-bright)] font-semibold text-sm mb-3 drop-shadow-[0_0_4px_rgba(255,215,100,0.4)]">
              Community
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/trade-ads" className="flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all">
                  <Shield className="w-4 h-4" /> Trade Ads
                </Link>
              </li>
              <li>
                <Link to="/scam-logs" className="flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all">
                  <Shield className="w-4 h-4" /> Scam Logs
                </Link>
              </li>
              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all"
                >
                  Discord <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[var(--gold-bright)] font-semibold text-sm mb-3 drop-shadow-[0_0_4px_rgba(255,215,100,0.4)]">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition-all"
                >
                  <Mail className="w-4 h-4" /> Contact Us
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mt-12 pt-5 flex flex-col sm:flex-row items-center justify-between text-center gap-3">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 AOT:R Value Hub — Not affiliated with AoT:R or Roblox.
          </p>

          <p className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
            Made with ❤️ by the Community
          </p>
        </div>

      </div>

      {/* Back to top button */}
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
