const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueId + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for local development
  }
});

// Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Geen bestand geüpload' });
  }

  const fileId = path.basename(req.file.filename, path.extname(req.file.filename));
  const viewUrl = `/view/${fileId}`;
  const downloadUrl = `/download/${fileId}`;

  res.json({
    success: true,
    fileId: fileId,
    viewUrl: viewUrl,
    downloadUrl: downloadUrl,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

app.get('/api/view', (req, res) => {
  const fileId = req.query.id;
  if (!fileId) {
    return res.status(400).send('Geen bestand ID opgegeven');
  }

  const files = fs.readdirSync('uploads/').filter(file => file.startsWith(fileId));
  if (files.length === 0) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }

  const filePath = path.join('uploads', files[0]);
  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  
  if (mimeType.startsWith('image/')) {
    res.sendFile(path.resolve(filePath));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
  }
});

app.get('/api/download', (req, res) => {
  const fileId = req.query.id;
  if (!fileId) {
    return res.status(400).send('Geen bestand ID opgegeven');
  }

  const files = fs.readdirSync('uploads/').filter(file => file.startsWith(fileId));
  if (files.length === 0) {
    return res.status(404).send('Bestand niet gevonden');
  }

  const filePath = path.join('uploads', files[0]);
  res.download(filePath);
});

// Cleanup function (voor lokale ontwikkeling)
function cleanupFiles() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  const timeUntilMidnight = midnight.getTime() - now.getTime();
  
  setTimeout(() => {
    try {
      const files = fs.readdirSync('uploads/');
      files.forEach(file => {
        fs.unlinkSync(path.join('uploads', file));
      });
      console.log('Bestanden opgeruimd om middernacht');
    } catch (error) {
      console.error('Fout bij opruimen:', error);
    }
    
    // Plan volgende cleanup
    setTimeout(cleanupFiles, 24 * 60 * 60 * 1000); // 24 uur
  }, timeUntilMidnight);
}

// Start cleanup scheduler
cleanupFiles();

app.listen(port, () => {
  console.log(`NoLimitBox server draait op http://localhost:${port}`);
});

module.exports = app;