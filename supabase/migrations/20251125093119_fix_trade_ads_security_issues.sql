DROP POLICY IF EXISTS "Anyone can create trade ads" ON trade_ads;
DROP POLICY IF EXISTS "Anyone can read trade ads" ON trade_ads;
DROP POLICY IF EXISTS "Authors can delete their own trade ads" ON trade_ads;
DROP POLICY IF EXISTS "Authors can update their own trade ads" ON trade_ads;
DROP POLICY IF EXISTS "Everyone can read trade ads" ON trade_ads;

CREATE POLICY "select_active_trade_ads"
ON trade_ads FOR SELECT
TO public
USING (
  status = 'active'
  AND expires_at > now()
);

CREATE POLICY "insert_own_trade_ads"
ON trade_ads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_trade_ads"
ON trade_ads FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_trade_ads"
ON trade_ads FOR DELETE
TO authenticated
USING (auth.uid() = user_id);