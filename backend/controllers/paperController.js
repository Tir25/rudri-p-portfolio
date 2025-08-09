/**
 * Research Papers controller
 * 
 * Handles CRUD operations for research papers
 */

const path = require('path');
const fs = require('fs');
const dbUtils = require('../models/dbUtils');
const db = require('../models/db');

// List all papers (public)
async function listPapers(req, res) {
  try {
    const { category } = req.query;
    const filters = {};
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      filters.category = category;
    }
    
    // Get pagination parameters
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    // Order by created_at (matches migration schema)
    const query = `
      SELECT * FROM papers
      ${category && category !== 'all' ? 'WHERE category = $1' : ''}
      ORDER BY created_at DESC
      LIMIT $${category && category !== 'all' ? '2' : '1'} OFFSET $${category && category !== 'all' ? '3' : '2'}
    `;
    
    const values = [];
    if (category && category !== 'all') {
      values.push(category);
    }
    values.push(limit);
    values.push(offset);
    
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error listing papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
}

// Get a single paper by ID (public)
async function getPaper(req, res) {
  try {
    const { id } = req.params;
    const paper = await dbUtils.getById('papers', Number(id));
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    res.json(paper);
  } catch (error) {
    console.error('Error getting paper:', error);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
}

// Create a new paper (admin only)
async function createPaper(req, res) {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { title, authors, abstract, category, keywords } = req.body;
    
    // Validate required fields
    if (!title || !authors) {
      return res.status(400).json({ error: 'Title and authors are required' });
    }
    
    // Parse authors from string to array
    let authorsArray;
    try {
      authorsArray = JSON.parse(authors);
      if (!Array.isArray(authorsArray)) {
        authorsArray = [authors];
      }
    } catch (e) {
      // If parsing fails, assume it's a comma-separated string
      authorsArray = authors.split(',').map(author => author.trim());
    }
    
    // Parse keywords if provided
    let keywordsArray = [];
    if (keywords) {
      try {
        keywordsArray = JSON.parse(keywords);
        if (!Array.isArray(keywordsArray)) {
          keywordsArray = [keywords];
        }
      } catch (e) {
        // If parsing fails, assume it's a comma-separated string
        keywordsArray = keywords.split(',').map(keyword => keyword.trim());
      }
    }
    
    // Create paper record
    const paperData = {
      title,
      authors: authorsArray,
      abstract: abstract || null,
      category: category || null,
      file_path: req.file.path,
      file_name: req.file.originalname,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      published: true,
    };
    
    const paper = await dbUtils.create('papers', paperData);
    res.status(201).json(paper);
  } catch (error) {
    console.error('Error creating paper:', error);
    res.status(500).json({ error: 'Failed to create paper', details: error.message });
  }
}

// Update a paper (admin only)
async function updatePaper(req, res) {
  try {
    const { id } = req.params;
    const { title, abstract, category, published, keywords } = req.body;
    
    // Get existing paper
    const paper = await dbUtils.getById('papers', Number(id));
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (abstract !== undefined) updateData.abstract = abstract;
    if (category) updateData.category = category;
    if (published !== undefined) updateData.published = published;
    
    // Parse authors if provided
    if (req.body.authors) {
      let authorsArray;
      try {
        authorsArray = JSON.parse(req.body.authors);
        if (!Array.isArray(authorsArray)) {
          authorsArray = [req.body.authors];
        }
      } catch (e) {
        // If parsing fails, assume it's a comma-separated string
        authorsArray = req.body.authors.split(',').map(author => author.trim());
      }
      updateData.authors = authorsArray;
    }
    
    // Parse keywords if provided
    if (keywords) {
      let keywordsArray;
      try {
        keywordsArray = JSON.parse(keywords);
        if (!Array.isArray(keywordsArray)) {
          keywordsArray = [keywords];
        }
      } catch (e) {
        // If parsing fails, assume it's a comma-separated string
        keywordsArray = keywords.split(',').map(keyword => keyword.trim());
      }
      updateData.keywords = keywordsArray;
    }
    
    // Update file information if a new file was uploaded
    if (req.file) {
      updateData.file_path = req.file.path;
      updateData.updated_at = new Date();
      
      // Delete old file if it exists and is different
      if (paper.file_path && paper.file_path !== req.file.path) {
        try {
          fs.unlinkSync(paper.file_path);
        } catch (err) {
          console.warn(`Could not delete old file: ${paper.file_path}`, err);
        }
      }
    }
    
    // Update paper
    const updatedPaper = await dbUtils.update('papers', Number(id), updateData);
    res.json(updatedPaper);
  } catch (error) {
    console.error('Error updating paper:', error);
    res.status(500).json({ error: 'Failed to update paper' });
  }
}

// Delete a paper (admin only)
async function deletePaper(req, res) {
  try {
    const { id } = req.params;
    
    // Get paper to find file path
    const paper = await dbUtils.getById('papers', Number(id));
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    // Delete file if it exists
    if (paper.file_path) {
      try {
        fs.unlinkSync(paper.file_path);
      } catch (err) {
        console.warn(`Could not delete file: ${paper.file_path}`, err);
      }
    }
    
    // Delete paper from database
    await dbUtils.remove('papers', Number(id));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ error: 'Failed to delete paper' });
  }
}

// Download a paper (public)
async function downloadPaper(req, res) {
  try {
    const { id } = req.params;
    const paper = await dbUtils.getById('papers', Number(id));
    
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    
    // Check if file exists
    if (!paper.file_path || !fs.existsSync(paper.file_path)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Get file name from path
    const fileName = path.basename(paper.file_path);
    
    // Determine content type based on file extension
    const ext = path.extname(paper.file_path).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (ext === '.doc') contentType = 'application/msword';
    else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    // Set headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream file to response
    const fileStream = fs.createReadStream(paper.file_path);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading paper:', error);
    res.status(500).json({ error: 'Failed to download paper' });
  }
}

module.exports = {
  listPapers,
  getPaper,
  createPaper,
  updatePaper,
  deletePaper,
  downloadPaper
};