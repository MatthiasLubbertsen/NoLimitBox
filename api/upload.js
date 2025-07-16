const { put } = require('@vercel/blob');
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const router = express.Router();

// Multer configuratie voor file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit voor multer (Vercel heeft zijn eigen limieten)
  }
});

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Geen bestand geüpload' });
    }

    // Genereer unieke filename
    const fileExtension = req.file.originalname.split('.').pop() || '';
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const filename = fileExtension ? `${uniqueId}.${fileExtension}` : uniqueId;

    // Upload naar Vercel Blob
    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype
    });

    // Return success response met view URL
    res.json({
      success: true,
      url: blob.url,
      viewUrl: `/view/${filename}`,
      filename: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload mislukt',
      details: error.message 
    });
  }
});

module.exports = router;