# Render Deployment Guide for RD Portfolio

## 🚀 Deploying to Render

### Prerequisites
- GitHub repository connected to Render
- Render account (free tier available)
- PostgreSQL database (provided by Render)

## 📋 Step-by-Step Deployment

### Step 1: GitHub Repository Setup

1. **Push to GitHub**:
   ```bash
   cd "C:\Rudri P"
   git init
   git add .
   git commit -m "Initial commit: RD Portfolio Website"
   git remote add origin https://github.com/Tir25/Rudri-Dave-Portfolio.git
   git push -u origin main
   ```

2. **Verify Repository**: Visit https://github.com/Tir25/Rudri-Dave-Portfolio.git

### Step 2: Render Dashboard Setup

1. **Create New Service**:
   - Go to https://dashboard.render.com
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository: `Tir25/Rudri-Dave-Portfolio`

2. **Configure Blueprint**:
   - Render will automatically detect the `render.yaml` file
   - Review the configuration
   - Click "Apply" to create services

### Step 3: Environment Variables Setup

#### Backend Environment Variables
In Render dashboard, go to your backend service and set these environment variables:

```
NODE_ENV=production
PORT=10000
DB_HOST=<your-render-db-host>
DB_PORT=5432
DB_USER=<your-render-db-user>
DB_PASSWORD=<your-render-db-password>
DB_NAME=rd_portfolio
JWT_SECRET=<your-secure-jwt-secret>
ADMIN_EMAIL=rudridave1998@gmail.com
ADMIN_PASSWORD=19111998
```

#### Frontend Environment Variables
For the frontend service:

```
VITE_API_URL=https://rd-portfolio-backend.onrender.com
VITE_APP_NAME=RD Portfolio
```

### Step 4: Database Setup

1. **Create PostgreSQL Database**:
   - In Render dashboard, create a new PostgreSQL database
   - Note down the connection details

2. **Update Backend Environment**:
   - Use the database connection details in backend environment variables

### Step 5: Deploy Services

1. **Backend Deployment**:
   - Render will automatically build and deploy the backend
   - Monitor the build logs for any issues
   - Backend will be available at: `https://rd-portfolio-backend.onrender.com`

2. **Frontend Deployment**:
   - Render will build the React app and deploy it
   - Frontend will be available at: `https://rd-portfolio-frontend.onrender.com`

## 🔧 Configuration Files

### render.yaml
The `render.yaml` file contains the deployment configuration for both services:

```yaml
services:
  # Backend API Service
  - type: web
    name: rd-portfolio-backend
    env: node
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    
  # Frontend Service
  - type: web
    name: rd-portfolio-frontend
    env: static
    plan: free
    buildCommand: cd my-react-app && npm install && npm run build
    staticPublishPath: ./my-react-app/dist

databases:
  - name: rd-portfolio-db
    databaseName: rd_portfolio
    user: rd_user
```

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `https://rd-portfolio-backend.onrender.com/health`
- Frontend: Check the deployed URL

### Logs
- View logs in Render dashboard for each service
- Monitor for any errors or issues

### Database Management
- Use Render's database dashboard for PostgreSQL management
- Regular backups are automatically handled by Render

## 🔐 Security Considerations

### Environment Variables
- Never commit sensitive data to GitHub
- Use Render's environment variable management
- Keep JWT secrets secure

### Database Security
- Render provides SSL connections by default
- Database credentials are managed by Render

### API Security
- CORS is configured for production domains
- Rate limiting is enabled
- JWT authentication is secured

## 🎯 Success Indicators

### ✅ **Backend Working**
- Health check endpoint responding
- Database connected
- API endpoints accessible
- Image uploads working

### ✅ **Frontend Working**
- Website loads without errors
- Navigation working
- Admin panel accessible
- Blog functionality working

### ✅ **Integration Working**
- Frontend can communicate with backend
- Image uploads working
- Authentication working
- Blog creation and editing functional

## 🚀 Post-Deployment

### 1. **Test All Features**
- Login to admin panel
- Create a test blog
- Upload an image
- View the blog publicly

### 2. **Update DNS (Optional)**
- If you have a custom domain, configure it in Render
- Update DNS records to point to your Render services

### 3. **Monitor Performance**
- Check Render dashboard for performance metrics
- Monitor database usage
- Watch for any errors in logs

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Backend Health**: https://rd-portfolio-backend.onrender.com/health
- **Frontend URL**: https://rd-portfolio-frontend.onrender.com
- **GitHub Repository**: https://github.com/Tir25/Rudri-Dave-Portfolio.git

## 📞 Support

If you encounter any issues:
1. Check Render logs for error messages
2. Verify environment variables are set correctly
3. Ensure database is properly connected
4. Test locally before deploying

---

**🎉 Your RD Portfolio website will be live on Render!**

**Backend**: https://rd-portfolio-backend.onrender.com
**Frontend**: https://rd-portfolio-frontend.onrender.com
