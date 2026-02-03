#!/usr/bin/env node
/**
 * Test RPC endpoint connectivity
 * Usage: node scripts/test-rpc.js
 *
 * Tests: eth_blockNumber call to each configured RPC
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const RPC_ENDPOINTS = {
  'Ethereum Sepolia': process.env.RPC_ETHEREUM,
  'Arbitrum Sepolia': process.env.RPC_ARBITRUM,
  'Base Sepolia': process.env.RPC_BASE,
  'Polygon Amoy': process.env.RPC_POLYGON
};

async function testRpc(name, url) {
  const label = name.padEnd(18);

  if (!url) {
    console.log(`⏭️  ${label} Not configured`);
    return null;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1
      })
    });

    const data = await response.json();

    if (data.result) {
      const blockNumber = parseInt(data.result, 16);
      console.log(`✅ ${label} Block #${blockNumber.toLocaleString()}`);
      return true;
    } else if (data.error) {
      console.error(`❌ ${label} ${data.error.message}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${label} ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔗 Testing RPC endpoints...\n');

  const results = [];

  for (const [name, url] of Object.entries(RPC_ENDPOINTS)) {
    results.push(await testRpc(name, url));
  }

  const configured = results.filter(r => r !== null);
  const passed = configured.filter(r => r === true);

  console.log(`\n${passed.length}/${configured.length} endpoints responding`);
}

main();
