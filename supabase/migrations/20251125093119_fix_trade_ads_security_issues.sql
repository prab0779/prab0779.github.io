/*
  # Fix Trade Ads Security Issues

  ## Security fixes applied:
  1. Drop unused index `idx_trade_ads_created_at` to reduce overhead
  2. Make function search_path immutable to prevent privilege escalation
  
  ## Changes:
  - Removed: idx_trade_ads_created_at index (unused)
  - Updated: update_trade_ads_updated_at function with SECURITY DEFINER and immutable search_path
*/

-- Drop unused index
DROP INDEX IF EXISTS idx_trade_ads_created_at;

-- Recreate function with SECURITY DEFINER and immutable search_path to prevent privilege escalation
DROP TRIGGER IF EXISTS update_trade_ads_updated_at_trigger ON trade_ads;
DROP FUNCTION IF EXISTS update_trade_ads_updated_at();

CREATE OR REPLACE FUNCTION public.update_trade_ads_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_trade_ads_updated_at_trigger
  BEFORE UPDATE ON trade_ads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_trade_ads_updated_at();
