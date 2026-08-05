CREATE TABLE public.gym_nutrition_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  calories numeric,
  protein numeric,
  carbs numeric,
  fats numeric,
  goal text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gym_nutrition_goals TO authenticated;
GRANT ALL ON public.gym_nutrition_goals TO service_role;

ALTER TABLE public.gym_nutrition_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gym_goals_select_own" ON public.gym_nutrition_goals
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "gym_goals_insert_own" ON public.gym_nutrition_goals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gym_goals_update_own" ON public.gym_nutrition_goals
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gym_goals_delete_own" ON public.gym_nutrition_goals
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_gym_nutrition_goals_updated_at
  BEFORE UPDATE ON public.gym_nutrition_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.gym_workout_logs
  ADD COLUMN IF NOT EXISTS weight_kg numeric,
  ADD COLUMN IF NOT EXISTS reps integer,
  ADD COLUMN IF NOT EXISTS sets integer;