import React, { createContext, useContext } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth";
import { useAdminCheck } from "../hooks/useAdminCheck";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const auth = useAuthHook();

  const { role, loading: roleLoading } = useAdminCheck(
    auth.loading ? undefined : (auth.user?.id ?? null)
  );

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        role,
        roleLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
};