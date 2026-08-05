-- Drop the old views and recreate with security_invoker
DROP VIEW IF EXISTS public.profiles_public;
DROP VIEW IF EXISTS public.doctors_public;

-- Create profiles_public view with security_invoker for authenticated users only
CREATE VIEW public.profiles_public
WITH (security_invoker = on)
AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  created_at,
  updated_at
FROM public.profiles;

-- Create doctors_public view with security_invoker for authenticated users only  
CREATE VIEW public.doctors_public
WITH (security_invoker = on)
AS
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
FROM public.doctors
WHERE is_verified = true;

-- Update profiles RLS to allow authenticated users to view profiles via view
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Allow authenticated users to view other profiles (needed for chat/doctor profiles)
CREATE POLICY "Authenticated users can view profiles via view"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Update doctors RLS to allow authenticated users to view verified doctors via view
DROP POLICY IF EXISTS "Users can only view their own doctor profile" ON public.doctors;

CREATE POLICY "Users can view their own doctor profile"
ON public.doctors
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view verified doctors"
ON public.doctors
FOR SELECT
USING (auth.uid() IS NOT NULL AND is_verified = true);

-- Fix user_roles INSERT policy - use the trigger only approach
DROP POLICY IF EXISTS "System trigger can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

-- No direct inserts allowed - only the trigger (handle_new_user_role) can insert
-- The trigger runs with SECURITY DEFINER so it bypasses RLS
CREATE POLICY "No direct role inserts"
ON public.user_roles
FOR INSERT
WITH CHECK (false);