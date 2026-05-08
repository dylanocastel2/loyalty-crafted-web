
-- contact_submissions: replace true with sanity check
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND char_length(email) BETWEEN 3 AND 320
  AND email LIKE '%_@_%.__%'
  AND char_length(subject) BETWEEN 1 AND 300
  AND char_length(message) BETWEEN 1 AND 10000
  AND (company IS NULL OR char_length(company) <= 200)
);

-- popup_responses
DROP POLICY IF EXISTS "Anyone can submit popup responses" ON public.popup_responses;
CREATE POLICY "Anyone can submit popup responses"
ON public.popup_responses FOR INSERT TO anon, authenticated
WITH CHECK (
  jsonb_typeof(answers) = 'array'
  AND jsonb_array_length(answers) BETWEEN 1 AND 50
  AND (page_path IS NULL OR char_length(page_path) <= 500)
);

-- page_views: drop UPDATE, tighten INSERT
DROP POLICY IF EXISTS "Anyone can update own page views" ON public.page_views;
DROP POLICY IF EXISTS "Anyone can insert page views" ON public.page_views;
CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(path) BETWEEN 1 AND 500
  AND char_length(session_id) BETWEEN 8 AND 100
  AND duration_ms BETWEEN 0 AND 86400000
  AND (referrer IS NULL OR char_length(referrer) <= 1000)
);

-- heatmap_events
DROP POLICY IF EXISTS "Anyone can record heatmap events" ON public.heatmap_events;
CREATE POLICY "Anyone can record heatmap events"
ON public.heatmap_events FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(path) BETWEEN 1 AND 500
  AND char_length(session_id) BETWEEN 8 AND 100
  AND event_type IN ('click','move','scroll')
  AND x BETWEEN -10000 AND 100000
  AND y BETWEEN -10000 AND 100000
  AND viewport_w BETWEEN 1 AND 10000
  AND viewport_h BETWEEN 1 AND 10000
);

-- Lock down trigger helper: only the database itself needs to call it
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
