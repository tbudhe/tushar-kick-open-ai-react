import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || process.env.WEBSITES_PORT || '3000', 10);
const DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/jobagent';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================
async function connectDatabase() {
  try {
    console.log(`[DB] Connecting to MongoDB at: ${DATABASE_URL.split('@')[1] || 'local'}`);
    
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
    const isConnected = mongoose.connection.readyState === 1;
    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db?.listCollections().toArray();
    
    res.json({
      connected: isConnected,
      database: dbName || 'unknown',
      collections: collections?.map(c => c.name) || [],
      url: DATABASE_URL.split('@')[1] || 'local'
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve static files from React build
const buildPath = path.join(__dirname, 'dist', 'build');
app.use(express.static(buildPath));

// SPA fallback route
app.use((_req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
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