import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAdminCheck } from '../hooks/useAdminCheck';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminCheck(user?.id);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c4a04a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <p className="text-red-400 font-semibold text-lg">Access Denied</p>
          <p className="text-gray-400 text-sm">Your account does not have admin or moderator access.</p>
          <p className="text-gray-600 text-xs font-mono break-all">User ID: {user.id}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
