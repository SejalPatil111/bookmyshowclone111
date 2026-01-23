-- Drop the overly permissive policies on movies
DROP POLICY IF EXISTS "Authenticated users can insert movies" ON public.movies;
DROP POLICY IF EXISTS "Authenticated users can update movies" ON public.movies;

-- Note: For a production app, you'd want admin-only policies here
-- For now, we'll just keep the SELECT policy for public read access