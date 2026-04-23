/*
  # Security Hardening: Admin table + restricted RLS

  ## Summary
  Closes critical security gaps where any authenticated Discord user could
  write/delete items and value_changes. Introduces a server-side admin_users
  table so admin checks are not client-side only.

  ## Changes

  ### 1. New table: admin_users
  - Stores the Supabase auth.uid() of each admin
  - Only admins can read it (no public exposure)
  - No self-enrollment — rows must be inserted directly in the DB

  ### 2. Helper function: is_admin()
  - Returns true if the calling user's uid exists in admin_users
  - Used in all admin-only RLS policies below

  ### 3. items table RLS — replace open write policy
  - Drop the old "Authenticated users can manage items" (USING true) policy
  - Add separate INSERT / UPDATE / DELETE policies that call is_admin()

  ### 4. value_changes table RLS — same fix
  - Drop the old "Authenticated users can manage value changes" policy
  - Add separate INSERT / UPDATE / DELETE policies that call is_admin()

  ### 5. trade_ads table RLS — ensure author_avatar column exists
  - The code inserts author_avatar but the original schema lacked it; add safely
*/

-- ============================================================
-- 1. admin_users table
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. is_admin() helper (security definer so it bypasses RLS on admin_users)
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- ============================================================
-- 3. Fix items RLS
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can manage items" ON items;

CREATE POLICY "Admins can insert items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete items"
  ON items
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 4. Fix value_changes RLS
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can manage value changes" ON value_changes;

CREATE POLICY "Admins can insert value_changes"
  ON value_changes
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update value_changes"
  ON value_changes
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete value_changes"
  ON value_changes
  FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 5. trade_ads: add author_avatar column if missing
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trade_ads' AND column_name = 'author_avatar'
  ) THEN
    ALTER TABLE trade_ads ADD COLUMN author_avatar text DEFAULT NULL;
  END IF;
END $$;
