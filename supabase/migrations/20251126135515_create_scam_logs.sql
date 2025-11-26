/*
  # Create Scam Logs Table

  1. New Tables
    - `scam_logs`
      - `id` (text, primary key) - Unique identifier for each scam report
      - `roblox_id` (text) - Roblox user ID of the reported scammer
      - `discord_id` (text) - Discord ID of the reported scammer
      - `reason` (text) - Reason/description of the scam
      - `evidence_url` (text) - URL to evidence (image or link)
      - `created_at` (timestamptz) - Timestamp when report was created
      - `updated_at` (timestamptz) - Timestamp when report was last updated

  2. Security
    - Enable RLS on `scam_logs` table
    - Add policy for public read access (anyone can view scam logs)
    - Add policy for authenticated admin users to create/update/delete entries
*/

CREATE TABLE IF NOT EXISTS scam_logs (
  id text PRIMARY KEY,
  roblox_id text NOT NULL,
  discord_id text,
  reason text NOT NULL,
  evidence_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scam_logs ENABLE ROW LEVEL SECURITY;

-- Public read access - anyone can view scam logs
CREATE POLICY "Anyone can view scam logs"
  ON scam_logs
  FOR SELECT
  USING (true);

-- Only authenticated users can insert scam logs
CREATE POLICY "Authenticated users can create scam logs"
  ON scam_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update scam logs
CREATE POLICY "Authenticated users can update scam logs"
  ON scam_logs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete scam logs
CREATE POLICY "Authenticated users can delete scam logs"
  ON scam_logs
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_scam_logs_roblox_id ON scam_logs(roblox_id);
CREATE INDEX IF NOT EXISTS idx_scam_logs_discord_id ON scam_logs(discord_id);
CREATE INDEX IF NOT EXISTS idx_scam_logs_created_at ON scam_logs(created_at DESC);
