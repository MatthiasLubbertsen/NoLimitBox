# NoLimitBox - Groter. Meer. Onbeperkt.

Een moderne file upload- en sharing service gebouwd voor Vercel met Blob storage.

## ✨ Functionaliteiten

- **Onbeperkte uploads**: Upload bestanden van elk type en elke grootte
- **Unieke URLs**: Elk bestand krijgt een unieke, deelbare URL
- **Moderne UI**: Pastel design met drag & drop functionaliteit
- **Voorvertoning**: Automatische voorvertoning voor afbeeldingen, video's, audio en tekstbestanden
- **Responsive**: Werkt perfect op desktop en mobiel
- **Serverless**: Volledig serverless architectuur op Vercel

## 🚀 Snelle Setup

### 1. Project Setup
```bash
# Clone de bestanden naar je project directory
mkdir nolimitbox
cd nolimitbox

# Installeer dependencies
npm install
```

### 2. Vercel Blob Storage Setup
1. Ga naar je [Vercel Dashboard](https://vercel.com/dashboard)
2. Ga naar je project → Settings → Storage
3. Maak een nieuwe Blob store aan
4. Kopieer de `BLOB_READ_WRITE_TOKEN`

### 3. Environment Variables
```bash
# Maak een .env bestand
cp .env.example .env

# Vul je Blob token in
BLOB_READ_WRITE_TOKEN=your_blob_token_here
```

### 4. Lokale Development
```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### 5. Deploy naar Vercel
```bash
# Deploy via Vercel CLI
vercel

# Of push naar GitHub en connect via Vercel Dashboard
```

## 📁 Project Structuur

```
nolimitbox/
├── api/                    # Serverless functions
│   ├── upload.js          # File upload endpoint
│   └── view.js            # File viewing endpoint
├── public/                # Static files
│   ├── index.html         # Homepage
│   ├── view.html          # File viewer
│   └── 404.html           # 404 page
├── main.js                # Local development server
├── package.json           # Dependencies
├── vercel.json            # Vercel configuration
└── .env.example           # Environment variables template
```

## 🛠️ Technische Details

### Upload Process
1. Gebruiker selecteert/sleept bestand naar upload area
2. Bestand wordt via FormData naar `/api/upload` gestuurd
3. Server genereert unieke filename en upload naar Vercel Blob
4. Gebruiker krijgt view URL terug

### View Process
1. Gebruiker opent `/view/{filename}` URL
2. Client haalt bestand info op via `/api/view/{filename}`
3. Automatische voorvertoning op basis van MIME type
4. Download en share opties beschikbaar

### Supported File Types
- **Afbeeldingen**: JPG, PNG, GIF, SVG, WebP, etc.
- **Video**: MP4, WebM, AVI, MOV, etc.
- **Audio**: MP3, WAV, OGG, etc.
- **Documenten**: PDF, TXT, MD, etc.
- **Alle andere types**: Download optie beschikbaar

## 🎨 Design Features

- **Pastel Color Scheme**: Zachte paars-tinten voor een moderne look
- **Glassmorphism**: Subtiele blur effects en transparantie
- **Responsive Design**: Werkt op alle screen sizes
- **Drag & Drop**: Intuïtieve upload interface
- **Progress Feedback**: Visuele upload progress
- **Copy to Clipboard**: Eenvoudig URLs delen

## 🔧 Configuratie

### Vercel.json
De `vercel.json` configureert:
- Serverless function routing
- Static file serving
- Environment variable mapping

### Package.json
Bevat alle benodigde dependencies:
- `@vercel/blob`: Vercel Blob storage client
- `express`: Web framework voor lokale development
- `multer`: File upload middleware
- `mime-types`: MIME type detection

## 🚨 Belangrijke Opmerkingen

1. **Blob Token**: Zorg ervoor dat je `BLOB_READ_WRITE_TOKEN` correct is ingesteld in je Vercel environment variables
2. **File Limits**: Vercel heeft standaard upload limits - controleer je plan voor specifieke limits
3. **CORS**: De API endpoints zijn geconfigureerd voor same-origin requests
4. **Security**: Bestanden zijn publiek toegankelijk via hun unieke URLs

## 📝 Development Notes

- Gebruik `npm run dev` voor lokale development
- De `main.js` simuleert de Vercel serverless environment lokaal
- Alle static files worden geserved vanuit de `public/` directory
- API routes zijn beschikbaar onder `/api/`

## 🔒 Security

- Unieke filenames voorkomen conflicts
- Geen authenticatie vereist (bestanden zijn publiek)
- Rate limiting kan worden toegevoegd via Vercel Edge Functions
- Bestanden zijn alleen toegankelijk via hun unieke URLs

## 📞 Support

Voor vragen of problemen:
1. Controleer de Vercel logs voor errors
2. Verifieer je environment variables
3. Test lokaal met `npm run dev`

---

**NoLimitBox** - Gemaakt voor eenvoudige, onbeperkte file sharing! 🚀