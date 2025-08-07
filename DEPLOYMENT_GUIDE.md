# 🚀 Production Deployment Guide

This guide will help you deploy your Rudri Dave website to production with proper security, HTTPS, and environment configuration.

## 📋 Pre-Deployment Checklist

### ✅ **Backend Requirements**
- [ ] PostgreSQL database set up
- [ ] Environment variables configured
- [ ] SSL certificate obtained
- [ ] Domain name configured
- [ ] Production database credentials updated
- [ ] JWT secret changed to strong random string
- [ ] Admin credentials updated

### ✅ **Frontend Requirements**
- [ ] Environment variables configured
- [ ] API URL updated for production
- [ ] Build optimized for production
- [ ] Static assets optimized

## 🔧 **Environment Configuration**

### **Backend Environment Variables**

Create a `.env` file in the `backend/` directory:

```env
# Production Environment
NODE_ENV=production
PORT=4000

# Database Configuration (Production)
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-secure-db-password
DB_NAME=rudri_db_production
DB_SSL=true

# JWT Configuration (Generate a strong secret)
JWT_SECRET=your-very-long-and-secure-jwt-secret-key
JWT_EXPIRES_IN=1d

# Admin User Configuration
ADMIN_EMAIL=rudridave1998@gmail.com
ADMIN_PASSWORD=19111998

# CORS Configuration (Your domain)
CORS_ORIGIN=https://yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security Configuration
COOKIE_SECURE=true
COOKIE_HTTP_ONLY=true
COOKIE_MAX_AGE=86400000
```

### **Frontend Environment Variables**

Create a `.env` file in the `my-react-app/` directory:

```env
# API Configuration
VITE_API_URL=https://yourdomain.com

# Application Configuration
VITE_APP_NAME=Rudri Dave
VITE_APP_DESCRIPTION=Personal website and research papers
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_BLOG=true
VITE_ENABLE_PAPERS=true
VITE_ENABLE_ADMIN=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=your-ga-id

# Social Media
VITE_TWITTER_HANDLE=@rudridave
VITE_GITHUB_URL=https://github.com/rudridave
VITE_LINKEDIN_URL=https://linkedin.com/in/rudridave

# Contact Information
VITE_CONTACT_EMAIL=rudridave1998@gmail.com

# Development Configuration
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

## 🛠️ **Deployment Options**

### **Option 1: Vercel (Recommended for Frontend)**

#### **Frontend Deployment**
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**:
   ```bash
   cd my-react-app
   vercel --prod
   ```

3. **Configure Environment Variables**:
   - Go to Vercel Dashboard
   - Add all frontend environment variables
   - Redeploy

#### **Backend Deployment**
1. **Deploy to Railway/Render/Heroku**:
   ```bash
   cd backend
   # Follow platform-specific deployment
   ```

### **Option 2: DigitalOcean App Platform**

1. **Connect GitHub Repository**
2. **Configure Build Settings**:
   - Frontend: `npm run build`
   - Backend: `npm start`
3. **Set Environment Variables**
4. **Deploy**

### **Option 3: AWS/VPS Manual Deployment**

#### **Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Nginx
sudo apt install nginx -y

# Install PM2
sudo npm install -g pm2
```

#### **Database Setup**
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE rudri_db_production;
CREATE USER rudri_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE rudri_db_production TO rudri_user;
\q
```

#### **Application Deployment**
```bash
# Clone repository
git clone https://github.com/yourusername/rudri-website.git
cd rudri-website

# Backend setup
cd backend
npm install
npm run build
pm2 start server.js --name "rudri-backend"

# Frontend setup
cd ../my-react-app
npm install
npm run build
```

#### **Nginx Configuration**
```nginx
# /etc/nginx/sites-available/rudri-website
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend
    location / {
        root /var/www/rudri-website/my-react-app/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:4000;
    }
}
```

## 🔒 **Security Checklist**

### **SSL/HTTPS Setup**
1. **Obtain SSL Certificate**:
   ```bash
   # Using Let's Encrypt
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

2. **Auto-renewal**:
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### **Database Security**
1. **Change default passwords**
2. **Enable SSL connections**
3. **Restrict database access**
4. **Regular backups**

### **Application Security**
1. **Strong JWT secret**
2. **Rate limiting enabled**
3. **CORS properly configured**
4. **Input validation**
5. **File upload restrictions**

## 📊 **Monitoring & Maintenance**

### **Logging**
```bash
# PM2 logs
pm2 logs rudri-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **Backup Strategy**
```bash
# Database backup
pg_dump -h localhost -U rudri_user rudri_db_production > backup.sql

# File uploads backup
tar -czf uploads-backup.tar.gz uploads/
```

### **Performance Monitoring**
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Server Monitoring**: New Relic, DataDog

## 🚀 **Deployment Commands**

### **Quick Deploy Script**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment..."

# Backend
cd backend
npm install
npm run build
pm2 restart rudri-backend

# Frontend
cd ../my-react-app
npm install
npm run build
sudo cp -r dist/* /var/www/rudri-website/

echo "✅ Deployment complete!"
```

### **Environment Setup**
```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Test database connection
cd backend
npm run db-status

# Test API
curl https://yourdomain.com/health
```

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**:
   - Check PostgreSQL is running
   - Verify credentials in `.env`
   - Check SSL configuration

2. **API Not Responding**:
   - Check if backend is running
   - Verify port configuration
   - Check firewall settings

3. **Frontend Build Errors**:
   - Clear node_modules and reinstall
   - Check environment variables
   - Verify API URL

4. **SSL Issues**:
   - Check certificate validity
   - Verify Nginx configuration
   - Check DNS settings

### **Performance Optimization**

1. **Enable Gzip Compression**:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Enable Caching**:
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Database Optimization**:
   - Add indexes for frequently queried columns
   - Regular VACUUM and ANALYZE
   - Connection pooling

## 📞 **Support & Maintenance**

### **Regular Tasks**
- [ ] Weekly database backups
- [ ] Monthly security updates
- [ ] Quarterly performance review
- [ ] Annual SSL certificate renewal

### **Emergency Contacts**
- **Domain Registrar**: Your domain provider
- **Hosting Provider**: Your hosting support
- **SSL Certificate**: Let's Encrypt support
- **Database**: PostgreSQL community

---

**🎉 Congratulations! Your website is now ready for production deployment.**

Remember to:
- Test thoroughly in staging environment
- Monitor performance and errors
- Keep backups regularly
- Update dependencies periodically
- Monitor security advisories
