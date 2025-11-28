import React from 'react';
import { ExternalLink, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg font-bold text-white">AOT:R Value Hub</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The ultimate resource for Attack on Titan Revolution item values and trading tools.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/calculator" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Trade Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/value-list" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Value List
                  </Link>
                </li>
                <li>
                  <Link to="/value-changes" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Value Changes
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Community</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/trade-ads" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Trade Ads
                  </Link>
                </li>
                <li>
                  <Link to="/scam-logs" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                    Scam Logs
                  </Link>
                </li>
                <li>
                  <a
                    href="https://discord.gg/tradingcorps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    <span>Discord</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://discord.gg/tradingcorps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Contact Us</span>
                  </a>
                </li>
                
        
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8">
            {/* Bottom Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                © 2025 AOT:R Value Hub. Not affiliated with Attack on Titan Revolution or Roblox.
              </p>
              <div className="flex items-center space-x-1 text-gray-500 text-xs sm:text-sm">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-400" />
                <span>by the Community</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
 
