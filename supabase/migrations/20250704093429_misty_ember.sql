/*
  # Create value changes tracking table

  1. New Tables
    - `value_changes`
      - `id` (text, primary key)
      - `item_id` (text, references items)
      - `item_name` (text)
      - `emoji` (text)
      - `old_value` (integer)
      - `new_value` (integer)
      - `old_demand` (integer)
      - `new_demand` (integer)
      - `old_rate_of_change` (text)
      - `new_rate_of_change` (text)
      - `change_date` (timestamptz)
      - `change_type` (text)
      - `percentage_change` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `value_changes` table
    - Add policy for public read access
    - Add policy for authenticated users to manage changes
*/

CREATE TABLE IF NOT EXISTS value_changes (
  id text PRIMARY KEY,
  item_id text NOT NULL,
  item_name text NOT NULL,
  emoji text NOT NULL DEFAULT '👹',
  old_value integer NOT NULL,
  new_value integer NOT NULL,
  old_demand integer NOT NULL,
  new_demand integer NOT NULL,
  old_rate_of_change text NOT NULL,
  new_rate_of_change text NOT NULL,
  change_date timestamptz NOT NULL DEFAULT now(),
  change_type text NOT NULL DEFAULT 'stable',
  percentage_change numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add constraints
ALTER TABLE value_changes ADD CONSTRAINT value_changes_change_type_check 
  CHECK (change_type = ANY (ARRAY['increase'::text, 'decrease'::text, 'stable'::text]));

ALTER TABLE value_changes ADD CONSTRAINT value_changes_old_demand_check 
  CHECK (((old_demand >= 1) AND (old_demand <= 10)));

ALTER TABLE value_changes ADD CONSTRAINT value_changes_new_demand_check 
  CHECK (((new_demand >= 1) AND (new_demand <= 10)));

ALTER TABLE value_changes ADD CONSTRAINT value_changes_old_rate_check 
  CHECK (old_rate_of_change = ANY (ARRAY['Rising'::text, 'Falling'::text, 'Stable'::text, 'Overpriced'::text]));

ALTER TABLE value_changes ADD CONSTRAINT value_changes_new_rate_check 
  CHECK (new_rate_of_change = ANY (ARRAY['Rising'::text, 'Falling'::text, 'Stable'::text, 'Overpriced'::text]));

-- Enable RLS
ALTER TABLE value_changes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read value changes"
  ON value_changes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage value changes"
  ON value_changes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS value_changes_item_id_idx ON value_changes(item_id);
CREATE INDEX IF NOT EXISTS value_changes_change_date_idx ON value_changes(change_date DESC);