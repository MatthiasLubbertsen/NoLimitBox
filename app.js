const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const upload = multer({ dest: '/tmp/' });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  const { filename, originalname } = req.file;
  const fileUrl = `/file/${filename}`;
  res.send(
    `<p>Bestand geüpload als <strong>${originalname}</strong></p>` +
    `<p><a href="${fileUrl}">Klik hier om te bekijken</a></p>`
  );
});

app.get('/file/:filename', (req, res) => {
  const filePath = path.join('/tmp', req.params.filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Bestand niet gevonden');
  }

  const mimeType = mime.lookup(filePath) || 'application/octet-stream';
  res.setHeader('Content-Type', mimeType);
  res.sendFile(path.resolve(filePath), err => {
    if (err) res.status(500).send('Fout bij verzenden bestand');
  });
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server gestart op http://localhost:${PORT}`));
}