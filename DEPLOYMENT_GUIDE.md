# 🚀 Complete Deployment Guide

This guide covers all deployment options for the Rudri P Portfolio website.

## 📋 Table of Contents

1. [Environment Setup](#environment-setup)
2. [Supabase Configuration](#supabase-configuration)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Platform-Specific Guides](#platform-specific-guides)
6. [Troubleshooting](#troubleshooting)

## 🔧 Environment Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd rudri-p-portfolio

# Install dependencies
cd my-react-app
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the `my-react-app` directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Supabase Configuration

### 1. Database Setup

Run these SQL scripts in your Supabase SQL Editor:

1. **Blogs Table**: `setup-supabase-blogs.sql`
2. **Papers Table**: `setup-supabase-papers.sql`
3. **Storage RLS**: `setup-storage-rls.sql`
4. **Papers Storage RLS**: `setup-papers-storage-rls.sql`

### 2. Storage Buckets

Create these storage buckets in Supabase Dashboard:

- **Blogs**: Public bucket for blog images
- **Research Papers**: Public bucket for PDF files

### 3. Authentication

- Enable Email/Password authentication
- Add your admin user: `rudridave1998@gmail.com`

## 💻 Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🌐 Production Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository to Vercel
   - Set environment variables in Vercel dashboard

2. **Build Configuration**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Option 2: Netlify

1. **Deploy Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

2. **Environment Variables**
   - Add in Netlify dashboard under Site settings > Environment variables

### Option 3: Render

1. **Service Configuration**
   - Type: Static Site
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Environment Variables**
   - Add in Render dashboard

### Option 4: GitHub Pages

1. **GitHub Actions Workflow**
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Repository Settings**
   - Enable GitHub Pages
   - Source: GitHub Actions

## 🔍 Platform-Specific Guides

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables
netlify env:set VITE_SUPABASE_URL your_supabase_url
netlify env:set VITE_SUPABASE_ANON_KEY your_supabase_anon_key
```

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Verify environment variables

2. **Supabase Connection Issues**
   - Verify URL and API key
   - Check CORS settings
   - Ensure RLS policies are set

3. **Image Upload Issues**
   - Verify storage bucket exists
   - Check bucket permissions
   - Ensure RLS policies for storage

4. **Authentication Issues**
   - Check Supabase Auth settings
   - Verify email/password auth is enabled
   - Check user exists in database

### Performance Optimization

1. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Optimize image sizes

2. **Code Splitting**
   - Implement React.lazy()
   - Use dynamic imports
   - Optimize bundle size

3. **Caching**
   - Set appropriate cache headers
   - Use CDN for static assets
   - Implement service worker

## 📊 Monitoring

### Analytics Setup

1. **Google Analytics**
   ```javascript
   // Add to index.html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Error Tracking**
   - Sentry for error monitoring
   - LogRocket for session replay

### Health Checks

- Monitor Supabase connection
- Check storage bucket health
- Verify authentication flow

## 🔒 Security

### Best Practices

1. **Environment Variables**
   - Never commit secrets
   - Use different keys for dev/prod
   - Rotate keys regularly

2. **Supabase Security**
   - Enable RLS on all tables
   - Use service role keys carefully
   - Monitor access logs

3. **Content Security**
   - Implement CSP headers
   - Sanitize user inputs
   - Validate file uploads

## 📈 Maintenance

### Regular Tasks

1. **Dependencies**
   ```bash
   npm audit
   npm update
   ```

2. **Database**
   - Monitor storage usage
   - Clean up old files
   - Backup data regularly

3. **Performance**
   - Monitor Core Web Vitals
   - Optimize images
   - Update dependencies

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review Supabase documentation
3. Check platform-specific guides
4. Open an issue in the repository

---

**Last Updated**: August 2024
**Version**: 2.0.0
