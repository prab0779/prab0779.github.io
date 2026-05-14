/*
  # Create banned trade users table

  1. New Tables
    - `banned_trade_users`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, references auth.users, unique)
      - `banned_by` (uuid, references auth.users - the admin who banned them)
      - `reason` (text, optional reason for the ban)
      - `author_name` (text, cached display name of the banned user)
      - `created_at` (timestamptz, when the ban was created)

  2. Security
    - Enable RLS on `banned_trade_users` table
    - Admins can select, insert, and delete bans
    - Authenticated users can check if they themselves are banned

  3. Notes
    - The trade_ads insert flow should check this table before allowing new ads
*/

CREATE TABLE IF NOT EXISTS banned_trade_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  banned_by uuid NOT NULL REFERENCES auth.users(id),
  reason text DEFAULT '',
  author_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE banned_trade_users ENABLE ROW LEVEL SECURITY;

-- Admins can view all bans
CREATE POLICY "Admins can view banned trade users"
  ON banned_trade_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admins can ban users
CREATE POLICY "Admins can ban trade users"
  ON banned_trade_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admins can unban users
CREATE POLICY "Admins can unban trade users"
  ON banned_trade_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Users can check if they are banned (only their own row)
CREATE POLICY "Users can check own ban status"
  ON banned_trade_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Add a policy for admins to delete any trade ad (using service role via RLS bypass not needed,
-- we add an admin delete policy on trade_ads)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trade_ads' AND policyname = 'Admins can delete any trade ad'
  ) THEN
    CREATE POLICY "Admins can delete any trade ad"
      ON trade_ads
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Add a policy for admins to view all trade ads (regardless of status)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trade_ads' AND policyname = 'Admins can view all trade ads'
  ) THEN
    CREATE POLICY "Admins can view all trade ads"
      ON trade_ads
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Add a policy for admins to update any trade ad status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'trade_ads' AND policyname = 'Admins can update any trade ad'
  ) THEN
    CREATE POLICY "Admins can update any trade ad"
      ON trade_ads
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM admin_users
          WHERE admin_users.user_id = auth.uid()
        )
      );
  END IF;
END $$;
