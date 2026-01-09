/*
  # Fix Trade Ads RLS Policies

  1. Problem
    - Multiple conflicting RLS policies blocking legitimate posts
    - "Anyone can create trade ads" with permissive rules conflicts with authenticated-only requirement
    - Duplicate policies causing RLS to deny valid requests

  2. Solution
    - Drop conflicting policies
    - Create clean, specific policies:
      - SELECT: Everyone can read active trade ads
      - INSERT: Only authenticated users can insert their own ads
      - UPDATE: Only authenticated users can update their own ads
      - DELETE: Only authenticated users can delete their own ads

  3. Security
    - RLS remains enabled and enforced
    - All data operations require proper authentication and ownership checks
*/

-- Drop conflicting policies
DO $$
BEGIN
  -- Drop duplicate/conflicting policies
  DROP POLICY IF EXISTS "Anyone can create trade ads" ON trade_ads;
  DROP POLICY IF EXISTS "Anyone can read trade ads" ON trade_ads;
  DROP POLICY IF EXISTS "Authors can delete their own trade ads" ON trade_ads;
  DROP POLICY IF EXISTS "Authors can update their own trade ads" ON trade_ads;
  DROP POLICY IF EXISTS "Everyone can read trade ads" ON trade_ads;
END $$;

-- Create clean, non-conflicting policies

-- SELECT: Anyone can read active trade ads
CREATE POLICY "select_active_trade_ads"
  ON trade_ads FOR SELECT
  TO public
  USING (status = 'active');

-- INSERT: Only authenticated users can create ads
CREATE POLICY "insert_own_trade_ads"
  ON trade_ads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Only authenticated users can update their own ads
CREATE POLICY "update_own_trade_ads"
  ON trade_ads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Only authenticated users can delete their own ads
CREATE POLICY "delete_own_trade_ads"
  ON trade_ads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
