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
      value_changes: {
        Row: {
          id: string;
          item_id: string;
          item_name: string;
          emoji: string;
          old_value: number;
          new_value: number;
          old_demand: number;
          new_demand: number;
          old_rate_of_change: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          new_rate_of_change: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          change_date: string;
          change_type: 'increase' | 'decrease' | 'stable';
          percentage_change: number;
          created_at: string;
        };
        Insert: {
          id: string;
          item_id: string;
          item_name: string;
          emoji?: string;
          old_value: number;
          new_value: number;
          old_demand: number;
          new_demand: number;
          old_rate_of_change: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          new_rate_of_change: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          change_date?: string;
          change_type?: 'increase' | 'decrease' | 'stable';
          percentage_change?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          item_name?: string;
          emoji?: string;
          old_value?: number;
          new_value?: number;
          old_demand?: number;
          new_demand?: number;
          old_rate_of_change?: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          new_rate_of_change?: 'Rising' | 'Falling' | 'Stable' | 'Overpriced';
          change_date?: string;
          change_type?: 'increase' | 'decrease' | 'stable';
          percentage_change?: number;
          created_at?: string;
        };
      };
    };
  };
}