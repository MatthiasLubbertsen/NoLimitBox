const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes voor lokale ontwikkeling
app.use('/api', require('./api/upload'));
app.use('/api', require('./api/view'));

// Serve index.html voor root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve view.html voor /view routes
app.get('/view/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`NoLimitBox server running on http://localhost:${PORT}`);
});