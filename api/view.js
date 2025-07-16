const express = require('express');
const router = express.Router();
const mimeTypes = require('mime-types');

// View endpoint om bestand info op te halen
router.get('/view/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Construct Vercel Blob URL
    const blobUrl = `https://${process.env.VERCEL_URL || 'localhost:3000'}/api/blob/${filename}`;
    
    // Bepaal MIME type op basis van extensie
    const mimeType = mimeTypes.lookup(filename) || 'application/octet-stream';
    
    // Return bestand info
    res.json({
      success: true,
      filename: filename,
      url: blobUrl,
      mimeType: mimeType,
      isImage: mimeType.startsWith('image/'),
      isVideo: mimeType.startsWith('video/'),
      isAudio: mimeType.startsWith('audio/'),
      isPdf: mimeType === 'application/pdf',
      isText: mimeType.startsWith('text/')
    });

  } catch (error) {
    console.error('View error:', error);
    res.status(404).json({ 
      error: 'Bestand niet gevonden',
      details: error.message 
    });
  }
});

module.exports = router;