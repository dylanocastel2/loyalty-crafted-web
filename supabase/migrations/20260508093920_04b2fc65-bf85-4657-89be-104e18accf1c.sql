
CREATE TABLE public.heatmap_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  session_id text NOT NULL,
  event_type text NOT NULL DEFAULT 'click',
  x integer NOT NULL,
  y integer NOT NULL,
  viewport_w integer NOT NULL,
  viewport_h integer NOT NULL,
  page_w integer NOT NULL DEFAULT 0,
  page_h integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX heatmap_events_path_idx ON public.heatmap_events(path);
CREATE INDEX heatmap_events_created_at_idx ON public.heatmap_events(created_at);

ALTER TABLE public.heatmap_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record heatmap events"
ON public.heatmap_events FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins view heatmap"
ON public.heatmap_events FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Editors view heatmap"
ON public.heatmap_events FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Viewers view heatmap"
ON public.heatmap_events FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'viewer'::app_role));

CREATE POLICY "Admins delete heatmap"
ON public.heatmap_events FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
