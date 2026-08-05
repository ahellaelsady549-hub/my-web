-- 1. Ban check without exposing ban records (hides banned_by admin identity)
CREATE OR REPLACE FUNCTION public.is_user_banned(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.community_bans WHERE user_id = _user_id)
$$;

REVOKE ALL ON FUNCTION public.is_user_banned(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_user_banned(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_user_banned(uuid) TO authenticated, service_role;

DROP POLICY IF EXISTS "Users check own ban" ON public.community_bans;

DROP POLICY IF EXISTS "Auth users can view posts in their category" ON public.community_posts;
CREATE POLICY "Auth users can view posts in their category"
ON public.community_posts
FOR SELECT
TO authenticated
USING (
  NOT public.is_user_banned(auth.uid())
  AND (
    (category = 'users_only' AND NOT public.has_role(auth.uid(), 'doctor'))
    OR (category = 'doctors_only' AND public.has_role(auth.uid(), 'doctor'))
    OR category = 'doctors_and_users'
  )
);

-- 2. Community media: only owner or users allowed to see the related post
DROP POLICY IF EXISTS "Signed-in users view community media" ON storage.objects;
CREATE POLICY "Signed-in users view community media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'community-media'
  AND (
    owner = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.community_posts p
      WHERE p.image_url LIKE '%' || storage.objects.name || '%'
         OR p.voice_url LIKE '%' || storage.objects.name || '%'
    )
  )
);

-- 3. Doctor ratings: reviews + reviewer identity no longer readable by anonymous visitors
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON public.doctor_ratings;
CREATE POLICY "Ratings viewable by signed-in users"
ON public.doctor_ratings
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can rate doctors" ON public.doctor_ratings;
CREATE POLICY "Users can rate doctors"
ON public.doctor_ratings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Rate limit ratings" ON public.doctor_ratings;
CREATE POLICY "Rate limit ratings"
ON public.doctor_ratings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    SELECT count(*) FROM public.doctor_ratings r
    WHERE r.user_id = auth.uid() AND r.created_at > now() - interval '1 hour'
  ) < 10
);

DROP POLICY IF EXISTS "Users can update their own ratings" ON public.doctor_ratings;
CREATE POLICY "Users can update their own ratings"
ON public.doctor_ratings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

REVOKE ALL ON public.doctor_ratings FROM anon;

-- 4. gym-videos bucket: owner-scoped policies for all operations
DROP POLICY IF EXISTS "Users view own gym videos" ON storage.objects;
CREATE POLICY "Users view own gym videos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'gym-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users upload own gym videos" ON storage.objects;
CREATE POLICY "Users upload own gym videos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gym-videos' AND (storage.foldername(name))[1] = auth.uid()::text AND owner = auth.uid());

DROP POLICY IF EXISTS "Users update own gym videos" ON storage.objects;
CREATE POLICY "Users update own gym videos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'gym-videos' AND (storage.foldername(name))[1] = auth.uid()::text)
WITH CHECK (bucket_id = 'gym-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users delete own gym videos" ON storage.objects;
CREATE POLICY "Users delete own gym videos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'gym-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 5. Reduce SECURITY DEFINER surface: doctors list can run with caller privileges (RLS already allows verified doctors)
CREATE OR REPLACE FUNCTION public.get_doctors_public()
RETURNS TABLE(id uuid, user_id uuid, specialty text, bio text, rating numeric, rating_count integer, is_verified boolean, created_at timestamp with time zone, updated_at timestamp with time zone)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT d.id, d.user_id, d.specialty, d.bio, d.rating, d.rating_count, d.is_verified, d.created_at, d.updated_at
  FROM public.doctors d
  WHERE d.is_verified = true;
END;
$$;

REVOKE ALL ON FUNCTION public.get_doctors_public() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_doctors_public() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_doctors_public() TO authenticated, service_role;