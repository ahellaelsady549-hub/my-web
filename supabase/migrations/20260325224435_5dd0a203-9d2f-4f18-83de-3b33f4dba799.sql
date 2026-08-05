
-- Fix overly permissive notification insert policy
DROP POLICY "Auth users can create notifications" ON public.community_notifications;
CREATE POLICY "Auth users can create notifications" ON public.community_notifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = actor_id);
