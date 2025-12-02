import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// ⭐ ADD YOUR DISCORD ID HERE ⭐
const ALLOWED_DISCORD_IDS = ["512671808886013962"];

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // ❌ Not logged in → show login form
  if (!user) {
    return <LoginForm />;
  }

  // ⭐ FIX: Correct way to extract Discord ID
  const discordId =
    user?.identities?.[0]?.identity_data?.provider_id ||
    user?.user_metadata?.provider_id ||
    user?.user_metadata?.sub ||
    null;

  console.log("DEBUG Discord ID:", discordId);

  // ❌ Logged in but not allowed → block access
  if (!discordId || !ALLOWED_DISCORD_IDS.includes(discordId)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl text-red-400 font-bold">Access Denied</h1>
          <p className="text-gray-400">
            This account is not authorised to view the admin panel.
          </p>
        </div>
      </div>
    );
  }

  // ✅ User is authorised → show admin
  return <>{children}</>;
};
