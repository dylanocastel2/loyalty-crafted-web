
-- 1. Add is_homepage to custom_pages (with unique partial index)
ALTER TABLE public.custom_pages ADD COLUMN IF NOT EXISTS is_homepage boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS custom_pages_one_homepage_idx ON public.custom_pages ((is_homepage)) WHERE is_homepage = true;

-- 2. Branches table
CREATE TABLE IF NOT EXISTS public.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  icon text NOT NULL DEFAULT 'Building2',
  short_desc text NOT NULL DEFAULT '',
  hero_title text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  problems jsonb NOT NULL DEFAULT '[]'::jsonb,
  opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  loyalty_value text NOT NULL DEFAULT '',
  scenarios jsonb NOT NULL DEFAULT '[]'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  why_us jsonb NOT NULL DEFAULT '[]'::jsonb,
  klantcase_filter text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT '',
  meta_title text,
  meta_description text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.branches TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.branches TO authenticated;
GRANT ALL ON public.branches TO service_role;

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branches public read published"
ON public.branches FOR SELECT TO anon, authenticated
USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage branches"
ON public.branches FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER branches_set_updated_at
BEFORE UPDATE ON public.branches
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Page presets table
CREATE TABLE IF NOT EXISTS public.page_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.page_presets TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.page_presets TO authenticated;
GRANT ALL ON public.page_presets TO service_role;

ALTER TABLE public.page_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Presets readable by everyone"
ON public.page_presets FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage presets"
ON public.page_presets FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER page_presets_set_updated_at
BEFORE UPDATE ON public.page_presets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Navigation items
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  path text NOT NULL,
  parent_id uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.navigation_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.navigation_items TO authenticated;
GRANT ALL ON public.navigation_items TO service_role;

ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nav items readable by everyone"
ON public.navigation_items FOR SELECT TO anon, authenticated
USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage nav items"
ON public.navigation_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER navigation_items_set_updated_at
BEFORE UPDATE ON public.navigation_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
