
DROP POLICY IF EXISTS "Anyone can upload form attachments" ON storage.objects;

CREATE POLICY "Anyone can upload form attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'form-uploads'
  AND length(name) BETWEEN 1 AND 255
  AND position('/' in name) = 0
);
