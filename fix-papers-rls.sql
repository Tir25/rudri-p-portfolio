-- Fix Papers RLS Policy Issue
-- Run this in your Supabase SQL Editor to fix the update permission issue

-- First, let's check the current policies
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
WHERE tablename = 'papers';

-- Check if the papers table has the correct author_id values
SELECT 
    id,
    title,
    author_id,
    published
FROM papers 
LIMIT 10;

-- Check the current user's ID
SELECT auth.uid() as current_user_id;

-- Drop ALL existing update policies to avoid conflicts
DROP POLICY IF EXISTS "Authors can update their own papers" ON papers;
DROP POLICY IF EXISTS "Authenticated users can update papers" ON papers;
DROP POLICY IF EXISTS "Users can update their own papers" ON papers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON papers;

-- Create a more permissive update policy for testing
-- This allows any authenticated user to update any paper (for testing purposes)
CREATE POLICY "Authenticated users can update papers" ON papers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Alternative: If you want to keep the author restriction, use this instead:
-- CREATE POLICY "Authors can update their own papers" ON papers
--   FOR UPDATE USING (auth.uid() = author_id OR author_id IS NULL);

-- Verify the new policy was created
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
WHERE tablename = 'papers' AND cmd = 'UPDATE';

-- Update any papers that don't have an author_id to use the current user
-- (This is only needed if you have papers without author_id)
UPDATE papers 
SET author_id = auth.uid() 
WHERE author_id IS NULL;

-- Verify the update
SELECT 
    id,
    title,
    author_id,
    published
FROM papers 
WHERE author_id IS NOT NULL
LIMIT 10;
