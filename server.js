import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static('public'));

// Serve service worker at root
app.get('/fetch-intercept.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'fetch-intercept.js'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
