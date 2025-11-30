import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { signInWithDiscord } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const { error } = await signInWithDiscord();
    if (error) setError("Failed to redirect to Discord. Try again.");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-4xl">⚔️</span>
            <span className="text-2xl font-bold text-white">Admin Access</span>
          </div>
          <h2 className="text-lg text-gray-400">
            Sign in via Discord
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg text-white bg-[#5865F2] hover:bg-[#4752C4] transition shadow-md"
        >
          <LogIn className="w-5 h-5" />
          <span>Login With Discord</span>
        </button>

        <p className="text-center text-sm text-gray-500">
          Only authorized Discord accounts can access admin
        </p>
      </div>
    </div>
  );
};
