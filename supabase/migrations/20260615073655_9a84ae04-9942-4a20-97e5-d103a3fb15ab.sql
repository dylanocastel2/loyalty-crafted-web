DROP POLICY IF EXISTS "Anyone can upload form attachments" ON storage.objects;

CREATE POLICY "Anyone can upload form attachments"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'form-uploads'
  AND length(name) BETWEEN 1 AND 255
  AND POSITION('/' IN name) = 0
  AND COALESCE((metadata->>'size')::bigint, 0) <= 10485760
  AND COALESCE(metadata->>'mimetype', '') IN (
    'image/png','image/jpeg','image/jpg','image/webp','image/gif','image/heic','image/heif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain','text/csv'
  )
);