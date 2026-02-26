import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || process.env.WEBSITES_PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

function getDatabaseUrl() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.MONGODB_URI,
    process.env.MONGO_URI,
    process.env.MONGO_URL,
    process.env.DATABASEURI,
    process.env.DATABASEURL,
    process.env.database_url,
  ];

  const firstMatch = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
  return firstMatch?.trim() || '';
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================
async function connectDatabase() {
  try {
    const DATABASE_URL = getDatabaseUrl();

    if (!DATABASE_URL) {
      console.error('[DB] Missing MongoDB connection string.');
      console.error('[DB] Set one of: DATABASE_URL, MONGODB_URI, or MONGO_URI');

      if (NODE_ENV === 'production') {
        console.error('[DB] CRITICAL: Cannot start in production without database');
        process.exit(1);
      }

      console.warn('[DB] Development mode: Continuing without database');
      return false;
    }

    console.log(`[DB] Connecting to MongoDB at: ${DATABASE_URL.split('@')[1] || 'configured-host'}`);
    
    await mongoose.connect(DATABASE_URL);
    
    console.log('[DB] MongoDB connected successfully!');
    console.log(`[DB] Database: ${mongoose.connection.name}`);
    
    // Log available collections
    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log(`[DB] Collections: ${collections?.map(c => c.name).join(', ') || 'None (empty database)'}`);
    
    return true;
  } catch (error) {
    console.error('[DB] MongoDB connection failed!');
    console.error('[DB] Error:', error instanceof Error ? error.message : error);
    
    if (NODE_ENV === 'production') {
      console.error('[DB] CRITICAL: Cannot start in production without database');
      process.exit(1);
    } else {
      console.warn('[DB] Development mode: Continuing without database');
      return false;
    }
  }
}

// Health check endpoints
app.get('/heartbeat', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    port: PORT,
    database: dbStatus,
    environment: NODE_ENV
  });
});

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'healthy' : 'degraded',
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// API endpoint for menu
app.get('/api/menu', (_req, res) => {
  res.json([
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'Profile', path: '/profile', icon: 'person' },
    { label: 'Job Search', path: '/job-search', icon: 'briefcase' },
    { label: 'Applications', path: '/applications', icon: 'checklist' },
    { label: 'Settings', path: '/settings', icon: 'settings' }
  ]);
});

// API endpoint to check database connection
app.get('/api/db-status', async (_req, res) => {
  try {
    const DATABASE_URL = getDatabaseUrl();
    const isConnected = mongoose.connection.readyState === 1;
    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    res.json({
      connected: isConnected,
      database: dbName || 'unknown',
      collections: collections?.map(c => c.name) || [],
      url: DATABASE_URL ? DATABASE_URL.split('@')[1] || 'configured-host' : 'not-configured'
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static files from React build
// Probe several likely locations because different build/deploy setups
// may place the React build at different paths. Choose the first location
// where an index.html is present.
const candidateBuildPaths = [
  // Common when server compiled into dist and build files are next to server
  path.join(__dirname, 'build'),
  path.join(__dirname, 'dist', 'build'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', 'build'),
  path.join(__dirname),
  // From project root when running without compilation
  path.join(process.cwd(), 'dist', 'build'),
  path.join(process.cwd(), 'dist'),
  path.join(process.cwd(), 'build'),
  process.cwd()
];

let buildPath: string | undefined;
let indexPath: string | undefined;

for (const candidate of candidateBuildPaths) {
  const candidateIndex = path.join(candidate, 'index.html');
  if (fs.existsSync(candidateIndex)) {
    buildPath = candidate;
    indexPath = candidateIndex;
    break;
  }
  // also check candidate/build/index.html (some setups nest another 'build')
  const nestedIndex = path.join(candidate, 'build', 'index.html');
  if (fs.existsSync(nestedIndex)) {
    buildPath = path.join(candidate, 'build');
    indexPath = nestedIndex;
    break;
  }
}

if (!buildPath || !indexPath) {
  // default to __dirname/build to keep prior behavior and informative logs
  buildPath = path.join(__dirname, 'build');
  indexPath = path.join(buildPath, 'index.html');
}

const indexExists = fs.existsSync(indexPath);
if (NODE_ENV !== 'production') {
  console.log(`[SERVER] Candidate build paths: ${candidateBuildPaths.join(', ')}`);
  console.log(`[SERVER] Using buildPath: ${buildPath}`);
  console.log(`[SERVER] index.html exists: ${indexExists} -> ${indexPath}`);
}

app.use(express.static(buildPath));

// SPA fallback route with defensive behavior
app.use((_req, res) => {
  if (indexExists && indexPath) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(
      `index.html not found. Looked at: ${candidateBuildPaths.join(', ')}`
    );
  }
});

// ============================================
// ERROR HANDLING
// ============================================
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('[ERROR]', err);
  res.status(500).json({
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// ============================================
// SERVER STARTUP
// ============================================
async function startServer() {
  try {
    // Connect to database
    const dbConnected = await connectDatabase();
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`[SERVER] Started successfully!`);
      console.log(`[SERVER] URL: http://localhost:${PORT}`);
      console.log(`[SERVER] Environment: ${NODE_ENV}`);
      console.log(`[SERVER] Database: ${dbConnected ? 'Connected' : 'Not connected'}`);
      console.log(`[SERVER] Health: http://localhost:${PORT}/health`);
      console.log(`[SERVER] Database Status: http://localhost:${PORT}/api/db-status`);
      console.log(`${'='.repeat(60)}\n`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('[SERVER] SIGTERM received, shutting down gracefully...');
      process.exit(0);
    });
    
    process.on('SIGINT', () => {
      console.log('[SERVER] SIGINT received, shutting down gracefully...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('[SERVER] Failed to start:',error);
    process.exit(1);
  }
}

// Start the server
startServer();