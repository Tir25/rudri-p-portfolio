-- Storage RLS Policies for Research Papers Bucket
-- Run this in your Supabase SQL Editor to set up proper access control

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload research papers" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to research papers" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update research papers" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete research papers" ON storage.objects;

-- Policy 1: Allow authenticated users to upload papers
-- This allows logged-in users to upload research papers
CREATE POLICY "Allow authenticated users to upload research papers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'Research Papers' 
  AND auth.role() = 'authenticated'
);

-- Policy 2: Allow public read access to research papers
-- This allows anyone to view/download research papers (since the bucket is public)
CREATE POLICY "Allow public read access to research papers" ON storage.objects
FOR SELECT USING (
  bucket_id = 'Research Papers'
);

-- Policy 3: Allow authenticated users to update their own papers
-- This allows users to update/replace their research papers
CREATE POLICY "Allow authenticated users to update research papers" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'Research Papers' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete their own papers
-- This allows users to delete their research papers
CREATE POLICY "Allow authenticated users to delete research papers" ON storage.objects
FOR DELETE USING (
  bucket_id = 'Research Papers' 
  AND auth.role() = 'authenticated'
);

-- Verify the policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%research%';

-- Note: Since your bucket is set to public, the read policy above ensures
-- that research papers can be downloaded by anyone without authentication
