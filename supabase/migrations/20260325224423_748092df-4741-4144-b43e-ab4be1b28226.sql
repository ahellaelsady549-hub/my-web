
-- Create community_likes table
CREATE TABLE public.community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view likes
CREATE POLICY "Anyone auth can view likes" ON public.community_likes
  FOR SELECT TO authenticated USING (true);

-- Users can like
CREATE POLICY "Users can like posts" ON public.community_likes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can unlike (delete own likes)
CREATE POLICY "Users can unlike" ON public.community_likes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create community_notifications table
CREATE TABLE public.community_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id uuid REFERENCES public.community_posts(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'reply',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  actor_id uuid NOT NULL
);

ALTER TABLE public.community_notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users view own notifications" ON public.community_notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- System can insert notifications (any authenticated user triggering a reply)
CREATE POLICY "Auth users can create notifications" ON public.community_notifications
  FOR INSERT TO authenticated WITH CHECK (true);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users can mark read" ON public.community_notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_likes;
