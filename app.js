const express = require('express');
const multer = require('multer');
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

// Configureer multer om originele bestandsnaam te behouden
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    // Genereer unieke filename met originele extensie
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  const { filename, originalname } = req.file;
  const fileUrl = `/file/${filename}`;
  res.send(
    `<p>Bestand geüpload als <strong>${originalname}</strong></p>` +
    `<p><a href="${fileUrl}" target="_blank">Klik hier om te bekijken</a></p>` +
    `<p><a href="${fileUrl}?download=true">Of klik hier om te downloaden</a></p>`
  );
});

app.get('/file/:filename', (req, res) => {
  const filePath = isVercel 
    ? path.join('/tmp', req.params.filename)
    : path.join(__dirname, 'tmp', req.params.filename);
  
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

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server gestart op http://localhost:${PORT}`));
}