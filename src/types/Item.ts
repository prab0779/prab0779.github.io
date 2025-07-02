export interface Item {
  id: string;
  name: string;
  value: number;
  demand: number;
  rateOfChange: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
  prestige: number;
  status: 'Obtainable' | 'Unobtainable' | 'Limited';
  obtainedFrom: string;
  taxGem: number;
  taxGold?: number;
  category: string;
  rarity: number;
  emoji: string;
}

export interface TradeItem {
  item: Item;
  quantity: number;
}

export interface TradeCalculation {
  itemsSent: TradeItem[];
  itemsReceived: TradeItem[];
  totalValueSent: number;
  totalValueReceived: number;
  totalTaxGems: number;
  totalTaxGold: number;
  netGainLoss: number;
  whoPaysTax?: string;
  sentGemTax?: number;
  sentGoldTax?: number;
  receivedGemTax?: number;
  receivedGoldTax?: number;
}

export interface ValueChange {
  id: string;
  itemId: string;
  itemName: string;
  emoji: string;
  oldValue: number;
  newValue: number;
  oldDemand: number;
  newDemand: number;
  oldRateOfChange: string;
  newRateOfChange: string;
  changeDate: string;
  changeType: 'increase' | 'decrease' | 'stable';
  percentageChange: number;
}

export interface ItemHistory {
  [itemId: string]: {
    previousValue: number;
    previousDemand: number;
    previousRateOfChange: string;
    lastUpdated: string;
  };
}