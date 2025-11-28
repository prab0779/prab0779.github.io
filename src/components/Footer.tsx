import React from 'react';
import { ExternalLink, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="py-14">

          {/* GRID — better layout for mobile */}
          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            gap-10
          ">

            {/* Brand / Intro */}
            <div className="md:col-span-3 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-3xl">⚔️</span>
                <h2 className="text-xl font-bold text-white">AOT:R Value Hub</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Your trusted source for Attack on Titan Revolution
                trading values, tools, and community insights.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-blue-400">Home</Link></li>
                <li><Link to="/calculator" className="text-gray-400 hover:text-blue-400">Trade Calculator</Link></li>
                <li><Link to="/value-list" className="text-gray-400 hover:text-blue-400">Value List</Link></li>
                <li><Link to="/value-changes" className="text-gray-400 hover:text-blue-400">Value Changes</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Community</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/trade-ads" className="text-gray-400 hover:text-blue-400">Trade Ads</Link></li>
                <li><Link to="/scam-logs" className="text-gray-400 hover:text-blue-400">Scam Logs</Link></li>
                <li>
                  <a 
                    href="https://discord.gg/tradingcorps"
                    target="_blank"
                    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400"
                  >
                    Discord <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.gg/tradingcorps"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-400"
                  >
                    <Mail className="w-4 h-4" /> Contact Us
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs sm:text-sm text-center">
              © 2025 AOT:R Value Hub. Not affiliated with Attack on Titan or Roblox.
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
