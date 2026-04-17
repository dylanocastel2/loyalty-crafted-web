-- Custom pages table for the page builder
CREATE TABLE public.custom_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  show_in_menu BOOLEAN NOT NULL DEFAULT false,
  menu_label TEXT,
  menu_order INTEGER NOT NULL DEFAULT 0,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_custom_pages_slug ON public.custom_pages(slug);
CREATE INDEX idx_custom_pages_published ON public.custom_pages(published) WHERE published = true;

ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read published pages
CREATE POLICY "Anyone can read published custom pages"
ON public.custom_pages
FOR SELECT
USING (published = true);

-- Admins can read all
CREATE POLICY "Admins can read all custom pages"
ON public.custom_pages
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage
CREATE POLICY "Admins can manage custom pages"
ON public.custom_pages
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_custom_pages_updated_at
BEFORE UPDATE ON public.custom_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for page builder media
INSERT INTO storage.buckets (id, name, public)
VALUES ('page-media', 'page-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
CREATE POLICY "Public can view page media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'page-media');

CREATE POLICY "Admins can upload page media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'page-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update page media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'page-media' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete page media"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'page-media' AND has_role(auth.uid(), 'admin'::app_role));