# 🚀 COMPLETE DEPLOYMENT SCRIPT - Copy & Paste Commands

## 📋 **STEP-BY-STEP DEPLOYMENT GUIDE**

### **STEP 1: Create Environment File** ⚠️ **CRITICAL**

Create a file named `.env.local` in the `my-react-app` folder with this exact content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://nfhaaidiyxlbkuhcvjlw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5maGFhaWRpeXhsYmt1aGN2amx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MDI3MTksImV4cCI6MjA3MDk3ODcxOX0.oCmjv6z6ayfy5G1iNkKLaVBd2IWqI91bmTCh5-2njfk

# Application Configuration
VITE_APP_NAME=Rudri Dave Portfolio
VITE_APP_DESCRIPTION=Personal website and research papers
VITE_OWNER_EMAIL=rudridave1998@gmail.com

# Feature Flags
VITE_ENABLE_BLOG=true
VITE_ENABLE_PAPERS=true
VITE_ENABLE_ADMIN=true

# Contact Information
VITE_CONTACT_EMAIL=rudridave1998@gmail.com

# Social Media
VITE_TWITTER_HANDLE=@rudridave
VITE_GITHUB_URL=https://github.com/rudridave
VITE_LINKEDIN_URL=https://linkedin.com/in/rudridave

# Development
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

### **STEP 2: Test Local Build** ✅ **VERIFY**

Run these commands in your terminal (make sure you're in the `my-react-app` folder):

```bash
# Test the build
npm run build

# Test the development server
npm run dev
```

**Expected Output**: Build should complete without errors, and dev server should start on `http://localhost:5173`

### **STEP 3: Supabase Database Setup** ⚠️ **CRITICAL**

Go to your Supabase Dashboard: https://supabase.com/dashboard

1. **Open SQL Editor**
2. **Run these scripts in order:**

#### **Script 1: Blogs Setup**
Copy and paste this into Supabase SQL Editor:

```sql
-- Supabase Blog Setup Script
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
```

#### **Script 2: Papers Setup**
Copy and paste this into Supabase SQL Editor:

```sql
-- Supabase Research Papers Setup Script
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

CREATE POLICY "Authors can update their own papers" ON papers
  FOR UPDATE USING (auth.uid() = author_id);

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
```

#### **Script 3: Storage RLS Policies**
Copy and paste this into Supabase SQL Editor:

```sql
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
```

#### **Script 4: Fix Papers RLS Issue**
Copy and paste this into Supabase SQL Editor:

```sql
-- Fix Papers RLS Policy Issue
DROP POLICY IF EXISTS "Authors can update their own papers" ON papers;
DROP POLICY IF EXISTS "Authenticated users can update papers" ON papers;
DROP POLICY IF EXISTS "Users can update their own papers" ON papers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON papers;

CREATE POLICY "Authenticated users can update papers" ON papers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

UPDATE papers 
SET author_id = auth.uid() 
WHERE author_id IS NULL;
```

### **STEP 4: Create Storage Buckets** ⚠️ **CRITICAL**

In your Supabase Dashboard:

1. **Go to Storage**
2. **Click "Create a new bucket"**
3. **Create bucket named: `Blogs`**
   - Set to **Public**
   - Click "Create bucket"
4. **Create bucket named: `Research Papers`**
   - Set to **Public**
   - Click "Create bucket"

### **STEP 5: Set Up Authentication** ⚠️ **CRITICAL**

In your Supabase Dashboard:

1. **Go to Authentication > Settings**
2. **Enable "Email" provider**
3. **Go to Authentication > Users**
4. **Click "Add user"**
5. **Add your admin user:**
   - Email: `rudridave1998@gmail.com`
   - Password: `YourSecurePassword123!`
   - Click "Add user"

### **STEP 6: Deploy to Vercel** 🚀 **RECOMMENDED**

#### **Option A: Deploy from GitHub (Recommended)**

1. **Push to GitHub:**
```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Add your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/rudri-p-portfolio.git

# Push to GitHub
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Set these environment variables in Vercel:
     ```
     VITE_SUPABASE_URL=https://nfhaaidiyxlbkuhcvjlw.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5maGFhaWRpeXhsYmt1aGN2amx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MDI3MTksImV4cCI6MjA3MDk3ODcxOX0.oCmjv6z6ayfy5G1iNkKLaVBd2IWqI91bmTCh5-2njfk
     VITE_OWNER_EMAIL=rudridave1998@gmail.com
     VITE_APP_NAME=Rudri Dave Portfolio
     VITE_ENABLE_BLOG=true
     VITE_ENABLE_PAPERS=true
     VITE_ENABLE_ADMIN=true
     ```
   - Click "Deploy"

#### **Option B: Deploy to Netlify**

1. **Build locally:**
```bash
npm run build
```

2. **Deploy:**
   - Go to https://netlify.com
   - Drag and drop the `dist` folder
   - Set environment variables in Netlify dashboard
   - Deploy

### **STEP 7: Test Your Deployment** ✅ **VERIFY**

After deployment:

1. **Visit your deployed URL**
2. **Test these features:**
   - ✅ Home page loads
   - ✅ Blog page loads
   - ✅ Papers page loads
   - ✅ Login with admin account
   - ✅ Admin dashboard access
   - ✅ Upload blog post
   - ✅ Upload research paper

### **STEP 8: Troubleshooting** 🆘 **IF NEEDED**

If something doesn't work:

1. **Check Vercel/Netlify logs**
2. **Verify environment variables are set**
3. **Check Supabase logs**
4. **Test locally first:**
```bash
npm run dev
```

---

## 🎯 **QUICK COMMAND SUMMARY**

```bash
# 1. Create environment file
# (Create .env.local with content above)

# 2. Test build
npm run build

# 3. Test dev server
npm run dev

# 4. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 5. Deploy to Vercel
# (Follow Vercel steps above)
```

---

**🎉 FOLLOW THESE STEPS EXACTLY AND YOUR SITE WILL BE LIVE!**
