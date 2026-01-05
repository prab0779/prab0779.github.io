/*
  # Add user_id and author_avatar columns to trade_ads

  ## Changes:
  - Added: `user_id` (uuid) column to link trade ads to authenticated users
  - Added: `author_avatar` (text) column to store Discord avatar URLs
  - These columns enable proper authentication checks and rate limiting
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trade_ads' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE trade_ads ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trade_ads' AND column_name = 'author_avatar'
  ) THEN
    ALTER TABLE trade_ads ADD COLUMN author_avatar text;
  END IF;
END $$;

DROP POLICY IF EXISTS "Everyone can read trade ads" ON trade_ads;
DROP POLICY IF EXISTS "Authenticated users can create trade ads" ON trade_ads;
DROP POLICY IF EXISTS "Users can update own trade ads" ON trade_ads;
DROP POLICY IF EXISTS "Users can delete own trade ads" ON trade_ads;

CREATE POLICY "Everyone can read trade ads"
  ON trade_ads
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create trade ads"
  ON trade_ads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trade ads"
  ON trade_ads
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trade ads"
  ON trade_ads
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_trade_ads_user_created
  ON trade_ads(user_id, created_at DESC);
