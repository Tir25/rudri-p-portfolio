-- Migration: Create research papers table
CREATE TABLE IF NOT EXISTS papers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  authors TEXT[] NOT NULL,
  abstract TEXT,
  category VARCHAR(100),
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_papers_category ON papers(category);

-- Trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_papers_timestamp ON papers;
CREATE TRIGGER update_papers_timestamp
BEFORE UPDATE ON papers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();