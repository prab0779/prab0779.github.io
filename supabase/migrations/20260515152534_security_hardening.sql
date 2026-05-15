/*
  # Security Hardening Migration

  1. Fixed Policies
    - `admin_users` SELECT: Changed from USING(true) to only allow authenticated users
      who are themselves admins to see the full list; regular users can only check their own row
    - `stock_rotation` UPDATE: Removed the overly permissive "update stock rotation" policy
      that allowed ANY user to update. Kept admin-only update policy.

  2. New Tables
    - `audit_log` - Logs all sensitive admin actions for security monitoring
      - `id` (uuid, primary key)
      - `user_id` (uuid, who performed the action)
      - `action` (text, what was done)
      - `target_type` (text, what type of entity was affected)
      - `target_id` (text, which entity was affected)
      - `metadata` (jsonb, additional context)
      - `ip_address` (text, request origin)
      - `created_at` (timestamptz)
    - `rate_limits` - Tracks request counts per user per action for rate limiting
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `action` (text, e.g. 'trade_ad_create')
      - `window_start` (timestamptz)
      - `request_count` (integer)

  3. New Functions
    - `check_rate_limit(action_name text, max_requests int, window_seconds int)` 
      - Returns true if user is within rate limit, false if exceeded
    - `log_admin_action(action text, target_type text, target_id text, meta jsonb)`
      - Inserts a record into audit_log

  4. Modified Policies
    - `trade_ads` INSERT: Added ban check at database level so banned users
      cannot insert trade ads even if client-side check is bypassed

  5. Security
    - RLS enabled on audit_log (only admins can read, system inserts via SECURITY DEFINER)
    - RLS enabled on rate_limits (users can only see their own entries)
*/

-- ============================================================
-- FIX: admin_users SELECT policy - remove USING(true)
-- ============================================================
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;

-- Admins can see all admin_users rows
CREATE POLICY "Admins can read all admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Any authenticated user can check if THEY are an admin (needed for useAdminCheck)
CREATE POLICY "Users can check own admin status"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- FIX: stock_rotation - remove wildcard update policy
-- ============================================================
DROP POLICY IF EXISTS "update stock rotation" ON public.stock_rotation;

-- Ensure only admins can update (fix the existing policy too)
DROP POLICY IF EXISTS "Admins can update stock" ON public.stock_rotation;

CREATE POLICY "Admins can update stock rotation"
  ON public.stock_rotation
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- FIX: trade_ads INSERT - enforce ban check at DB level
-- ============================================================
DROP POLICY IF EXISTS "Users can insert their own ads" ON public.trade_ads;

CREATE POLICY "Non-banned users can insert their own ads"
  ON public.trade_ads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.banned_trade_users
      WHERE banned_trade_users.user_id = auth.uid()
    )
  );

-- ============================================================
-- NEW: Audit log table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL DEFAULT '',
  target_id text NOT NULL DEFAULT '',
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit log"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- No insert policy for users; inserts happen via SECURITY DEFINER function

-- ============================================================
-- NEW: Rate limits table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action
  ON public.rate_limits (user_id, action, window_start);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own rate limits"
  ON public.rate_limits
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- NEW: Rate limit check function
-- ============================================================
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  action_name text,
  max_requests integer DEFAULT 10,
  window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_uid uuid;
  window_start_time timestamptz;
  current_count integer;
BEGIN
  current_uid := auth.uid();
  IF current_uid IS NULL THEN
    RETURN false;
  END IF;

  window_start_time := now() - (window_seconds || ' seconds')::interval;

  -- Clean old entries
  DELETE FROM public.rate_limits
  WHERE user_id = current_uid
    AND action = action_name
    AND window_start < window_start_time;

  -- Count recent requests
  SELECT COALESCE(SUM(request_count), 0) INTO current_count
  FROM public.rate_limits
  WHERE user_id = current_uid
    AND action = action_name
    AND window_start >= window_start_time;

  -- If over limit, deny
  IF current_count >= max_requests THEN
    RETURN false;
  END IF;

  -- Record this request
  INSERT INTO public.rate_limits (user_id, action, window_start, request_count)
  VALUES (current_uid, action_name, now(), 1);

  RETURN true;
END;
$$;

-- ============================================================
-- NEW: Audit log function
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action text,
  p_target_type text DEFAULT '',
  p_target_id text DEFAULT '',
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_log (user_id, action, target_type, target_id, metadata)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_metadata);
END;
$$;

-- ============================================================
-- Add audit trigger for item mutations (admin actions)
-- ============================================================
CREATE OR REPLACE FUNCTION public.audit_item_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_admin_action('item_create', 'item', NEW.id, jsonb_build_object('name', NEW.name));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM public.log_admin_action('item_update', 'item', NEW.id, jsonb_build_object('name', NEW.name));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_admin_action('item_delete', 'item', OLD.id, jsonb_build_object('name', OLD.name));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trigger_audit_item_changes ON public.items;

CREATE TRIGGER trigger_audit_item_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_item_changes();

-- ============================================================
-- Add audit trigger for trade_ads admin deletions
-- ============================================================
CREATE OR REPLACE FUNCTION public.audit_trade_ad_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF is_admin() THEN
    PERFORM public.log_admin_action('trade_ad_delete', 'trade_ad', OLD.id, 
      jsonb_build_object('author_name', OLD.author_name));
  END IF;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trigger_audit_trade_ad_delete ON public.trade_ads;

CREATE TRIGGER trigger_audit_trade_ad_delete
  BEFORE DELETE ON public.trade_ads
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trade_ad_delete();

-- ============================================================
-- Clean up old rate limit entries periodically (run via cron or manual)
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE window_start < now() - interval '1 hour';
END;
$$;
