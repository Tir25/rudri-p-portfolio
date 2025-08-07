/**
 * Research Papers routes
 */

const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', paperController.listPapers);
router.get('/:id', paperController.getPaper);
router.get('/:id/download', paperController.downloadPaper);

// Admin-only routes
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  upload.single('file'), // 'file' is the field name for the uploaded file
  paperController.createPaper
);

router.put('/:id', 
  authenticateToken, 
  requireAdmin, 
  upload.single('file'), // Optional file upload for updates
  paperController.updatePaper
);

router.delete('/:id', 
  authenticateToken, 
  requireAdmin, 
  paperController.deletePaper
);

module.exports = router;