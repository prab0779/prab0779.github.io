import React, { useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-blue-400 bg-gray-800'
      : 'text-gray-300';

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <img src="/customdiscordlogo.png" alt="AOT:R Values Logo"
              className="h-16 w-auto object-contain hover:scale-105 transition-transform duration-200" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-2 rounded-md hover:text-blue-400 hover:bg-gray-800 transition ${isActive('/')}`}
            >
              Home
            </Link>

            <Link
              to="/value-list"
              className={`text-sm font-medium px-3 py-2 rounded-md hover:text-blue-400 hover:bg-gray-800 transition ${isActive('/value-list')}`}
            >
              Value List
            </Link>

            <Link
              to="/calculator"
              className={`text-sm font-medium px-3 py-2 rounded-md hover:text-blue-400 hover:bg-gray-800 transition ${isActive('/calculator')}`}
            >
              Trade Calculator
            </Link>

            <Link
              to="/value-changes"
              className={`text-sm font-medium px-3 py-2 rounded-md hover:text-blue-400 hover:bg-gray-800 transition ${isActive('/value-changes')}`}
            >
              Value Changes
            </Link>

            <Link
              to="/trade-ads"
              className={`text-sm font-medium px-3 py-2 rounded-md hover:text-blue-400 hover:bg-gray-800 transition ${isActive('/trade-ads')}`}
            >
              Trade Ads
            </Link>

            <Link
              to="/scam-logs"
              className={`text-sm font-medium px-3 py-2 rounded-md hover:text-blue-400 hover:bg-gray-800 transition ${isActive('/scam-logs')}`}
            >
              Scam Logs
            </Link>

            <a
              href="https://discord.gg/tradingcorps"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-blue-400 transition px-3 py-2 rounded-md hover:bg-gray-800"
            >
              <span>Discord</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className={`text-left px-3 py-2 rounded-md ${isActive('/')}`}>
                Home
              </Link>

              <Link to="/value-list" onClick={() => setIsMenuOpen(false)} className={`text-left px-3 py-2 rounded-md ${isActive('/value-list')}`}>
                Value List
              </Link>

              <Link to="/calculator" onClick={() => setIsMenuOpen(false)} className={`text-left px-3 py-2 rounded-md ${isActive('/calculator')}`}>
                Trade Calculator
              </Link>

      

              <Link to="/value-changes" onClick={() => setIsMenuOpen(false)} className={`text-left px-3 py-2 rounded-md ${isActive('/value-changes')}`}>
                Value Changes
              </Link>

              <Link to="/trade-ads" onClick={() => setIsMenuOpen(false)} className={`text-left px-3 py-2 rounded-md ${isActive('/trade-ads')}`}>
                Trade Ads
              </Link>

              <Link to="/scam-logs" onClick={() => setIsMenuOpen(false)} className={`text-left px-3 py-2 rounded-md ${isActive('/scam-logs')}`}>
                Scam Logs
              </Link>

              <a
                href="https://discord.gg/tradingcorps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition px-3 py-2"
              >
                <span>Discord</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
