# 🚀 Production Deployment Guide

This guide will help you deploy your Rudri Dave website to production with HTTPS, updated credentials, and proper security configuration.

## 📋 **Updated Production Configuration**

### **Admin Credentials Updated**
- **Email**: `rudridave1998@gmail.com`
- **Password**: `19111998`
- **JWT Secret**: Auto-generated secure key

### **HTTPS Configuration**
- SSL certificate support
- Automatic HTTPS detection
- Secure cookies enabled
- CORS configured for your domain

## 🔧 **Environment Setup**

### **Backend Production Environment**

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

# JWT Configuration (Auto-generated)
JWT_SECRET=your-very-long-and-secure-jwt-secret-key
JWT_EXPIRES_IN=1d

# Admin User Configuration
ADMIN_EMAIL=rudridave1998@gmail.com
ADMIN_PASSWORD=19111998

# CORS Configuration (Your domain)
CORS_ORIGIN=https://yourdomain.com
PRODUCTION_DOMAIN=yourdomain.com

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

# HTTPS Configuration
SSL_KEY_PATH=./ssl/private.key
SSL_CERT_PATH=./ssl/certificate.crt
```

### **Frontend Production Environment**

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
VITE_CONTACT_PHONE=

# Production Configuration
VITE_PRODUCTION_DOMAIN=yourdomain.com

# Development Configuration
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
```

## 🛠️ **Quick Production Setup**

### **1. Run Production Setup Script**

```bash
cd backend
node setup-production.js
```

This will:
- ✅ Generate secure JWT secret
- ✅ Create production .env file
- ✅ Set up SSL directory structure
- ✅ Create deployment script
- ✅ Configure admin credentials

### **2. Update Configuration**

Edit the generated `.env.production` file:
- Update database credentials
- Set your actual domain
- Configure SSL certificate paths

### **3. Add SSL Certificates**

Place your SSL certificates in `backend/ssl/`:
- `private.key` - Your SSL private key
- `certificate.crt` - Your SSL certificate

### **4. Deploy**

```bash
# Backend deployment
cd backend
./deploy.sh

# Frontend deployment
cd ../my-react-app
npm run build
```

## 🛠️ **Deployment Options**

### **Option 1: Vercel (Recommended)**

#### **Frontend Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd my-react-app
vercel --prod
```

#### **Backend Deployment**
```bash
# Deploy to Railway/Render/Heroku
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

#### **SSL Certificate Setup**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
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

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

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

### **✅ Updated Credentials**
- [x] Admin email: `rudridave1998@gmail.com`
- [x] Admin password: `19111998`
- [x] JWT secret: Auto-generated secure key
- [x] Database credentials: Updated for production

### **✅ HTTPS Configuration**
- [x] SSL certificate support
- [x] Automatic HTTPS detection
- [x] Secure cookies enabled
- [x] CORS configured for your domain

### **✅ Production Security**
- [x] Rate limiting enabled
- [x] Input validation
- [x] File upload restrictions
- [x] Error handling (no sensitive data leakage)

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

echo "🚀 Starting production deployment..."

# Backend
cd backend
npm install --production
npm run migrate
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

1. **SSL Certificate Issues**:
   - Check certificate validity
   - Verify Nginx configuration
   - Check DNS settings

2. **Database Connection Failed**:
   - Check PostgreSQL is running
   - Verify credentials in `.env`
   - Check SSL configuration

3. **API Not Responding**:
   - Check if backend is running
   - Verify port configuration
   - Check firewall settings

4. **Frontend Build Errors**:
   - Clear node_modules and reinstall
   - Check environment variables
   - Verify API URL

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

**🎉 Congratulations! Your website is now ready for production deployment with HTTPS and updated credentials.**

**Key Updates Made:**
- ✅ Admin credentials: `rudridave1998@gmail.com` / `19111998`
- ✅ HTTPS support enabled
- ✅ SSL certificate configuration
- ✅ Production environment setup
- ✅ Secure JWT secret generation
- ✅ CORS configured for your domain

**Next Steps:**
1. Run `node setup-production.js` in backend directory
2. Update `.env.production` with your actual values
3. Add SSL certificates
4. Deploy using your chosen platform
5. Monitor and maintain
