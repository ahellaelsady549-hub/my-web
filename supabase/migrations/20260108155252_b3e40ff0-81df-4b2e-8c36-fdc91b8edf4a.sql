-- Create user_diseases table
CREATE TABLE public.user_diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'physical',
  notes TEXT,
  diagnosed_at DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_diseases ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own diseases" 
ON public.user_diseases 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diseases" 
ON public.user_diseases 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diseases" 
ON public.user_diseases 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diseases" 
ON public.user_diseases 
FOR DELETE 
USING (auth.uid() = user_id);