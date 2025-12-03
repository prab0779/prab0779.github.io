import React from 'react';
import { ExternalLink, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="py-10 sm:py-14">

          {/* GRID */}
          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-4
              gap-6
              sm:gap-10
            "
          >

            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-3xl text-[var(--gold-bright)]">⚔️</span>
                <h2 className="text-lg font-bold text-[var(--gold-bright)]">
                  AOT:R Value Hub
                </h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                https://aotrvalue.com is a 3rd party website that is not affiliated with Attack on Titan Revolution or Roblox. 
                We are not endorsed by their respective owners.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-[var(--gold-bright)] font-semibold text-sm mb-3">Navigation</h3>
              <ul className="space-y-1.5 text-sm">
                <li><Link to="/" className="text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition">Home</Link></li>
                <li><Link to="/calculator" className="text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition">Calculator</Link></li>
                <li><Link to="/value-list" className="text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition">Value List</Link></li>
                <li><Link to="/value-changes" className="text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition">Value Changes</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-[var(--gold-bright)] font-semibold text-sm mb-3">Community</h3>
              <ul className="space-y-1.5 text-sm">
                <li><Link to="/trade-ads" className="text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition">Trade Ads</Link></li>
                <li><Link to="/scam-logs" className="text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition">Scam Logs</Link></li>
                <li>
                  <a
                    href="https://discord.gg/tradingcorps"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition"
                  >
                    Discord <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-[var(--gold-bright)] font-semibold text-sm mb-3">Support</h3>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <a
                    href="https://discord.gg/tradingcorps"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-[var(--gold-soft)] hover:text-[var(--gold-bright)] transition"
                  >
                    <Mail className="w-4 h-4" /> Contact Us
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center">
              © 2025 AOT:R Value Hub — Not affiliated with AOT or Roblox.
            </p>

            <p className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
              Made with <Heart className="w-3 h-3 text-red-400" /> by the Community
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
