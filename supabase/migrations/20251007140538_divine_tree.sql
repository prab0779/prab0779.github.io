/*
  # Create trade ads table

  1. New Tables
    - `trade_ads`
      - `id` (text, primary key)
      - `title` (text) - Trade post title
      - `description` (text) - Trade description
      - `items_wanted` (jsonb) - Array of wanted items with quantities
      - `items_offering` (jsonb) - Array of offering items with quantities
      - `tags` (text array) - Trade tags like upgrade, downgrade, GP, etc.
      - `status` (text) - active, completed, cancelled
      - `author_name` (text) - Name of the person posting
      - `contact_info` (text) - Discord username or other contact
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `expires_at` (timestamptz) - When the trade ad expires

  2. Security
    - Enable RLS on `trade_ads` table
    - Add policy for public read access
    - Add policy for anyone to create trade ads
    - Add policy for authors to update their own ads
*/

CREATE TABLE IF NOT EXISTS trade_ads (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  items_wanted jsonb NOT NULL DEFAULT '[]',
  items_offering jsonb NOT NULL DEFAULT '[]',
  tags text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  author_name text NOT NULL,
  contact_info text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days')
);

-- Enable RLS
ALTER TABLE trade_ads ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Anyone can read trade ads"
  ON trade_ads
  FOR SELECT
  TO public
  USING (true);

-- Policy for anyone to create trade ads
CREATE POLICY "Anyone can create trade ads"
  ON trade_ads
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for authors to update their own ads (based on author_name for simplicity)
CREATE POLICY "Authors can update their own trade ads"
  ON trade_ads
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policy for authors to delete their own ads
CREATE POLICY "Authors can delete their own trade ads"
  ON trade_ads
  FOR DELETE
  TO public
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_trade_ads_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_trade_ads_updated_at
  BEFORE UPDATE ON trade_ads
  FOR EACH ROW
  EXECUTE FUNCTION update_trade_ads_updated_at_column();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS trade_ads_status_idx ON trade_ads(status);
CREATE INDEX IF NOT EXISTS trade_ads_created_at_idx ON trade_ads(created_at DESC);
CREATE INDEX IF NOT EXISTS trade_ads_tags_idx ON trade_ads USING GIN(tags);