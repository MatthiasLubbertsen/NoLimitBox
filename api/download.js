const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

export default async function handler(req, res) {
  const fileId = req.query.id;
  
  if (!fileId) {
    return res.status(400).send('Geen bestand ID opgegeven');
  }

  try {
    const uploadsDir = '/tmp/uploads';
    
    if (!fs.existsSync(uploadsDir)) {
      return res.status(404).send('Bestand niet gevonden');
    }

    const files = fs.readdirSync(uploadsDir).filter(file => file.startsWith(fileId));
    
    if (files.length === 0) {
      return res.status(404).send('Bestand niet gevonden');
    }

    const filePath = path.join(uploadsDir, files[0]);
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    
    // Extract original filename from the stored filename
    const originalName = files[0].replace(/^\d+-\d+-/, '');
    
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    res.send(fileBuffer);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(404).send('Bestand niet gevonden');
  }
}