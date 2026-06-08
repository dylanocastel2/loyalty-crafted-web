
-- Restrict broad public SELECT on storage.objects to prevent bucket listing.
-- Public buckets (media, page-media) still serve files via public CDN URLs which bypass RLS.
DROP POLICY IF EXISTS "Anyone can view media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view page media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read form attachments" ON storage.objects;

-- Allow admins/editors to list/select media for the admin Media Library
CREATE POLICY "Staff can view media"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id IN ('media', 'page-media', 'form-uploads')
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);
