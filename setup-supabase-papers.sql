-- Supabase Research Papers Setup Script
-- Run this in your Supabase SQL Editor to set up the papers functionality

-- Create papers table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_papers_category ON papers(category);
CREATE INDEX IF NOT EXISTS idx_papers_published ON papers(published);
CREATE INDEX IF NOT EXISTS idx_papers_created_at ON papers(created_at);
CREATE INDEX IF NOT EXISTS idx_papers_author_id ON papers(author_id);
CREATE INDEX IF NOT EXISTS idx_papers_keywords ON papers USING GIN(keywords);

-- Enable Row Level Security
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to published papers
CREATE POLICY "Public can view published papers" ON papers
  FOR SELECT USING (published = true);

-- Allow authenticated users to create papers
CREATE POLICY "Authenticated users can create papers" ON papers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow paper authors to update their own papers
CREATE POLICY "Authors can update their own papers" ON papers
  FOR UPDATE USING (auth.uid() = author_id);

-- Allow paper authors to delete their own papers
CREATE POLICY "Authors can delete their own papers" ON papers
  FOR DELETE USING (auth.uid() = author_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_papers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_papers_updated_at_trigger
  BEFORE UPDATE ON papers
  FOR EACH ROW
  EXECUTE FUNCTION update_papers_updated_at();

-- Insert sample papers (optional)
INSERT INTO papers (title, authors, abstract, category, keywords, file_path, file_name, file_size, mime_type, published, author_id) 
VALUES 
(
  'Machine Learning in Academic Research',
  ARRAY['Dr. John Smith', 'Dr. Jane Doe'],
  'This paper explores the applications of machine learning techniques in academic research environments, focusing on data analysis and pattern recognition.',
  'Computer Science',
  ARRAY['machine learning', 'academic research', 'data analysis'],
  'sample-papers/ml-research.pdf',
  'ml-research.pdf',
  2048576,
  'application/pdf',
  true,
  (SELECT id FROM auth.users WHERE email = 'rudridave1998@gmail.com' LIMIT 1)
),
(
  'Advances in Quantum Computing',
  ARRAY['Dr. Alice Johnson'],
  'A comprehensive review of recent developments in quantum computing and their implications for future technology.',
  'Physics',
  ARRAY['quantum computing', 'physics', 'technology'],
  'sample-papers/quantum-computing.pdf',
  'quantum-computing.pdf',
  1536000,
  'application/pdf',
  true,
  (SELECT id FROM auth.users WHERE email = 'rudridave1998@gmail.com' LIMIT 1)
) ON CONFLICT DO NOTHING;

-- Note: You'll also need to create a storage bucket called 'Research Papers' in your Supabase dashboard
-- Go to Storage > Create a new bucket > Name it 'Research Papers' > Set it to public
