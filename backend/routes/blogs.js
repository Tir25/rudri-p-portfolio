const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', blogController.listBlogs);
router.get('/:idOrSlug', blogController.getBlog);

// Admin-only routes
router.post('/', authenticateToken, requireAdmin, blogController.createBlog);
router.put('/:idOrSlug', authenticateToken, requireAdmin, blogController.updateBlog);
router.delete('/:idOrSlug', authenticateToken, requireAdmin, blogController.deleteBlog);

// Blog image upload endpoint
router.post('/upload-image', authenticateToken, requireAdmin, upload.single('image'), blogController.uploadBlogImage);

module.exports = router;