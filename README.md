# NoLimitBox - Groter. Meer. Onbeperkt.

Een moderne file upload service die draait op Vercel met serverless functies.

## 🚀 Functionaliteiten

- **Onbeperkte uploads**: Geen limiet op bestandsgrootte of aantal bestanden
- **Alle bestandstypen**: Upload wat je wilt - documenten, afbeeldingen, video's, software
- **Directe links**: Krijg meteen een unieke URL om je bestand te delen
- **Automatische cleanup**: Bestanden worden om middernacht automatisch verwijderd
- **Moderne UI**: Mooie pastel interface met drag & drop functionaliteit
- **Responsive design**: Werkt perfect op desktop en mobiel

## 📁 Projectstructuur

```
nolimitbox/
├── api/
│   ├── upload.js          # Upload endpoint
│   ├── view.js            # Bestand weergave
│   └── download.js        # Download endpoint
├── public/
│   ├── index.html         # Hoofdpagina
│   └── 404.html           # 404 error pagina
├── main.js                # Lokale development server
├── package.json           # Dependencies
├── vercel.json           # Vercel configuratie
└── README.md             # Deze file
```

## 🛠️ Installatie & Setup

### Lokale ontwikkeling

1. Clone het project
2. Installeer dependencies:
   ```bash
   npm install
   ```
3. Start de development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in je browser

### Vercel Deployment

1. Installeer Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy naar Vercel:
   ```bash
   vercel --prod
   ```

Of gebruik de Vercel dashboard door je GitHub repository te connecten.

## 🔧 Configuratie

### Vercel Settings

- **Node.js Version**: 18.x
- **Build Command**: Geen (gebruikt serverless functions)
- **Output Directory**: public
- **Install Command**: npm install

### Environment Variables

Er zijn geen environment variables nodig - alles werkt out of the box!

## 📝 API Endpoints

### POST /api/upload
Upload een bestand via multipart/form-data.

**Response:**
```json
{
  "success": true,
  "fileId": "1234567890-123456789",
  "viewUrl": "/view/1234567890-123456789",
  "downloadUrl": "/download/1234567890-123456789",
  "originalName": "document.pdf",
  "size": 1024000
}
```

### GET /view/{fileId}
Bekijk een bestand in de browser. Afbeeldingen worden direct getoond, andere bestanden krijgen een download pagina.

### GET /download/{fileId}
Download een bestand direct.

## 🎨 Design Features

- **Pastel kleuren**: Zachte, moderne kleurenschema
- **Drag & Drop**: Sleep bestanden direct naar de upload zone
- **Progress indicator**: Visuele feedback tijdens upload
- **Responsive**: Werkt op alle schermformaten
- **Accessible**: Goede contrast ratios en keyboard navigation

## ⚠️ Belangrijke Notities

- **Automatische cleanup**: Alle bestanden worden om middernacht verwijderd
- **Serverless beperkingen**: Vercel heeft een 250MB limiet per serverless function
- **Temporary storage**: Bestanden worden opgeslagen in `/tmp/` op Vercel
- **Geen persistentie**: Dit is een tijdelijke file sharing service

## 🔒 Security Features

- **Bestandsvalidatie**: Controleert op geldige uploads
- **Unieke IDs**: Elk bestand krijgt een unieke, onvoorspelbare ID
- **No directory traversal**: Veilige bestandsopslag
- **Automatic cleanup**: Voorkomt langdurige opslag van bestanden

## 🚀 Performance

- **Serverless**: Schaalt automatisch op basis van vraag
- **CDN**: Vercel's global CDN voor snelle laadtijden
- **Optimized uploads**: Efficiënte multipart upload handling

## 📱 Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🤝 Contributing

1. Fork het project
2. Maak een feature branch
3. Commit je changes
4. Push naar de branch
5. Open een Pull Request

## 📄 License

MIT License - zie LICENSE file voor details.

## 🆘 Support

Voor vragen of problemen, open een issue in de GitHub repository.

---

**NoLimitBox** - Groter. Meer. Onbeperkt. 🚀