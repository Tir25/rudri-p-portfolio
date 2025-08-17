-- Complete Supabase Setup Script for Rudri P Portfolio
-- Run this entire script in your Supabase SQL Editor

-- ========================================
-- 1. BLOGS TABLE SETUP
-- ========================================

CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT true,
  cover_image_url TEXT,
  cover_image_path TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);

ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blogs" ON blogs
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can create blogs" ON blogs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can update their own blogs" ON blogs
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own blogs" ON blogs
  FOR DELETE USING (auth.uid() = author_id);

CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blogs_updated_at_trigger
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_blogs_updated_at();

-- ========================================
-- 2. PAPERS TABLE SETUP
-- ========================================

CREATE TABLE IF NOT EXISTS papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  authors TEXT[] NOT NULL,
  abstract TEXT,
  category VARCHAR(100),
  keywords TEXT[] DEFAULT '{}',
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  file_url TEXT,
  published BOOLEAN DEFAULT true,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_papers_category ON papers(category);
CREATE INDEX IF NOT EXISTS idx_papers_published ON papers(published);
CREATE INDEX IF NOT EXISTS idx_papers_created_at ON papers(created_at);
CREATE INDEX IF NOT EXISTS idx_papers_author_id ON papers(author_id);
CREATE INDEX IF NOT EXISTS idx_papers_keywords ON papers USING GIN(keywords);

ALTER TABLE papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published papers" ON papers
  FOR SELECT USING (published = true);

CREATE POLICY "Authenticated users can create papers" ON papers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Fix for papers update policy
DROP POLICY IF EXISTS "Authors can update their own papers" ON papers;
DROP POLICY IF EXISTS "Authenticated users can update papers" ON papers;
DROP POLICY IF EXISTS "Users can update their own papers" ON papers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON papers;

CREATE POLICY "Authenticated users can update papers" ON papers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authors can delete their own papers" ON papers
  FOR DELETE USING (auth.uid() = author_id);

CREATE OR REPLACE FUNCTION update_papers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_papers_updated_at_trigger
  BEFORE UPDATE ON papers
  FOR EACH ROW
  EXECUTE FUNCTION update_papers_updated_at();

-- Update any papers that don't have an author_id
UPDATE papers 
SET author_id = auth.uid() 
WHERE author_id IS NULL;

-- ========================================
-- 3. STORAGE RLS POLICIES
-- ========================================

-- Storage RLS Policies for Blogs Bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog images" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload blog images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'Blogs' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to blog images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'Blogs'
);

CREATE POLICY "Allow authenticated users to update blog images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'Blogs' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete blog images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'Blogs' 
  AND auth.role() = 'authenticated'
);

-- Storage RLS Policies for Research Papers Bucket
DROP POLICY IF EXISTS "Allow authenticated users to upload research papers" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to research papers" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update research papers" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete research papers" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload research papers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'Research Papers' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow public read access to research papers" ON storage.objects
FOR SELECT USING (
  bucket_id = 'Research Papers'
);

CREATE POLICY "Allow authenticated users to update research papers" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'Research Papers' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete research papers" ON storage.objects
FOR DELETE USING (
  bucket_id = 'Research Papers' 
  AND auth.role() = 'authenticated'
);

-- ========================================
-- 4. VERIFICATION QUERIES
-- ========================================

-- Check if tables were created
SELECT 'blogs' as table_name, COUNT(*) as row_count FROM blogs
UNION ALL
SELECT 'papers' as table_name, COUNT(*) as row_count FROM papers;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('blogs', 'papers', 'objects')
ORDER BY tablename, cmd;

-- Check storage policies
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
WHERE tablename = 'objects' AND policyname LIKE '%blog%' OR policyname LIKE '%research%';

-- ========================================
-- SETUP COMPLETE!
-- ========================================
-- 
-- Next steps:
-- 1. Create storage buckets named 'Blogs' and 'Research Papers' in Supabase Dashboard
-- 2. Set both buckets to Public
-- 3. Add admin user: rudridave1998@gmail.com
-- 4. Deploy your application
