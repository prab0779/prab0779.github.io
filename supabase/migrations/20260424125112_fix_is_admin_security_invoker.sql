/*
  # Fix is_admin function — change from SECURITY DEFINER to SECURITY INVOKER

  ## Problem
  The is_admin() function was created with SECURITY DEFINER, which means it runs
  as the function owner (postgres role) rather than the calling user. This causes
  auth.uid() to return NULL inside the function, so it always returns false even
  for legitimate admin users.

  ## Fix
  Recreate the function as SECURITY INVOKER (the default) so it executes in the
  context of the authenticated caller, allowing auth.uid() to resolve correctly.
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY INVOKER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;
