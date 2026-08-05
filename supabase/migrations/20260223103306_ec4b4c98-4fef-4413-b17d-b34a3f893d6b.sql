
-- Community posts table
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('doctors_only', 'doctors_and_users', 'users_only')),
  content TEXT,
  image_url TEXT,
  voice_url TEXT,
  parent_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Community reports
CREATE TABLE public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

-- Community bans
CREATE TABLE public.community_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  banned_by UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_bans ENABLE ROW LEVEL SECURITY;

-- Site visits for visitor tracking
CREATE TABLE public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  visitor_hash TEXT
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

-- Storage bucket for community media
INSERT INTO storage.buckets (id, name, public) VALUES ('community-media', 'community-media', true);

-- RLS for community_posts
CREATE POLICY "Auth users can view posts in their category" ON public.community_posts
  FOR SELECT USING (
    auth.uid() IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM public.community_bans WHERE community_bans.user_id = auth.uid())
    AND (
      (category = 'users_only' AND NOT public.has_role(auth.uid(), 'doctor'))
      OR (category = 'doctors_only' AND public.has_role(auth.uid(), 'doctor'))
      OR (category = 'doctors_and_users')
    )
  );

CREATE POLICY "Auth users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND NOT EXISTS (SELECT 1 FROM public.community_bans WHERE community_bans.user_id = auth.uid())
    AND (
      (category = 'users_only' AND NOT public.has_role(auth.uid(), 'doctor'))
      OR (category = 'doctors_only' AND public.has_role(auth.uid(), 'doctor'))
      OR (category = 'doctors_and_users')
    )
  );

CREATE POLICY "Users can update own posts" ON public.community_posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users or admins can delete posts" ON public.community_posts
  FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admins can view all posts
CREATE POLICY "Admins can view all posts" ON public.community_posts
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS for community_reports
CREATE POLICY "Auth users can report" ON public.community_reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view reports" ON public.community_reports
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports" ON public.community_reports
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS for community_bans
CREATE POLICY "Admins manage bans" ON public.community_bans
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users check own ban" ON public.community_bans
  FOR SELECT USING (auth.uid() = user_id);

-- RLS for site_visits
CREATE POLICY "Anyone can insert visits" ON public.site_visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view visits" ON public.site_visits
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Storage policies for community-media
CREATE POLICY "Auth users upload community media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'community-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Anyone view community media" ON storage.objects
  FOR SELECT USING (bucket_id = 'community-media');

-- Function to get community stats (for admin)
CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_visitors', (SELECT COUNT(DISTINCT visitor_hash) FROM public.site_visits),
    'total_posts', (SELECT COUNT(*) FROM public.community_posts),
    'pending_reports', (SELECT COUNT(*) FROM public.community_reports WHERE status = 'pending')
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to check if user is admin by email
CREATE OR REPLACE FUNCTION public.is_admin_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'mozizooo443@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-assign admin role
CREATE TRIGGER assign_admin_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.is_admin_email();

-- Enable realtime for community posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
