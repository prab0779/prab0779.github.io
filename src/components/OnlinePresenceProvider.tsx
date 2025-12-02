import React, { createContext } from "react";
import { useOnlineUsers } from "../hooks/useOnlineUsers";

export const PresenceContext = createContext({
  onlineCount: 0,
  loading: true,
});

export const OnlinePresenceProvider = ({ children }) => {
  const { onlineCount, loading } = useOnlineUsers();

  return (
    <PresenceContext.Provider value={{ onlineCount, loading }}>
      {children}
    </PresenceContext.Provider>
  );
};
