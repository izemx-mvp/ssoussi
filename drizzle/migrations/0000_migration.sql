CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  type text,
  message text NOT NULL,
  product_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contacts TO anon, authenticated;
GRANT ALL ON public.contacts TO service_role;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contacts FOR INSERT TO anon, authenticated WITH CHECK (length(name) BETWEEN 1 AND 120 AND length(email) BETWEEN 3 AND 255 AND length(message) BETWEEN 1 AND 3000);

CREATE TABLE public.prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  interest text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.prospects TO service_role;
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;