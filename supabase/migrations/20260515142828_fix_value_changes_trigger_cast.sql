/*
  # Fix value changes trigger for text value column

  1. Modified Functions
    - `log_value_change()` - updated to handle `items.value` being text type
      by casting to numeric before rounding to integer

  2. Important Notes
    - items.value is stored as text (e.g. "0.1", "500")
    - value_changes.old_value and new_value are integers
    - The trigger now casts text to numeric then rounds to integer
*/

CREATE OR REPLACE FUNCTION public.log_value_change()
RETURNS TRIGGER AS $$
DECLARE
  old_val integer;
  new_val integer;
BEGIN
  -- Cast text value to integer (round to nearest)
  old_val := ROUND(COALESCE(NULLIF(OLD.value, '')::numeric, 0))::integer;
  new_val := ROUND(COALESCE(NULLIF(NEW.value, '')::numeric, 0))::integer;

  -- Only log if value, demand, or rate_of_change actually changed
  IF OLD.value IS DISTINCT FROM NEW.value
     OR OLD.demand IS DISTINCT FROM NEW.demand
     OR OLD.rate_of_change IS DISTINCT FROM NEW.rate_of_change THEN

    INSERT INTO public.value_changes (
      id,
      item_id,
      item_name,
      emoji,
      old_value,
      new_value,
      old_demand,
      new_demand,
      old_rate_of_change,
      new_rate_of_change,
      change_date,
      change_type,
      percentage_change
    ) VALUES (
      gen_random_uuid()::text,
      NEW.id,
      NEW.name,
      COALESCE(NEW.emoji, '👹'),
      old_val,
      new_val,
      COALESCE(OLD.demand, 0),
      COALESCE(NEW.demand, 0),
      COALESCE(OLD.rate_of_change, 'Stable'),
      COALESCE(NEW.rate_of_change, 'Stable'),
      now(),
      CASE
        WHEN new_val > old_val THEN 'increase'
        WHEN new_val < old_val THEN 'decrease'
        ELSE 'stable'
      END,
      CASE
        WHEN old_val = 0 THEN 0
        ELSE ROUND(((new_val - old_val)::numeric / old_val::numeric) * 100, 2)
      END
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
