import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { SupabaseAuthProvider } from './context/SupabaseAuthContext'
import ScrollToTop from './components/ScrollToTop'
import SupabaseProtectedRoute from './components/SupabaseProtectedRoute'
import SupabaseAdminLayout from './components/SupabaseAdminLayout'

// Pages
import Home from './pages/Home'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Papers from './pages/Papers'
import ResearchPapers from './pages/ResearchPapers'
import SupabaseLogin from './pages/SupabaseLogin'
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized'
import SupabaseAdminPage from './pages/SupabaseAdminPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminProfile from './pages/AdminProfile'
import AdminAddBlog from './pages/AdminAddBlog'
import AdminEditBlog from './pages/AdminEditBlog'
import AdminManageBlogs from './pages/AdminManageBlogs'
import AdminUploadPapers from './pages/AdminUploadPapers'
import AdminManagePapers from './pages/AdminManagePapers'
import AdminSyncPapers from './pages/AdminSyncPapers'

// Layouts
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <SupabaseAuthProvider>
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
          <Route path="/login" element={<MainLayout><SupabaseLogin /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
          <Route path="/unauthorized" element={<MainLayout><Unauthorized /></MainLayout>} />


          {/* Admin Routes */}
          <Route path="/admin" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminPage />
            </SupabaseProtectedRoute>
          } />
          
          {/* Admin Routes with AdminLayout */}
          <Route path="/admin/dashboard" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminDashboard />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/admin/profile" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminProfile />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/admin/add-blog" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminAddBlog />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/admin/edit-blog/:id" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminEditBlog />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/admin/manage-blogs" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminManageBlogs />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/admin/upload-papers" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminUploadPapers />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />
          
          <Route path="/admin/manage-papers" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminManagePapers />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />

          <Route path="/admin/sync-papers" element={
            <SupabaseProtectedRoute requireOwner>
              <SupabaseAdminLayout>
                <AdminSyncPapers />
              </SupabaseAdminLayout>
            </SupabaseProtectedRoute>
          } />
          
          {/* Catch-all route for any undefined admin paths */}
          <Route path="/admin/*" element={
            <SupabaseProtectedRoute requireOwner>
              <Navigate to="/admin/dashboard" replace />
            </SupabaseProtectedRoute>
          } />
        </Routes>
      </Router>
    </SupabaseAuthProvider>
  )
}

export default App