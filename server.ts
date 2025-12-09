import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT || process.env.WEBSITES_PORT || '3000', 10);

app.use(cors());

// Health check endpoints
app.get('/heartbeat', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT
  });
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// API endpoint for menu
app.get('/api/menu', (_req, res) => {
  res.json([
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Messages', path: '/messages', icon: 'mail' },
    { label: 'System', path: '/System', icon: 'AllInclusiveIcon' }
  ]);
});

// Serve static files from React build
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

app.get('/', (_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});