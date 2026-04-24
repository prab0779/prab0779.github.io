import React, { createContext, useContext } from "react";
import { useItems } from "../hooks/useItems";
import { Item } from "../types/Item";

interface ItemsContextValue {
  items: Item[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const ItemsContext = createContext<ItemsContextValue>({
  items: [],
  loading: true,
  error: null,
  refresh: () => {},
});

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useItems();
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};

export const useItemsContext = () => useContext(ItemsContext);
