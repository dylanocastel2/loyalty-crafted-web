
-- Pop-up configuration (single active row, but allow multiple)
CREATE TABLE public.popup_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Standaard pop-up',
  enabled boolean NOT NULL DEFAULT false,
  title text NOT NULL DEFAULT '',
  delay_seconds integer NOT NULL DEFAULT 5,
  frequency text NOT NULL DEFAULT 'session', -- 'once' | 'session' | 'always'
  show_on_pages text[] NOT NULL DEFAULT ARRAY['*']::text[],
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.popup_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read popup configs"
ON public.popup_configs FOR SELECT TO public USING (true);

CREATE POLICY "Admins manage popup configs"
ON public.popup_configs FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Editors manage popup configs"
ON public.popup_configs FOR ALL TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER set_popup_configs_updated_at
BEFORE UPDATE ON public.popup_configs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pop-up responses
CREATE TABLE public.popup_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  popup_id uuid REFERENCES public.popup_configs(id) ON DELETE SET NULL,
  page_path text,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.popup_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit popup responses"
ON public.popup_responses FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins view popup responses"
ON public.popup_responses FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Editors view popup responses"
ON public.popup_responses FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Viewers view popup responses"
ON public.popup_responses FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'viewer'::app_role));

CREATE POLICY "Admins delete popup responses"
ON public.popup_responses FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Page views (analytics)
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  session_id text NOT NULL,
  duration_ms integer NOT NULL DEFAULT 0,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX page_views_path_idx ON public.page_views(path);
CREATE INDEX page_views_created_at_idx ON public.page_views(created_at);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can update own page views"
ON public.page_views FOR UPDATE TO public USING (true) WITH CHECK (true);

CREATE POLICY "Admins view page views"
ON public.page_views FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Editors view page views"
ON public.page_views FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Viewers view page views"
ON public.page_views FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'viewer'::app_role));

-- Seed initial popup with the requested flow
INSERT INTO public.popup_configs (name, enabled, title, delay_seconds, frequency, show_on_pages, questions)
VALUES (
  'Bezoekers feedback',
  true,
  'Heeft u gevonden wat u zocht?',
  10,
  'session',
  ARRAY['*']::text[],
  '[
    {"id":"q1","type":"choice","label":"Heeft u gevonden wat u zocht?","options":[
      {"label":"Ja","next":"q_yes"},
      {"label":"Nee","next":"q_no"}
    ]},
    {"id":"q_yes","type":"text","label":"Waar zocht u naar?","placeholder":"Bijv. spaarsysteem voor gemeenten"},
    {"id":"q_no","type":"text","label":"Wat miste u nog?","placeholder":"Vertel ons wat u nodig had"}
  ]'::jsonb
);
