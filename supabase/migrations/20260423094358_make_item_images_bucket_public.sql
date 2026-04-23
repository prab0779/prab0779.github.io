/*
  # Make Item Images bucket public with read access

  1. Changes
    - Sets the "Item Images" storage bucket to public so images can be served via the public URL
    - Adds a SELECT policy allowing anyone (anon + authenticated) to read objects from the bucket
    - No upload/delete policy changes — only read access is opened
*/

UPDATE storage.buckets
SET public = true
WHERE id = 'Item Images';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read Item Images'
  ) THEN
    CREATE POLICY "Public read Item Images"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'Item Images');
  END IF;
END $$;
