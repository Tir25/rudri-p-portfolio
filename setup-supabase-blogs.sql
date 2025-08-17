-- Supabase Blog Setup Script
-- Run this in your Supabase SQL Editor to set up the blog functionality

-- Create blogs table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to published blogs
CREATE POLICY "Public can view published blogs" ON blogs
  FOR SELECT USING (published = true);

-- Allow authenticated users to create blogs
CREATE POLICY "Authenticated users can create blogs" ON blogs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow blog authors to update their own blogs
CREATE POLICY "Authors can update their own blogs" ON blogs
  FOR UPDATE USING (auth.uid() = author_id);

-- Allow blog authors to delete their own blogs
CREATE POLICY "Authors can delete their own blogs" ON blogs
  FOR DELETE USING (auth.uid() = author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blogs_updated_at_trigger
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_blogs_updated_at();

-- Insert a sample blog post (optional)
INSERT INTO blogs (title, content, slug, tags, published, author_id) 
VALUES (
  'Welcome to My Blog',
  'This is my first blog post using Supabase! I''m excited to share my thoughts and insights here.',
  'welcome-to-my-blog',
  ARRAY['welcome', 'first-post'],
  true,
  (SELECT id FROM auth.users WHERE email = 'rudridave1998@gmail.com' LIMIT 1)
) ON CONFLICT (slug) DO NOTHING;

-- Note: You'll also need to create a storage bucket called 'Blogs' in your Supabase dashboard
-- Go to Storage > Create a new bucket > Name it 'Blogs' > Set it to public
