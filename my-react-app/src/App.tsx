import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContextProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Papers from './pages/Papers';
import ResearchPapers from './pages/ResearchPapers';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';
// import Admin from './pages/Admin';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import AdminAddBlog from './pages/AdminAddBlog';
import AdminEditBlog from './pages/AdminEditBlog';
import AdminManageBlogs from './pages/AdminManageBlogs';
import AdminUploadPapers from './pages/AdminUploadPapers';
import AdminManagePapers from './pages/AdminManagePapers';
import AdminSyncPapers from './pages/AdminSyncPapers';

// Layouts
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-center" containerStyle={{ top: 10 }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/blog" element={<MainLayout><Blog /></MainLayout>} />
          <Route path="/blog/:slug" element={<MainLayout><BlogPost /></MainLayout>} />
          <Route path="/papers" element={<MainLayout><Papers /></MainLayout>} />
          <Route path="/research" element={<MainLayout><ResearchPapers /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/unauthorized" element={<MainLayout><Unauthorized /></MainLayout>} />


          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes with AdminLayout */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/profile" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/add-blog" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminAddBlog />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/edit-blog/:id" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminEditBlog />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/manage-blogs" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminManageBlogs />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/upload-papers" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUploadPapers />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/manage-papers" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminManagePapers />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/sync-papers" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSyncPapers />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Catch-all route for any undefined admin paths */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;