CREATE TABLE public.ask_me_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ask_me_history TO authenticated;
GRANT ALL ON public.ask_me_history TO service_role;
ALTER TABLE public.ask_me_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own ask history" ON public.ask_me_history FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own ask history" ON public.ask_me_history FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own ask history" ON public.ask_me_history FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX idx_ask_me_history_user_created ON public.ask_me_history (user_id, created_at DESC);