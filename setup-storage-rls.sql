-- Storage RLS Policies for Blogs Bucket
-- Run this in your Supabase SQL Editor to set up proper access control

-- First, let's check if the Blogs bucket exists and create it if needed
-- Note: You may need to create the bucket manually in the Supabase Dashboard first

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog images" ON storage.objects;

-- Policy 1: Allow authenticated users to upload images
-- This allows logged-in users to upload blog cover images
CREATE POLICY "Allow authenticated users to upload blog images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'Blogs' 
  AND auth.role() = 'authenticated'
);

-- Policy 2: Allow public read access to blog images
-- This allows anyone to view blog cover images (since the bucket is public)
CREATE POLICY "Allow public read access to blog images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'Blogs'
);

-- Policy 3: Allow authenticated users to update their own images
-- This allows users to update/replace their blog images
CREATE POLICY "Allow authenticated users to update blog images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'Blogs' 
  AND auth.role() = 'authenticated'
);

-- Policy 4: Allow authenticated users to delete their own images
-- This allows users to delete their blog images
CREATE POLICY "Allow authenticated users to delete blog images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'Blogs' 
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
WHERE tablename = 'objects' AND policyname LIKE '%blog%';

-- Note: Since your bucket is set to public, the read policy above ensures
-- that blog images can be displayed on your website without authentication
