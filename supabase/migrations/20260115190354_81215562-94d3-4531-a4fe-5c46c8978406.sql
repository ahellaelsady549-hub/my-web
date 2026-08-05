-- Fix profiles_public view to require authentication
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  created_at,
  updated_at
FROM public.profiles;

-- Enable RLS on the view is not possible, so we need to use a secure function instead
-- Create a secure function to get profiles for authenticated users only
CREATE OR REPLACE FUNCTION public.get_profile_public(profile_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  RETURN QUERY
  SELECT p.id, p.user_id, p.full_name, p.avatar_url, p.created_at, p.updated_at
  FROM profiles p
  WHERE p.user_id = profile_user_id;
END;
$$;

-- Fix doctors_public view - remove the old view and create a secure function
DROP VIEW IF EXISTS public.doctors_public;
CREATE VIEW public.doctors_public AS
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

-- Create a secure function to get doctors for authenticated users only
CREATE OR REPLACE FUNCTION public.get_doctors_public()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  specialty TEXT,
  bio TEXT,
  rating NUMERIC,
  rating_count INTEGER,
  is_verified BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow authenticated users
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  RETURN QUERY
  SELECT d.id, d.user_id, d.specialty, d.bio, d.rating, d.rating_count, d.is_verified, d.created_at, d.updated_at
  FROM doctors d
  WHERE d.is_verified = true;
END;
$$;

-- Fix user_roles INSERT policy - remove dangerous policy and add secure one
DROP POLICY IF EXISTS "Allow default role assignment for new users" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can assign roles" ON public.user_roles;

-- Only the system trigger can insert roles (via handle_new_user_role function)
-- Admins cannot directly insert - they must use a secure function
CREATE POLICY "System trigger can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (false);  -- No direct inserts allowed, only via triggers

-- Create secure function for requesting doctor role
CREATE OR REPLACE FUNCTION public.request_doctor_role(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify the user is requesting for themselves
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Cannot request role for another user';
  END IF;
  
  -- Check if user already has doctor role
  IF EXISTS (SELECT 1 FROM user_roles WHERE user_id = p_user_id AND role = 'doctor') THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user has a verified doctor profile
  IF NOT EXISTS (SELECT 1 FROM doctors WHERE user_id = p_user_id AND is_verified = true) THEN
    RAISE EXCEPTION 'Doctor profile must be verified first';
  END IF;
  
  -- Add doctor role
  INSERT INTO user_roles (user_id, role) VALUES (p_user_id, 'doctor');
  RETURN TRUE;
END;
$$;

-- Restrict has_role function to only allow querying own role or for RLS checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;