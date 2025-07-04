export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
         
  id: '1',
  name: 'Scarf',
  value: 13,
  demand: 5,
  rate_of_change: 'Rising',
  prestige: 2,
  status: 'Obtainable',
  obtained_from: 'Obtained as a drop from the Attack Titan Raid Raids',
  gem_tax: 0,
  gold_tax: null,
  category: 'Artifact',
  rarity: null,
  emoji: '/scarf.png',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()


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