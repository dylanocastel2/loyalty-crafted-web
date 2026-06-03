CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id TEXT NOT NULL,
  form_title TEXT,
  page_path TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.form_submissions TO anon, authenticated;
GRANT SELECT, DELETE ON public.form_submissions TO authenticated;
GRANT ALL ON public.form_submissions TO service_role;

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit forms"
ON public.form_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(form_id) BETWEEN 1 AND 200
  AND (form_title IS NULL OR char_length(form_title) <= 300)
  AND (page_path IS NULL OR char_length(page_path) <= 500)
  AND jsonb_typeof(data) = 'object'
);

CREATE POLICY "Admins view submissions"
ON public.form_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Editors view submissions"
ON public.form_submissions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Admins delete submissions"
ON public.form_submissions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_form_submissions_form_id ON public.form_submissions(form_id);
CREATE INDEX idx_form_submissions_created_at ON public.form_submissions(created_at DESC);