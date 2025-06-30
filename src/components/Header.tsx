import React, { useState } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onPageChange('home')}>
            <div className="text-2xl">⚔️</div>
            <h1 className="text-xl font-bold text-white">AOT:R Value Hub</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => onPageChange('home')}
              className={`text-sm font-medium transition-all duration-200 hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-800 ${
                currentPage === 'home' ? 'text-blue-400 bg-gray-800' : 'text-gray-300'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onPageChange('calculator')}
              className={`text-sm font-medium transition-all duration-200 hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-800 ${
                currentPage === 'calculator' ? 'text-blue-400 bg-gray-800' : 'text-gray-300'
              }`}
            >
              Trade Calculator
            </button>

            <button
              onClick={() => onPageChange('value-changes')}
              className={`text-sm font-medium transition-all duration-200 hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-800 ${
                currentPage === 'value-changes' ? 'text-blue-400 bg-gray-800' : 'text-gray-300'
              }`}
            >
              Value Changes
            </button>

            <button
              onClick={() => onPageChange('admin')}
              className={`text-sm font-medium transition-all duration-200 hover:text-red-400 px-3 py-2 rounded-md hover:bg-gray-800 ${
                currentPage === 'admin' ? 'text-red-400 bg-gray-800' : 'text-gray-300'
              }`}
            >
              Admin
            </button>

            <a
              href="https://discord.gg/aotr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-blue-400 transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-800"
            >
              <span>Discord</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800 animate-fade-in">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onPageChange('home');
                  setIsMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors hover:text-blue-400 px-3 py-2 rounded-md ${
                  currentPage === 'home' ? 'text-blue-400 bg-gray-800' : 'text-gray-300'
                }`}
              >
                🏠 Home
              </button>
              
              <button
                onClick={() => {
                  onPageChange('calculator');
                  setIsMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors hover:text-blue-400 px-3 py-2 rounded-md ${
                  currentPage === 'calculator' ? 'text-blue-400 bg-gray-800' : 'text-gray-300'
                }`}
              >
                🧮 Trade Calculator
              </button>

              <button
                onClick={() => {
                  onPageChange('value-changes');
                  setIsMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors hover:text-blue-400 px-3 py-2 rounded-md ${
                  currentPage === 'value-changes' ? 'text-blue-400 bg-gray-800' : 'text-gray-300'
                }`}
              >
                📈 Value Changes
              </button>

              <button
                onClick={() => {
                  onPageChange('admin');
                  setIsMenuOpen(false);
                }}
                className={`text-left text-sm font-medium transition-colors hover:text-red-400 px-3 py-2 rounded-md ${
                  currentPage === 'admin' ? 'text-red-400 bg-gray-800' : 'text-gray-300'
                }`}
              >
                🔐 Admin
              </button>

              <a
                href="https://discord.gg/aotrvalues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors px-3 py-2"
              >
                <span>💬</span>
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