CREATE TABLE public.page_seo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read page seo"
ON public.page_seo FOR SELECT
USING (true);

CREATE POLICY "Admins manage page seo"
ON public.page_seo FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Editors manage page seo"
ON public.page_seo FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER update_page_seo_updated_at
BEFORE UPDATE ON public.page_seo
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();