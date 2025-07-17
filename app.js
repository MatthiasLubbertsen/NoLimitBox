const express = require('express');
const busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const app = express();

// Detecteer of we lokaal of op Vercel draaien
const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
const uploadPath = isVercel ? '/tmp/' : './tmp/';

// Zorg ervoor dat de lokale tmp directory bestaat
if (!isVercel) {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/upload', (req, res) => {
  const bb = busboy({ 
    headers: req.headers,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limiet
    }
  });
  
  let uploadedFile = null;
  let hasError = false;

  bb.on('file', (fieldname, file, info) => {
    const { filename, mimeType } = info;
    
    if (!filename) {
      hasError = true;
      return res.status(400).send('Geen geldig bestand ontvangen');
    }

    // Genereer unieke filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(filename);
    const newFilename = uniqueSuffix + ext;
    const filePath = path.join(uploadPath, newFilename);

    // Sla bestand op
    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);

    uploadedFile = {
      originalName: filename,
      filename: newFilename,
      mimetype: mimeType,
      path: filePath
    };

    writeStream.on('error', (err) => {
      console.error('Fout bij opslaan bestand:', err);
      hasError = true;
      if (!res.headersSent) {
        res.status(500).send('Fout bij opslaan bestand');
      }
    });
  });

  bb.on('error', (err) => {
    console.error('Busboy error:', err);
    hasError = true;
    if (!res.headersSent) {
      res.status(500).send('Fout bij verwerken upload');
    }
  });

  bb.on('finish', () => {
    if (hasError || !uploadedFile) {
      return;
    }

    const fileUrl = `/file/${uploadedFile.filename}`;
    res.send(
      `<p>Bestand geüpload als <strong>${uploadedFile.originalName}</strong></p>` +
      `<p><a href="${fileUrl}" target="_blank">Klik hier om te bekijken</a></p>` +
      `<p><a href="${fileUrl}?download=true">Of klik hier om te downloaden</a></p>`
    );
  });

  req.pipe(bb);
});

app.get('/file/:filename', (req, res) => {
  const filePath = path.join(uploadPath, req.params.filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Bestand niet gevonden');
  }

  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);
  
  // Als download parameter is meegegeven, forceer download
  if (req.query.download === 'true') {
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
  } else {
    // Anders probeer inline te tonen (bekijken in browser)
    res.setHeader('Content-Disposition', 'inline');
  }
  
  res.sendFile(path.resolve(filePath), err => {
    if (err) {
      console.error('Fout bij verzenden bestand:', err);
      res.status(500).send('Fout bij verzenden bestand');
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fallback voor root
app.get('/', (req, res) => {
  res.redirect('/upload');
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server gestart op http://localhost:${PORT}`));
}