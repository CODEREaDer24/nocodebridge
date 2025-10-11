-- Create a simple metadata table to initialize the database
CREATE TABLE IF NOT EXISTS public.app_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.app_metadata ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (public metadata)
CREATE POLICY "Allow public read access"
  ON public.app_metadata
  FOR SELECT
  USING (true);