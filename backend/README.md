# Backend Server - Rudri's Website

## 🚀 Quick Start

### Method 1: Using npm (Recommended)
```bash
npm start
```

### Method 2: Direct Node
```bash
node server.js
```

### Method 3: Windows Batch File
```bash
start.bat
```

## 📋 Server Information

- **Port**: 4000
- **Health Check**: http://localhost:4000/health
- **API Base**: http://localhost:4000/api
- **Database**: PostgreSQL

## 🔧 Available Scripts

```bash
# Start server
npm start

# Start with auto-restart (development)
npm run dev

# Database operations
npm run init-db      # Initialize database
npm run setup-db     # Setup database
npm run migrate      # Run migrations
npm run test-db      # Test database connection
npm run db-status    # Check database status
```

## 🛠️ Troubleshooting

### Server Won't Start

1. **Check Dependencies**:
   ```bash
   npm install
   ```

2. **Check Database Connection**:
   ```bash
   npm run db-status
   ```

3. **Check Port Availability**:
   ```bash
   netstat -an | findstr :4000
   ```

### Common Errors

1. **"Cannot find module"**:
   ```bash
   npm install
   ```

2. **Database Connection Failed**:
   - Check PostgreSQL is running
   - Verify .env file has correct database credentials
   - Run `npm run setup-db`

3. **Port Already in Use**:
   - Kill existing process: `taskkill /f /im node.exe`
   - Or change port in .env file

## 📊 API Endpoints

### Health Check
- `GET /health` - Server status

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get specific blog
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Papers
- `GET /api/papers` - Get all papers
- `POST /api/papers` - Upload paper (admin)

## 🔒 Security Features

- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- JWT authentication
- Input validation

## 📝 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rudri_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## 🎯 Development

### Auto-restart during development:
```bash
npm run dev
```

### Database migrations:
```bash
npm run migrate:create -- migration_name
npm run migrate:up
npm run migrate:status
```

## 📈 Monitoring

### Health Check Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "database": "connected",
  "environment": "development"
}
```

## 🚨 Emergency Commands

### Force Stop Server:
```bash
taskkill /f /im node.exe
```

### Reset Database:
```bash
npm run setup-db
npm run init-db
```

### Clear All Data:
```bash
node cleanup-simple.js
```

## ✅ Server Status Checklist

- [ ] Server starts without errors
- [ ] Database connection successful
- [ ] Health endpoint responds
- [ ] API endpoints accessible
- [ ] CORS working for frontend
- [ ] Rate limiting active
- [ ] Security headers enabled

## 🎉 Success Indicators

When the server is running correctly, you should see:

```
🚀 Server starting...
📍 Environment: development
🌐 Server running on port 4000
📊 Database: ✅ Connected
🔗 Health check: http://localhost:4000/health
📚 API docs: http://localhost:4000/api
✨ Server is ready to handle requests!
```

## 📞 Support

If you encounter issues:

1. Check the console output for error messages
2. Verify all dependencies are installed: `npm install`
3. Test database connection: `npm run db-status`
4. Check environment variables in `.env` file
5. Ensure PostgreSQL is running

---

**Server is now stable and ready for production use! 🚀**