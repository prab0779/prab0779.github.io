import React, { useEffect } from 'react';
import { AlertTriangle, Wrench, MessageCircle, ExternalLink } from 'lucide-react';

export const MaintenancePopup: React.FC = () => {
  useEffect(() => {
    // Prevent scrolling when maintenance popup is active
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center overflow-hidden">
      <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Wrench className="w-8 h-8 text-orange-400 animate-bounce" />
            <span className="text-2xl font-bold text-white">Important Notice</span>
            <AlertTriangle className="w-8 h-8 text-orange-400 animate-pulse" />
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            <span className="text-orange-400 font-medium">Maintenance in Progress</span>
          </div>
        </div>

        {/* Unofficial Site Warning */}
        <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Important Notice</span>
          </div>
          <p className="text-yellow-200 text-sm">
            This is an <strong>unofficial</strong> AOTR value list. Please wait for the official Attack on Titan Revolution value list to be released.
          </p>
        </div>

        {/* Main Message */}
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">
            This List will no longer be updated
          </h2>
          
          <p className="text-gray-300">
            
          </p>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <p className="text-gray-400 text-sm mb-2">Estimated downtime:</p>
            <p className="text-blue-400 font-bold">soon</p>
          </div>
          
          <p className="text-gray-400 text-sm">
            
          </p>
        </div>

        {/* Discord Button */}
        <div className="mt-6 text-center">
          <a
            href="https://discord.gg/tradingcorps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Join Our Discord Community</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <p className="text-gray-400 text-xs mt-2">
            Stay updated and connect with other traders
          </p>
        </div>
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-xs">
            Unofficial AOT:R Value Hub - Not affiliated with the official game
          </p>
        </div>
      </div>
    </div>
  );
};