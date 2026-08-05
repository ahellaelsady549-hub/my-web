DROP POLICY IF EXISTS "Users can insert their own medications" ON public.user_medications;
CREATE POLICY "Users can insert their own medications" ON public.user_medications
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    disease_id IS NULL
    OR EXISTS (SELECT 1 FROM public.user_diseases d WHERE d.id = disease_id AND d.user_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can update their own medications" ON public.user_medications;
CREATE POLICY "Users can update their own medications" ON public.user_medications
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND (
    disease_id IS NULL
    OR EXISTS (SELECT 1 FROM public.user_diseases d WHERE d.id = disease_id AND d.user_id = auth.uid())
  )
);

DROP POLICY IF EXISTS "Users can delete their own medications" ON public.user_medications;
CREATE POLICY "Users can delete their own medications" ON public.user_medications
FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own medications" ON public.user_medications;
CREATE POLICY "Users can view their own medications" ON public.user_medications
FOR SELECT TO authenticated USING (auth.uid() = user_id);