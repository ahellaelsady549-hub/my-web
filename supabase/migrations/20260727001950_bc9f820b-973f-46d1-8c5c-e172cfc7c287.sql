
-- Recreate public views with security_invoker so RLS on base tables applies,
-- and restrict access to authenticated users only.
DROP VIEW IF EXISTS public.doctors_public;
CREATE VIEW public.doctors_public
WITH (security_invoker = true) AS
SELECT id, user_id, specialty, bio, rating, rating_count, is_verified, created_at, updated_at
FROM public.doctors
WHERE is_verified = true;

REVOKE ALL ON public.doctors_public FROM PUBLIC, anon;
GRANT SELECT ON public.doctors_public TO authenticated;

DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = true) AS
SELECT id, user_id, full_name, avatar_url, created_at, updated_at
FROM public.profiles;

REVOKE ALL ON public.profiles_public FROM PUBLIC, anon;
GRANT SELECT ON public.profiles_public TO authenticated;

-- Allow users to update and delete their own personality results
CREATE POLICY "Users can update their own personality results"
ON public.user_personality_results
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personality results"
ON public.user_personality_results
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
