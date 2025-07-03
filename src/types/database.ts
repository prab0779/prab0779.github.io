export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string;
          name: string;
          value: number;
          demand: number;
          rate_of_change: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          prestige: number;
          status: 'Obtainable' | 'Unobtainable' | 'Limited';
          obtained_from: string;
          gem_tax: number | null;
          gold_tax: number | null;
          category: string;
          rarity: number | null;
          emoji: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          value?: number;
          demand?: number;
          rate_of_change?: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          prestige?: number;
          status?: 'Obtainable' | 'Unobtainable' | 'Limited';
          obtained_from?: string;
          gem_tax?: number | null;
          gold_tax?: number | null;
          category?: string;
          rarity?: number | null;
          emoji?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          value?: number;
          demand?: number;
          rate_of_change?: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          prestige?: number;
          status?: 'Obtainable' | 'Unobtainable' | 'Limited';
          obtained_from?: string;
          gem_tax?: number | null;
          gold_tax?: number | null;
          category?: string;
          rarity?: number | null;
          emoji?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}