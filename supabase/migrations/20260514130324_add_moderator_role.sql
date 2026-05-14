/*
  # Add moderator role to admin_users

  1. Modified Tables
    - `admin_users`
      - Added `role` column (text, default 'admin')
      - Possible values: 'admin', 'moderator'

  2. New Functions
    - `is_admin_or_moderator()` - Returns true if user is admin or moderator
    - `get_user_role()` - Returns the role string for the current user

  3. Notes
    - Existing admin_users rows default to 'admin' role
    - Moderators can: add items, update values, manage stock, manage trade ads
    - Moderators cannot: delete items, delete value changes, access settings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'role'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN role text NOT NULL DEFAULT 'admin';
  END IF;
END $$;

ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('admin', 'moderator'));

CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.admin_users WHERE user_id = auth.uid() LIMIT 1;
$$;
