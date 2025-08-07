# Environment Variables Setup Guide

This guide explains how to set up environment variables for both the backend and frontend of the Rudri Dave website project.

## 🔧 Backend Environment Variables

### 1. Create Backend .env File

Create a `.env` file in the `backend/` directory with the following content:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=rudri_db
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=1d

# Admin User Configuration
ADMIN_EMAIL=admin@rudri.com
ADMIN_PASSWORD=admin123

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security Configuration
COOKIE_SECURE=false
COOKIE_HTTP_ONLY=true
COOKIE_MAX_AGE=86400000
```

### 2. Backend Environment Variables Explained

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 4000 | No |
| `NODE_ENV` | Environment (development/production) | development | No |
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 5432 | Yes |
| `DB_USER` | Database username | postgres | Yes |
| `DB_PASSWORD` | Database password | postgres | Yes |
| `DB_NAME` | Database name | rudri_db | Yes |
| `DB_SSL` | Enable SSL for database | false | No |
| `JWT_SECRET` | Secret key for JWT tokens | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | 1d | No |
| `ADMIN_EMAIL` | Admin user email | admin@rudri.com | No |
| `ADMIN_PASSWORD` | Admin user password | admin123 | No |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 | No |
| `MAX_FILE_SIZE` | Maximum file upload size (bytes) | 5242880 (5MB) | No |
| `UPLOAD_PATH` | File upload directory | ./uploads | No |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 (15min) | No |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | No |
| `COOKIE_SECURE` | Secure cookies (HTTPS only) | false | No |
| `COOKIE_HTTP_ONLY` | HTTP-only cookies | true | No |
| `COOKIE_MAX_AGE` | Cookie max age (ms) | 86400000 (1 day) | No |

## 🎨 Frontend Environment Variables

### 1. Create Frontend .env File

Create a `.env` file in the `my-react-app/` directory with the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:4000

# Application Configuration
VITE_APP_NAME=Rudri Dave
VITE_APP_DESCRIPTION=Personal website and research papers
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_BLOG=true
VITE_ENABLE_PAPERS=true
VITE_ENABLE_ADMIN=true

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=

# Social Media (Optional)
VITE_TWITTER_HANDLE=@rudridave
VITE_GITHUB_URL=https://github.com/rudridave
VITE_LINKEDIN_URL=https://linkedin.com/in/rudridave

# Contact Information
VITE_CONTACT_EMAIL=admin@rudri.com
VITE_CONTACT_PHONE=

# Development Configuration
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false
```

### 2. Frontend Environment Variables Explained

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | http://localhost:4000 | Yes |
| `VITE_APP_NAME` | Application name | Rudri Dave | No |
| `VITE_APP_DESCRIPTION` | App description | Personal website and research papers | No |
| `VITE_APP_VERSION` | App version | 1.0.0 | No |
| `VITE_ENABLE_BLOG` | Enable blog feature | true | No |
| `VITE_ENABLE_PAPERS` | Enable papers feature | true | No |
| `VITE_ENABLE_ADMIN` | Enable admin panel | true | No |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics ID | - | No |
| `VITE_TWITTER_HANDLE` | Twitter handle | @rudridave | No |
| `VITE_GITHUB_URL` | GitHub profile URL | https://github.com/rudridave | No |
| `VITE_LINKEDIN_URL` | LinkedIn profile URL | https://linkedin.com/in/rudridave | No |
| `VITE_CONTACT_EMAIL` | Contact email | admin@rudri.com | No |
| `VITE_CONTACT_PHONE` | Contact phone | - | No |
| `VITE_DEV_MODE` | Development mode | true | No |
| `VITE_DEBUG_MODE` | Debug mode | false | No |

## 🚀 Quick Setup

### Automated Setup

1. **Backend Setup**:
   ```bash
   cd backend
   npm run setup-db
   ```
   This will create the `.env` file automatically.

2. **Frontend Setup**:
   ```bash
   cd my-react-app
   # Create .env file manually using the template above
   ```

### Manual Setup

1. **Backend**:
   ```bash
   cd backend
   # Create .env file with the backend template above
   npm install
   npm run init-db
   npm start
   ```

2. **Frontend**:
   ```bash
   cd my-react-app
   # Create .env file with the frontend template above
   npm install
   npm run dev
   ```

## 🔒 Security Considerations

### Production Environment

For production deployment, make sure to:

1. **Change Default Passwords**:
   - Update `ADMIN_PASSWORD` to a strong password
   - Update `DB_PASSWORD` to a secure database password

2. **Use Strong JWT Secret**:
   - Generate a strong random string for `JWT_SECRET`
   - Use a tool like: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

3. **Enable HTTPS**:
   - Set `COOKIE_SECURE=true` for HTTPS
   - Set `DB_SSL=true` for database SSL

4. **Environment-Specific Settings**:
   - Set `NODE_ENV=production`
   - Update `CORS_ORIGIN` to your domain
   - Configure proper `UPLOAD_PATH`

### Development Environment

For development:

1. **Use Default Values**: Most defaults work for local development
2. **Debug Mode**: Set `VITE_DEBUG_MODE=true` for detailed logging
3. **Local Database**: Use local PostgreSQL instance

## 📝 Configuration Files

The project now uses centralized configuration files:

- **Backend**: `backend/config.js` - Loads from `.env` file
- **Frontend**: `my-react-app/src/config.ts` - Loads from `.env` file

These files provide:
- Type-safe configuration access
- Default values for missing environment variables
- Centralized configuration management
- Easy environment switching

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**:
   - Check PostgreSQL is running
   - Verify database credentials in `.env`
   - Run `npm run setup-db` to recreate database

2. **API Connection Failed**:
   - Verify `VITE_API_URL` in frontend `.env`
   - Check backend server is running on correct port
   - Ensure CORS settings match

3. **File Upload Issues**:
   - Check `UPLOAD_PATH` exists and is writable
   - Verify `MAX_FILE_SIZE` is sufficient
   - Ensure proper file permissions

4. **Authentication Issues**:
   - Check `JWT_SECRET` is set
   - Verify cookie settings match frontend/backend
   - Clear browser cookies and localStorage

### Debug Mode

Enable debug mode to see detailed logs:

```env
# Frontend .env
VITE_DEBUG_MODE=true

# Backend .env
NODE_ENV=development
```

## 📚 Additional Resources

- [Node.js dotenv documentation](https://www.npmjs.com/package/dotenv)
- [Vite environment variables](https://vitejs.dev/guide/env-and-mode.html)
- [PostgreSQL connection guide](https://node-postgres.com/guides/connecting)
- [JWT security best practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

---

**Note**: Never commit `.env` files to version control. They contain sensitive information and should be kept private.
