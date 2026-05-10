/*
  # Fix is_admin() — use SECURITY DEFINER with locked search_path

  ## Problem
  is_admin() runs as SECURITY INVOKER, so when it's called inside an RLS
  policy evaluation on the `items` table, it tries to SELECT from `admin_users`
  while RLS is already mid-evaluation. This causes the admin check to silently
  return false, blocking admin_users from updating/inserting/deleting items.

  ## Fix
  Recreate is_admin() as SECURITY DEFINER so it executes as the function owner
  (postgres/service role), bypassing the RLS loop on admin_users.
  auth.uid() still resolves correctly because the JWT context is preserved;
  only the row-level security bypass changes.

  search_path is locked to 'public' to prevent search_path hijacking.
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;
