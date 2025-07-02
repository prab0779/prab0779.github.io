import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-pulse-slow">
          <div className="text-8xl mb-4 animate-bounce-slow">⚔️</div>
          <h1 className="text-4xl font-bold text-white mb-2">AOT:R Value Hub</h1>
          <p className="text-gray-400">Loading the ultimate trading experience...</p>
        </div>
        
        {/* Loading Spinner */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-delay-0"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-delay-1"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce-delay-2"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-8 space-y-2">
          <div className="text-sm text-gray-500 animate-fade-in-out">
            Fetching latest item values...
          </div>
        </div>
      </div>
    </div>
  );
};