-- Fix: Remove the overly permissive policy that exposes all emails to authenticated users
-- Instead, authenticated users should only access profiles through the secure view that excludes email

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles via view" ON public.profiles;

-- Update the profiles_public view to ensure it excludes email
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
  SELECT id, user_id, full_name, avatar_url, created_at, updated_at
  FROM profiles;
-- Note: email is intentionally excluded from this view

-- Create a policy that allows authenticated users to view profiles through the view (without email)
-- The view excludes email, so this is safe
CREATE POLICY "Authenticated users can view public profile data"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    -- Either viewing own profile (full access)
    auth.uid() = user_id
    -- Or accessing through application (view will exclude email)
    OR auth.uid() IS NOT NULL
  );

-- Wait, the above still exposes email when queried directly
-- Better approach: Only allow own profile access directly, require view/function for others

-- Drop the policy we just created
DROP POLICY IF EXISTS "Authenticated users can view public profile data" ON public.profiles;

-- Keep only the "Users can view their own profile" policy for direct table access
-- This means:
-- 1. Users can see their own profile (with email) via direct query
-- 2. Users can see other profiles (without email) via profiles_public view or get_profile_public function

-- The existing "Users can view their own profile" policy is sufficient
-- No additional policies needed - the view with security_invoker will respect RLS