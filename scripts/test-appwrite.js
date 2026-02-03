#!/usr/bin/env node
/**
 * Test Appwrite database connectivity
 * Usage: node scripts/test-appwrite.js
 *
 * Tests: Read/write to all 4 collections
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'treasury';

const COLLECTIONS = {
  price_history: {
    testDoc: {
      timestamp: new Date().toISOString(),
      token: 'ETH',
      price_usd: 2500.00,
      source: 'test-script'
    }
  },
  balances: {
    testDoc: {
      timestamp: new Date().toISOString(),
      chain: 'sepolia',
      token: 'ETH',
      balance: '0.1',
      balance_usd: 250.00
    }
  },
  alerts: {
    testDoc: {
      timestamp: new Date().toISOString(),
      type: 'price_high',
      severity: 'warning',
      message: 'Test alert from script',
      token: 'ETH'
    }
  },
  executions: {
    testDoc: {
      timestamp: new Date().toISOString(),
      type: 'swap',
      source_chain: 'sepolia',
      dest_chain: 'sepolia',
      source_token: 'ETH',
      dest_token: 'USDC',
      amount: '0.01',
      amount_usd: 25.00,
      status: 'pending'
    }
  }
};

async function testCollection(collectionId, testData) {
  const label = collectionId.padEnd(15);

  try {
    // Test write
    const doc = await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      testData
    );

    // Test read
    await databases.getDocument(DATABASE_ID, collectionId, doc.$id);

    // Clean up - delete test document
    await databases.deleteDocument(DATABASE_ID, collectionId, doc.$id);

    console.log(`✅ ${label} Read/Write/Delete OK`);
    return true;
  } catch (error) {
    console.error(`❌ ${label} ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🗄️  Testing Appwrite connection...\n');
  console.log(`   Endpoint: ${process.env.APPWRITE_ENDPOINT}`);
  console.log(`   Project:  ${process.env.APPWRITE_PROJECT_ID}`);
  console.log(`   Database: ${DATABASE_ID}\n`);

  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ APPWRITE_API_KEY not set');
    process.exit(1);
  }

  const results = [];

  for (const [collectionId, config] of Object.entries(COLLECTIONS)) {
    results.push(await testCollection(collectionId, config.testDoc));
  }

  console.log('\n' + (results.every(r => r) ? '✅ All collections working!' : '⚠️ Some collections failed'));
}

main().catch(console.error);
