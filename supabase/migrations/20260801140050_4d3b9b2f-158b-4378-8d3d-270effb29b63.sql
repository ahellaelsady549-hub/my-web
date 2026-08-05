-- 1) Trigger-only functions must not be callable via the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user_role() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.is_admin_email() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_doctor_rating() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- 2) Privileged / auth-only RPCs: not callable anonymously
REVOKE ALL ON FUNCTION public.get_registered_users() FROM anon;
REVOKE ALL ON FUNCTION public.get_community_stats() FROM anon;
REVOKE ALL ON FUNCTION public.get_profile_public(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.get_doctors_public() FROM anon;
REVOKE ALL ON FUNCTION public.request_doctor_role(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.user_role) FROM anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_registered_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_community_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_public(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_doctors_public() TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_doctor_role(uuid) TO authenticated;

-- 3) Remove always-true INSERT policy on site_visits
DROP POLICY IF EXISTS "Anyone can insert visits" ON public.site_visits;
CREATE POLICY "Visitors can log a visit with a valid hash"
ON public.site_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (
  visitor_hash IS NOT NULL
  AND length(visitor_hash) BETWEEN 8 AND 128
  AND visited_at > (now() - interval '5 minutes')
);

-- 4) Storage: community-media is now a private bucket
DROP POLICY IF EXISTS "Anyone view community media" ON storage.objects;
DROP POLICY IF EXISTS "Auth users upload community media" ON storage.objects;

CREATE POLICY "Signed-in users view community media"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'community-media');

CREATE POLICY "Signed-in users upload own community media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'community-media'
  AND owner = auth.uid()
  AND (storage.foldername(name))[2] = auth.uid()::text
);

CREATE POLICY "Owners update own community media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'community-media' AND owner = auth.uid())
WITH CHECK (bucket_id = 'community-media' AND owner = auth.uid());

CREATE POLICY "Owners delete own community media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'community-media' AND owner = auth.uid());