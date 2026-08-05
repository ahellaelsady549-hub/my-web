CREATE OR REPLACE FUNCTION public.get_registered_users()
RETURNS TABLE(user_id uuid, full_name text, email text, created_at timestamptz, last_sign_in_at timestamptz, roles text[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN QUERY
  SELECT 
    u.id AS user_id,
    p.full_name,
    u.email::text,
    u.created_at,
    u.last_sign_in_at,
    COALESCE(ARRAY_AGG(ur.role::text) FILTER (WHERE ur.role IS NOT NULL), ARRAY[]::text[]) AS roles
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.user_id = u.id
  LEFT JOIN public.user_roles ur ON ur.user_id = u.id
  GROUP BY u.id, p.full_name, u.email, u.created_at, u.last_sign_in_at
  ORDER BY u.created_at DESC;
END;
$$;