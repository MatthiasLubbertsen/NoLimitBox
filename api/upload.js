const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Voor Vercel serverless - gebruik /tmp directory
    const uploadsDir = '/tmp/uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Parse multipart form data
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const boundary = req.headers['content-type']?.split('boundary=')[1];
      
      if (!boundary) {
        return res.status(400).json({ error: 'Geen boundary gevonden' });
      }

      const parts = buffer.toString().split('--' + boundary);
      let fileData = null;
      let filename = null;

      for (const part of parts) {
        if (part.includes('Content-Disposition: form-data; name="file"')) {
          const lines = part.split('\n');
          const headerLine = lines.find(line => line.includes('filename='));
          if (headerLine) {
            filename = headerLine.split('filename="')[1]?.split('"')[0];
          }
          
          // Extract file data (skip headers)
          const dataStartIndex = part.indexOf('\r\n\r\n') + 4;
          const dataEndIndex = part.lastIndexOf('\r\n');
          if (dataStartIndex < dataEndIndex) {
            fileData = buffer.slice(
              buffer.indexOf(part) + dataStartIndex,
              buffer.indexOf(part) + dataEndIndex
            );
          }
          break;
        }
      }

      if (!fileData || !filename) {
        return res.status(400).json({ error: 'Geen bestand gevonden' });
      }

      // Generate unique filename
      const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(filename);
      const savedFilename = uniqueId + ext;
      const filePath = path.join(uploadsDir, savedFilename);

      // Save file
      fs.writeFileSync(filePath, fileData);

      const fileId = uniqueId.toString();
      const viewUrl = `/view/${fileId}`;
      const downloadUrl = `/download/${fileId}`;

      res.json({
        success: true,
        fileId: fileId,
        viewUrl: viewUrl,
        downloadUrl: downloadUrl,
        originalName: filename,
        size: fileData.length
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server fout bij uploaden' });
  }
}