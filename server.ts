import dotenv from 'dotenv';
import { connectDatabase } from './backend/src/config/database';
import { createApp } from './backend/src/app';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// SERVER STARTUP
// ============================================
async function startServer() {
  try {
    const dbConnected = await connectDatabase();
    const app = createApp();
    
    // Start Express server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`[SERVER] Started successfully!`);
      console.log(`[SERVER] URL: http://localhost:${PORT}`);
      console.log(`[SERVER] Environment: ${NODE_ENV}`);
      console.log(`[SERVER] Database: ${dbConnected ? 'Connected' : 'Not connected'}`);
      console.log(`[SERVER] Frontend Dev URL: http://localhost:5173 (run npm run dev:frontend)`);
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