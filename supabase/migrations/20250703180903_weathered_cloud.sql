/*
  # Create items table for AOT:R Value Hub

  1. New Tables
    - `items`
      - `id` (text, primary key) - Unique identifier for each item
      - `name` (text) - Item name
      - `value` (integer) - Item value in keys
      - `demand` (integer) - Demand rating 1-10
      - `rate_of_change` (text) - Rising, Falling, Stable, or Overpriced
      - `prestige` (integer) - Prestige level
      - `status` (text) - Obtainable, Unobtainable, or Limited
      - `obtained_from` (text) - How to obtain the item
      - `gem_tax` (integer, nullable) - Gem tax amount
      - `gold_tax` (integer, nullable) - Gold tax amount
      - `category` (text) - Item category
      - `rarity` (numeric, nullable) - Rarity percentage
      - `emoji` (text) - Item emoji or image path
      - `created_at` (timestamp) - When item was created
      - `updated_at` (timestamp) - When item was last updated

  2. Security
    - Enable RLS on `items` table
    - Add policy for public read access
    - Add policy for authenticated admin users to manage items
*/

CREATE TABLE IF NOT EXISTS items (
  id text PRIMARY KEY,
  name text NOT NULL,
  value integer NOT NULL DEFAULT 0,
  demand integer NOT NULL DEFAULT 5 CHECK (demand >= 1 AND demand <= 10),
  rate_of_change text NOT NULL DEFAULT 'Stable' CHECK (rate_of_change IN ('Rising', 'Falling', 'Stable', 'Overpriced')),
  prestige integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Obtainable' CHECK (status IN ('Obtainable', 'Unobtainable', 'Limited')),
  obtained_from text NOT NULL DEFAULT 'Unknown',
  gem_tax integer DEFAULT NULL,
  gold_tax integer DEFAULT NULL,
  category text NOT NULL DEFAULT 'Miscellaneous',
  rarity numeric DEFAULT NULL CHECK (rarity IS NULL OR (rarity >= 0 AND rarity <= 100)),
  emoji text NOT NULL DEFAULT '👹',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read items"
  ON items
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert/update/delete items
-- Note: You should restrict this further to admin users only
CREATE POLICY "Authenticated users can manage items"
  ON items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();