import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

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

  if (!user) {
    return <LoginForm />;
  }

  const sub = user?.user_metadata?.sub || "";
  const discordId = sub.startsWith("discord|")
    ? sub.replace("discord|", "")
    : null;

  if (!discordId || !ALLOWED_DISCORD_IDS.includes(discordId)) {
    return <Navigate to="/trade-ads" replace />;
  }

  return <>{children}</>;
};