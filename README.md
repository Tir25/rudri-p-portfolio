# Rudri P - Full Stack Blog & Research Papers Platform

A modern full-stack web application built with React (Frontend) and Node.js/Express (Backend) for managing blogs and research papers.

## 🚀 Project Structure

```
Rudri P/
├── backend/                 # Node.js/Express API server
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models and utilities
│   ├── routes/            # API routes
│   ├── migrations/        # Database migrations
│   ├── uploads/           # File uploads directory
│   └── server.js          # Main server file
├── my-react-app/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── docs/                  # Documentation files
```

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## 📋 Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes

### Blog Management
- Create, edit, and delete blog posts
- Rich text editing
- Image uploads
- SEO-friendly URLs
- Admin dashboard for blog management

### Research Papers
- Upload and manage research papers
- PDF file handling
- Paper categorization
- Search and filter functionality

### Admin Features
- User management
- Content moderation
- Analytics dashboard
- System configuration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=postgresql://username:password@localhost:5432/database_name
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Database Setup:**
   ```bash
   npm run migrate
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd my-react-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the my-react-app directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Blog Endpoints
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get specific blog
- `POST /api/blogs` - Create new blog (Admin only)
- `PUT /api/blogs/:id` - Update blog (Admin only)
- `DELETE /api/blogs/:id` - Delete blog (Admin only)

### Papers Endpoints
- `GET /api/papers` - Get all papers
- `GET /api/papers/:id` - Get specific paper
- `POST /api/papers` - Upload new paper (Admin only)
- `PUT /api/papers/:id` - Update paper (Admin only)
- `DELETE /api/papers/:id` - Delete paper (Admin only)

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run setup-db` - Initialize database

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚀 Deployment

### Backend Deployment
The backend is configured for deployment on platforms like Render, Railway, or Heroku. See `render.yaml` for Render deployment configuration.

### Frontend Deployment
The React app can be deployed to Vercel, Netlify, or any static hosting service.

## 📝 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ using modern web technologies**
