#!/usr/bin/env node

/**
 * Database Connection Test Script
 * 
 * Tests MongoDB connection and validates setup
 * Run: npm run test:db
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  '';
const NODE_ENV = process.env.NODE_ENV || 'development';

async function testConnection() {
  console.log('\n' + '='.repeat(60));
  console.log('DATABASE CONNECTION TEST');
  console.log('='.repeat(60) + '\n');

  if (!DATABASE_URL) {
    console.error('Missing MongoDB connection string.');
    console.error('Set one of: DATABASE_URL, MONGODB_URI, or MONGO_URI');
    process.exit(1);
  }

  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Database URL: ${DATABASE_URL.includes('@') ? DATABASE_URL.split('@')[1] : DATABASE_URL}\n`);

  try {
    console.log('[1/5] Attempting connection...');
    
    await mongoose.connect(DATABASE_URL);
    
    console.log('[✓] Connected successfully!\n');

    console.log('[2/5] Checking connection status...');
    const readyState = mongoose.connection.readyState;
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    console.log(`[✓] Status: ${states[readyState]} (code: ${readyState})\n`);

    console.log('[3/5] Checking database info...');
    const dbName = mongoose.connection.name || 'jobagent';
    console.log(`[✓] Database: ${dbName}`);
    console.log(`[✓] Connection established successfully\n`);

    console.log('[4/5] Listing collections...');
    const db = mongoose.connection.getClient().db(dbName);
    const collections = await db.listCollections().toArray();
    
    if (collections && collections.length > 0) {
      console.log(`[✓] Found ${collections.length} collections:`);
      collections.forEach(col => {
        console.log(`    - ${col.name}`);
      });
    } else {
      console.log('[!] Database is empty (no collections yet)');
    }
    console.log();

    console.log('[5/5] Testing basic operations...');
    
    // Create a test collection
    const testSchema = new mongoose.Schema({
      testField: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('TestConnection', testSchema);
    
    // Test write
    const testDoc = await TestModel.create({
      testField: `Test at ${new Date().toISOString()}`
    });
    console.log(`[✓] Write test passed (ID: ${testDoc._id})`);
    
    // Test read
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log(`[✓] Read test passed (Value: ${foundDoc?.testField})`);
    
    // Test delete
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log(`[✓] Delete test passed\n`);

    console.log('='.repeat(60));
    console.log('SUCCESS: Database connection working perfectly!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('ERROR: Database connection failed!');
    console.error('='.repeat(60) + '\n');
    
    if (error instanceof Error) {
      console.error(`Error: ${error.message}\n`);
      
      if (error.message.includes('ECONNREFUSED')) {
        console.error('Solution: Make sure MongoDB is running locally');
        console.error('  - On macOS: brew services start mongodb-community');
        console.error('  - Or use MongoDB Atlas (cloud): Update DATABASE_URL in .env');
      } else if (error.message.includes('authentication failed')) {
        console.error('Solution: Check your MongoDB credentials');
        console.error('  - Username and password must be correct');
        console.error('  - Check DATABASE_URL in .env file');
      } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
        console.error('Solution: Check your MongoDB Atlas cluster');
        console.error('  - Verify connection string from Atlas dashboard');
        console.error('  - Check IP whitelist in Network Access');
      }
    } else {
      console.error(error);
    }
    
    console.error('\nDebug info:');
    console.error(`  - NODE_ENV: ${NODE_ENV}`);
    console.error(`  - DATABASE_URL configured: ${!!process.env.DATABASE_URL}`);
    console.error(`  - MONGODB_URI configured: ${!!process.env.MONGODB_URI}`);
    console.error(`  - MONGO_URI configured: ${!!process.env.MONGO_URI}`);
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Info] Disconnected from database\n');
  }
}

// Run tests
testConnection().catch(console.error);
