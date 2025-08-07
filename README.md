# RD Portfolio - Rudri Dave's Academic Website

A modern, full-stack academic portfolio website built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

### ✅ **Complete Blog System**
- **Create & Edit Blogs**: Full CRUD operations with rich text editor
- **Image Upload**: Upload cover images from device (phone/laptop)
- **Automatic Slug Generation**: SEO-friendly URLs
- **Public Blog Listing**: Responsive grid layout with cover images
- **Individual Blog Posts**: Full article display with images

### ✅ **Admin Panel**
- **Secure Authentication**: JWT-based login system
- **Blog Management**: Create, edit, delete, and manage all blog posts
- **Image Management**: Upload and manage blog cover images
- **User Dashboard**: Comprehensive admin interface

### ✅ **Modern Tech Stack**
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer with proper CORS configuration
- **Security**: Rate limiting, Helmet, CORS protection

### ✅ **Production Ready**
- **Environment Configuration**: Proper .env setup
- **Database Migrations**: Structured database schema
- **Error Handling**: Comprehensive error management
- **CORS Configuration**: Proper cross-origin setup
- **Image Serving**: Optimized static file serving

## 📁 Project Structure

```
Rudri P/
├── backend/                 # Node.js/Express API
│   ├── controllers/        # API controllers
│   ├── middleware/         # Auth, upload, security
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── migrations/        # Database migrations
│   └── uploads/           # Image storage
├── my-react-app/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── layouts/       # Layout components
│   └── public/            # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run setup-db
npm start
```

### Frontend Setup
```bash
cd my-react-app
npm install
npm run dev
```

## 🔐 Admin Access

- **Email**: rudridave1998@gmail.com
- **Password**: 19111998

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Blogs
- `GET /api/blogs` - List all blogs
- `GET /api/blogs/:slug` - Get blog by slug
- `POST /api/blogs` - Create new blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)
- `POST /api/blogs/upload-image` - Upload blog image (admin)

## 🎨 Features

### **Image Upload System**
- ✅ Real file upload from device (phone/laptop)
- ✅ Image preview before upload
- ✅ Automatic image optimization
- ✅ Proper CORS configuration
- ✅ Secure file storage

### **Blog Management**
- ✅ Rich text editor for content
- ✅ Automatic slug generation
- ✅ Tag system
- ✅ Publish/unpublish functionality
- ✅ Cover image support

### **Security Features**
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Input sanitization
- ✅ SQL injection prevention

### **Social Media Integration**
- ✅ LinkedIn: https://linkedin.com/in/rudri-dave-09091a183
- ✅ Instagram: https://www.instagram.com/rudri__dave

## 🚀 Deployment

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=production
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=rd_portfolio
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=rudridave1998@gmail.com
ADMIN_PASSWORD=19111998
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=RD Portfolio
```

### Production Deployment Options

1. **Render** (Recommended - Free tier available)
2. **Vercel** (Frontend deployment)
3. **DigitalOcean** (Full-stack deployment)
4. **AWS/VPS** (Custom server setup)

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Blogs Table
```sql
CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  summary TEXT,
  published BOOLEAN DEFAULT false,
  cover_image VARCHAR(255),
  author_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd backend
node test-final-deployment.js

# Frontend tests
cd my-react-app
npm test
```

### Database Migrations
```bash
cd backend
npm run migrate
```

## 📝 License

This project is private and belongs to Rudri Dave.

## 👨‍💻 Author

**Rudri Dave**
- LinkedIn: https://linkedin.com/in/rudri-dave-09091a183
- Instagram: https://www.instagram.com/rudri__dave

---

**🎉 Project Status: 100% Complete & Production Ready!**
