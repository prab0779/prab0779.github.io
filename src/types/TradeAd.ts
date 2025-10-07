export interface TradeAdItem {
  itemId: string;
  itemName: string;
  emoji: string;
  quantity: number;
}

export interface TradeAd {
  id: string;
  title: string;
  description: string;
  itemsWanted: TradeAdItem[];
  itemsOffering: TradeAdItem[];
  tags: string[];
  status: 'active' | 'completed' | 'cancelled';
  authorName: string;
  contactInfo: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface CreateTradeAdData {
  title: string;
  description: string;
  itemsWanted: TradeAdItem[];
  itemsOffering: TradeAdItem[];
  tags: string[];
  authorName: string;
  contactInfo: string;
}