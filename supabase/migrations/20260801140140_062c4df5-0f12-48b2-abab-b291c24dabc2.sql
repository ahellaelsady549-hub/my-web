-- Restrict all SECURITY DEFINER functions from the implicit PUBLIC grant
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user_role() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin_email() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_doctor_rating() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.user_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_registered_users() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_community_stats() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_profile_public(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_doctors_public() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.request_doctor_role(uuid) FROM PUBLIC;

-- has_role is required by RLS policies evaluated as the signed-in role
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.user_role) TO authenticated;

-- Scope every has_role-based policy to authenticated only, so anon never evaluates it
DROP POLICY IF EXISTS "Admins can view reports" ON public.community_reports;
CREATE POLICY "Admins can view reports" ON public.community_reports
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update reports" ON public.community_reports;
CREATE POLICY "Admins can update reports" ON public.community_reports
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Auth users can report" ON public.community_reports;
CREATE POLICY "Auth users can report" ON public.community_reports
FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Admins manage bans" ON public.community_bans;
CREATE POLICY "Admins manage bans" ON public.community_bans
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users check own ban" ON public.community_bans;
CREATE POLICY "Users check own ban" ON public.community_bans
FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view visits" ON public.site_visits;
CREATE POLICY "Admins can view visits" ON public.site_visits
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Auth users can view posts in their category" ON public.community_posts;
CREATE POLICY "Auth users can view posts in their category" ON public.community_posts
FOR SELECT TO authenticated USING (
  NOT EXISTS (SELECT 1 FROM public.community_bans b WHERE b.user_id = auth.uid())
  AND (
    (category = 'users_only' AND NOT public.has_role(auth.uid(), 'doctor'))
    OR (category = 'doctors_only' AND public.has_role(auth.uid(), 'doctor'))
    OR category = 'doctors_and_users'
  )
);

DROP POLICY IF EXISTS "Auth users can create posts" ON public.community_posts;
CREATE POLICY "Auth users can create posts" ON public.community_posts
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (SELECT 1 FROM public.community_bans b WHERE b.user_id = auth.uid())
  AND (
    (category = 'users_only' AND NOT public.has_role(auth.uid(), 'doctor'))
    OR (category = 'doctors_only' AND public.has_role(auth.uid(), 'doctor'))
    OR category = 'doctors_and_users'
  )
);

DROP POLICY IF EXISTS "Users or admins can delete posts" ON public.community_posts;
CREATE POLICY "Users or admins can delete posts" ON public.community_posts
FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can view all posts" ON public.community_posts;
CREATE POLICY "Admins can view all posts" ON public.community_posts
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can update own posts" ON public.community_posts;
CREATE POLICY "Users can update own posts" ON public.community_posts
FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);