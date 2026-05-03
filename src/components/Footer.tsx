import React from 'react';
import { ExternalLink, Mail, Home, List, Calculator, History, Shield, ScrollText, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradientText from '../Shared/GradientText';

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
      <div className="absolute -top-[1px] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-bright)] to-transparent opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">

          <div className="col-span-2 sm:col-span-1">
            <GradientText variant="gold" className="text-xl font-bold mb-4">
              AOT:R Value Hub
            </GradientText>

            <GradientText variant="silver" className="text-sm leading-relaxed max-w-xs">
              aotrvalue.com is a 3rd party site not affiliated with Attack on Titan Revolution or Roblox.
            </GradientText>
          </div>

          <div>
            <GradientText variant="gold" className="font-semibold text-sm mb-3">
              Navigation
            </GradientText>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Home className="w-4 h-4" />
                  <GradientText variant="silver">Home</GradientText>
                </Link>
              </li>

              <li>
                <Link to="/value-list" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <List className="w-4 h-4" />
                  <GradientText variant="silver">Value List</GradientText>
                </Link>
              </li>

              <li>
                <Link to="/calculator" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Calculator className="w-4 h-4" />
                  <GradientText variant="silver">Calculator</GradientText>
                </Link>
              </li>

              <li>
                <Link to="/value-changes" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <History className="w-4 h-4" />
                  <GradientText variant="silver">Value Changes</GradientText>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <GradientText variant="gold" className="font-semibold text-sm mb-3">
              Community
            </GradientText>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/trade-ads" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Shield className="w-4 h-4" />
                  <GradientText variant="silver">Trade Ads</GradientText>
                </Link>
              </li>

              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <GradientText variant="silver">Discord</GradientText>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <GradientText variant="gold" className="font-semibold text-sm mb-3">
              Support
            </GradientText>

            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://discord.gg/tradingcorps"
                  target="_blank"
                  className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition"
                >
                  <Mail className="w-4 h-4" />
                  <GradientText variant="silver">Contact Us</GradientText>
                </a>
              </li>
              <li>
                <Link to="/privacy" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <Lock className="w-4 h-4" />
                  <GradientText variant="silver">Privacy Policy</GradientText>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="flex items-center gap-2 text-gray-300 hover:text-[var(--gold-bright)] transition">
                  <ScrollText className="w-4 h-4" />
                  <GradientText variant="silver">Terms of Service</GradientText>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-5 text-center">
          <GradientText variant="silver" className="text-xs sm:text-sm">
            © 2026 AOT:R Value Hub — Not affiliated with AoT:R or Roblox.
          </GradientText>
        </div>

      </div>
    </footer>
  );
};