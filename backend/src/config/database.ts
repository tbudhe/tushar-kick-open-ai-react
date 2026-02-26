import mongoose from 'mongoose';

const NODE_ENV = process.env.NODE_ENV || 'development';

export function getDatabaseUrl() {
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

export async function connectDatabase() {
  try {
    const databaseUrl = getDatabaseUrl();

    if (!databaseUrl) {
      console.error('[DB] Missing MongoDB connection string.');
      console.error('[DB] Set one of: DATABASE_URL, MONGODB_URI, or MONGO_URI');

      if (NODE_ENV === 'production') {
        console.error('[DB] CRITICAL: Cannot start in production without database');
        process.exit(1);
      }

      console.warn('[DB] Development mode: Continuing without database');
      return false;
    }

    console.log(`[DB] Connecting to MongoDB at: ${databaseUrl.split('@')[1] || 'configured-host'}`);
    await mongoose.connect(databaseUrl);

    console.log('[DB] MongoDB connected successfully!');
    console.log(`[DB] Database: ${mongoose.connection.name}`);

    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log(`[DB] Collections: ${collections?.map((collection) => collection.name).join(', ') || 'None (empty database)'}`);

    return true;
  } catch (error) {
    console.error('[DB] MongoDB connection failed!');
    console.error('[DB] Error:', error instanceof Error ? error.message : error);

    if (NODE_ENV === 'production') {
      console.error('[DB] CRITICAL: Cannot start in production without database');
      process.exit(1);
    }

    console.warn('[DB] Development mode: Continuing without database');
    return false;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

export async function getDatabaseDiagnostics() {
  const databaseUrl = getDatabaseUrl();
  const collections = await mongoose.connection.db?.listCollections().toArray();

  return {
    connected: isDatabaseConnected(),
    database: mongoose.connection.name || 'unknown',
    collections: collections?.map((collection) => collection.name) || [],
    url: databaseUrl ? databaseUrl.split('@')[1] || 'configured-host' : 'not-configured',
  };
}
