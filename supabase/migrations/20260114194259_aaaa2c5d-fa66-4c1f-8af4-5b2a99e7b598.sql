-- 1. Drop the insecure self-assignment policy for user_roles
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

-- 2. Create a trigger function to assign default 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only insert if no role exists for this user
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN new;
END;
$$;

-- 3. Create trigger for automatic role assignment
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- 4. Create admin-only policy for inserting roles (prevents self-escalation)
-- Only service role or existing admins can add roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (
  -- Allow service role (triggers) or check if current user is admin
  auth.uid() IS NULL OR 
  public.has_role(auth.uid(), 'user'::user_role) = false
);

-- 5. Create a secure function to request doctor role (requires verification)
CREATE OR REPLACE FUNCTION public.request_doctor_role(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_doctor_exists boolean;
  v_is_verified boolean;
BEGIN
  -- Check if doctor profile exists and is verified
  SELECT EXISTS(
    SELECT 1 FROM public.doctors 
    WHERE user_id = p_user_id
  ), COALESCE(
    (SELECT is_verified FROM public.doctors WHERE user_id = p_user_id),
    false
  ) INTO v_doctor_exists, v_is_verified;
  
  -- Only verified doctors can get doctor role
  IF v_doctor_exists AND v_is_verified THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, 'doctor')
    ON CONFLICT (user_id, role) DO NOTHING;
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 6. Add rate limiting policy for messages table
DROP POLICY IF EXISTS "Rate limit messages" ON public.messages;
CREATE POLICY "Rate limit messages"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  (SELECT COUNT(*) FROM public.messages 
   WHERE sender_id = auth.uid() 
   AND created_at > now() - interval '1 minute') < 20
);

-- 7. Add rate limiting policy for doctor_ratings
DROP POLICY IF EXISTS "Rate limit ratings" ON public.doctor_ratings;
CREATE POLICY "Rate limit ratings"
ON public.doctor_ratings FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  (SELECT COUNT(*) FROM public.doctor_ratings 
   WHERE user_id = auth.uid() 
   AND created_at > now() - interval '1 hour') < 10
);

-- 8. Update existing users to have 'user' role if they don't have any
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::user_role FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id, role) DO NOTHING;