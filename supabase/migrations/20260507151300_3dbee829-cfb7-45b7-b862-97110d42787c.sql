
-- Editors: full content management (klantcases, pages, blocks, content) but NOT user_roles or contact deletes
CREATE POLICY "Editors can manage klantcases"
ON public.klantcases FOR ALL TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can read all klantcases"
ON public.klantcases FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can manage custom pages"
ON public.custom_pages FOR ALL TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can read all custom pages"
ON public.custom_pages FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can manage page blocks"
ON public.page_blocks FOR ALL TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can manage page content"
ON public.page_content FOR ALL TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

-- Editors and viewers can view contact submissions; editors can also update (mark read), but only admins can delete
CREATE POLICY "Editors can view contact submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Viewers can view contact submissions"
ON public.contact_submissions FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'viewer'::app_role));

CREATE POLICY "Editors can update contact submissions"
ON public.contact_submissions FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Viewers can update contact submissions read state"
ON public.contact_submissions FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'viewer'::app_role))
WITH CHECK (has_role(auth.uid(), 'viewer'::app_role));

-- All staff (admin/editor/viewer) can see their own role rows so the UI can detect their access level
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Allow editors to upload media
CREATE POLICY "Editors can upload media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'media' AND has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can update media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'media' AND has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can upload page media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'page-media' AND has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can update page media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'page-media' AND has_role(auth.uid(), 'editor'::app_role));
