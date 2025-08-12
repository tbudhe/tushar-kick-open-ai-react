import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = process.env.WEBSITES_PORT || 3000;

app.use(cors());

app.get('/heartbeat', (_req, res) => {
  res.send('Server is running');
});
// API endpoint for menu
app.get('/api/menu', (_req, res) => {
  res.json([
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Messages', path: '/messages', icon: 'mail' },
    { label: 'Settings', path: '/settings', icon: 'settings' }
  ]);
});

// Serve static files from React build
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});