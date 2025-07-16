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
      return res.status(404).send(getNotFoundPage());
    }

    const files = fs.readdirSync(uploadsDir).filter(file => file.startsWith(fileId));
    
    if (files.length === 0) {
      return res.status(404).send(getNotFoundPage());
    }

    const filePath = path.join(uploadsDir, files[0]);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';
    
    if (mimeType.startsWith('image/')) {
      const fileBuffer = fs.readFileSync(filePath);
      res.setHeader('Content-Type', mimeType);
      res.send(fileBuffer);
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(getViewPage(files[0], fileId));
    }
  } catch (error) {
    console.error('View error:', error);
    res.status(404).send(getNotFoundPage());
  }
}

function getNotFoundPage() {
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bestand niet gevonden - NoLimitBox</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        ::selection {
            background-color: #e8d5ff;
            color: #6b46c1;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%);
            color: #4a5568;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.8);
            padding: 3rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 90%;
        }
        
        .error-code {
            font-size: 4rem;
            font-weight: 700;
            color: #f472b6;
            margin-bottom: 1rem;
        }
        
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #6b46c1;
        }
        
        p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .back-button {
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(168, 85, 247, 0.4);
        }
        
        .warning {
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid #fbbf24;
            color: #92400e;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 2rem;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-code">404</div>
        <h1>Bestand niet gevonden</h1>
        <p>Het bestand dat je zoekt bestaat niet of is al verwijderd.</p>
        <a href="/" class="back-button">Terug naar home</a>
        <div class="warning">
            ⚠️ Bestanden worden om middernacht automatisch verwijderd.
        </div>
    </div>
</body>
</html>
  `;
}

function getViewPage(filename, fileId) {
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bestand bekijken - NoLimitBox</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        ::selection {
            background-color: #e8d5ff;
            color: #6b46c1;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 100%);
            color: #4a5568;
            min-height: 100vh;
            padding: 2rem;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.8);
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: #6b46c1;
            text-align: center;
        }
        
        .file-info {
            background: rgba(168, 85, 247, 0.1);
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .download-button {
            background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            margin: 1rem;
        }
        
        .download-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(168, 85, 247, 0.4);
        }
        
        .back-button {
            background: rgba(156, 163, 175, 0.2);
            color: #6b7280;
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            margin: 1rem;
        }
        
        .back-button:hover {
            background: rgba(156, 163, 175, 0.3);
        }
        
        .warning {
            background: rgba(251, 191, 36, 0.1);
            border: 1px solid #fbbf24;
            color: #92400e;
            padding: 1rem;
            border-radius: 10px;
            margin-top: 2rem;
            font-size: 0.9rem;
            text-align: center;
        }
        
        .buttons {
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bestand bekijken</h1>
        
        <div class="file-info">
            <strong>Bestandsnaam:</strong> ${filename}
        </div>
        
        <div class="buttons">
            <a href="/download/${fileId}" class="download-button">📥 Download bestand</a>
            <a href="/" class="back-button">← Terug naar home</a>
        </div>
        
        <div class="warning">
            ⚠️ Bestanden worden om middernacht automatisch verwijderd.
        </div>
    </div>
</body>
</html>
  `;
}