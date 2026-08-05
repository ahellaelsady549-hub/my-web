CREATE TABLE public.gym_user_program (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  program_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gym_user_program TO authenticated;
GRANT ALL ON public.gym_user_program TO service_role;
ALTER TABLE public.gym_user_program ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own program select" ON public.gym_user_program FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own program insert" ON public.gym_user_program FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own program update" ON public.gym_user_program FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own program delete" ON public.gym_user_program FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER gym_user_program_updated BEFORE UPDATE ON public.gym_user_program FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.gym_workout_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  program_key text NOT NULL,
  day_key text NOT NULL,
  exercise_name text NOT NULL,
  log_date date NOT NULL DEFAULT (now()::date),
  completed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date, day_key, exercise_name)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gym_workout_logs TO authenticated;
GRANT ALL ON public.gym_workout_logs TO service_role;
ALTER TABLE public.gym_workout_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own logs select" ON public.gym_workout_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own logs insert" ON public.gym_workout_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own logs update" ON public.gym_workout_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own logs delete" ON public.gym_workout_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.gym_food_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  name text NOT NULL,
  ingredients text,
  quantity_grams numeric,
  calories numeric,
  protein numeric,
  carbs numeric,
  fats numeric,
  risk_level text,
  risk_reason text,
  source text NOT NULL DEFAULT 'manual',
  ai_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gym_food_logs TO authenticated;
GRANT ALL ON public.gym_food_logs TO service_role;
ALTER TABLE public.gym_food_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own food select" ON public.gym_food_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own food insert" ON public.gym_food_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own food update" ON public.gym_food_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own food delete" ON public.gym_food_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.gym_video_analyses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  exercise_name text NOT NULL,
  video_path text,
  analysis text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gym_video_analyses TO authenticated;
GRANT ALL ON public.gym_video_analyses TO service_role;
ALTER TABLE public.gym_video_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own video select" ON public.gym_video_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own video insert" ON public.gym_video_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own video update" ON public.gym_video_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own video delete" ON public.gym_video_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id);