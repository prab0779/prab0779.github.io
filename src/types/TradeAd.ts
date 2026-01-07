export interface TradeAdItem {
  itemId: string;
  itemName: string;
  emoji: string;
  quantity: number;
}

export interface TradeAd {
  id: string;
  itemsWanted: TradeAdItem[];
  itemsOffering: TradeAdItem[];
  tags: string[];
  status: 'active' | 'completed' | 'cancelled';
  authorName: string;
  authorAvatar: string | null;
  contactInfo: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface CreateTradeAdData {
  itemsWanted: TradeAdItem[];
  itemsOffering: TradeAdItem[];
  tags: string[];
  authorName: string;
  authorAvatar: string | null;
  contactInfo: string;
}