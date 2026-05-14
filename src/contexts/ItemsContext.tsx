import React, { createContext, useContext } from "react";
import { useItems } from "../hooks/useItems";
import { Item } from "../types/Item";

interface ItemsContextValue {
  items: Item[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  createItem: (data: Omit<Item, 'id'>) => Promise<{ error: string | null }>;
  updateItem: (id: string, data: Partial<Item>) => Promise<{ error: string | null }>;
  deleteItem: (id: string) => Promise<{ error: string | null }>;
}

const noop = async () => ({ error: null });

export const ItemsContext = createContext<ItemsContextValue>({
  items: [],
  loading: true,
  error: null,
  refresh: () => {},
  createItem: noop,
  updateItem: noop,
  deleteItem: noop,
});

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useItems();
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
};

export const useItemsContext = () => useContext(ItemsContext);
