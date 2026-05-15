/*
  # Add trigger to automatically log value changes

  1. New Functions
    - `log_value_change()` - trigger function that inserts into `value_changes`
      when an item's value, demand, or rate_of_change is modified

  2. New Triggers
    - `trigger_log_value_change` on `items` table (AFTER UPDATE)
      - Only fires when value, demand, or rate_of_change actually changes

  3. Important Notes
    - This replaces the need for frontend code to manually insert value_changes
    - The trigger compares OLD and NEW values and only logs if something changed
    - change_type is determined by comparing old_value vs new_value
    - percentage_change is calculated from the value difference
*/

CREATE OR REPLACE FUNCTION public.log_value_change()
RETURNS TRIGGER AS $$
BEGIN
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
      COALESCE(OLD.value, 0)::integer,
      COALESCE(NEW.value, 0)::integer,
      COALESCE(OLD.demand, 0),
      COALESCE(NEW.demand, 0),
      COALESCE(OLD.rate_of_change, 'Stable'),
      COALESCE(NEW.rate_of_change, 'Stable'),
      now(),
      CASE
        WHEN NEW.value > OLD.value THEN 'increase'
        WHEN NEW.value < OLD.value THEN 'decrease'
        ELSE 'stable'
      END,
      CASE
        WHEN OLD.value = 0 THEN 0
        ELSE ROUND(((NEW.value - OLD.value)::numeric / OLD.value::numeric) * 100, 2)
      END
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists to avoid errors
DROP TRIGGER IF EXISTS trigger_log_value_change ON public.items;

CREATE TRIGGER trigger_log_value_change
  AFTER UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.log_value_change();
