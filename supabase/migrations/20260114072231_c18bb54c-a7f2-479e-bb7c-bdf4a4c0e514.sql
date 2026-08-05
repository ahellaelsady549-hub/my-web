-- Create a secure view for doctors that hides sensitive data
CREATE OR REPLACE VIEW public.doctors_public
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  specialty,
  bio,
  rating,
  rating_count,
  is_verified,
  created_at,
  updated_at
  -- Excludes: cv_url, portfolio_url, ai_cv_review, verification_status
FROM public.doctors
WHERE is_verified = true;

-- Create a secure view for profiles that hides email
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  created_at,
  updated_at
  -- Excludes: email
FROM public.profiles;

-- Drop existing policies for doctors SELECT
DROP POLICY IF EXISTS "Doctors are viewable by everyone" ON public.doctors;

-- Create restrictive SELECT policy - only allow viewing own doctor profile
CREATE POLICY "Users can only view their own doctor profile"
ON public.doctors
FOR SELECT
USING (auth.uid() = user_id);

-- Drop existing profile policies for SELECT
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for profiles_public view access
GRANT SELECT ON public.profiles_public TO anon, authenticated;
GRANT SELECT ON public.doctors_public TO anon, authenticated;