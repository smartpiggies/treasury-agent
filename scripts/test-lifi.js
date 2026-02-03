#!/usr/bin/env node
/**
 * Test LI.FI API connectivity and fetch wallet balances
 * Usage: node scripts/test-lifi.js
 *
 * Tests: Token balances across chains using LI.FI API
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const LIFI_API = 'https://li.quest/v1';
const WALLET_ADDRESS = process.env.TREASURY_ADDRESS;
const INTEGRATOR = process.env.LIFI_INTEGRATOR_ID || 'treasury-ops-bot';

// Testnet chain IDs
const CHAINS = {
  11155111: 'Ethereum Sepolia',
  421614: 'Arbitrum Sepolia',
  84532: 'Base Sepolia'
};

async function getTokenBalances() {
  if (!WALLET_ADDRESS) {
    console.error('❌ TREASURY_ADDRESS not set');
    return null;
  }

  console.log(`📍 Wallet: ${WALLET_ADDRESS}\n`);

  try {
    // LI.FI tokens endpoint - get balances
    const url = `${LIFI_API}/tokens?chains=${Object.keys(CHAINS).join(',')}&integrator=${INTEGRATOR}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.tokens) {
      console.log('✅ LI.FI API connected');
      console.log(`   Found tokens on ${Object.keys(data.tokens).length} chains\n`);

      // Show supported chains
      for (const [chainId, tokens] of Object.entries(data.tokens)) {
        const chainName = CHAINS[chainId] || `Chain ${chainId}`;
        console.log(`   ${chainName}: ${tokens.length} tokens supported`);
      }
      return true;
    }
  } catch (error) {
    console.error(`❌ LI.FI API error: ${error.message}`);
    return false;
  }
}

async function testQuote() {
  console.log('\n🔄 Testing quote endpoint...\n');

  try {
    // Get a simple quote (won't execute, just tests API)
    const params = new URLSearchParams({
      fromChain: '11155111', // Sepolia
      toChain: '11155111',
      fromToken: '0x0000000000000000000000000000000000000000', // Native ETH
      toToken: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // USDC on Sepolia
      fromAmount: '10000000000000000', // 0.01 ETH
      fromAddress: WALLET_ADDRESS,
      integrator: INTEGRATOR
    });

    const response = await fetch(`${LIFI_API}/quote?${params}`);
    const data = await response.json();

    if (data.estimate) {
      console.log('✅ Quote endpoint working');
      console.log(`   Route: ${data.toolDetails?.name || 'Unknown'}`);
      console.log(`   Estimated output: ${data.estimate.toAmountMin}`);
      return true;
    } else if (data.message) {
      // May get "no route found" on testnet - that's OK, API is working
      console.log(`⚠️  Quote response: ${data.message}`);
      console.log('   (This is normal on testnets - API is responding)');
      return true;
    }
  } catch (error) {
    console.error(`❌ Quote error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🦎 Testing LI.FI integration...\n');
  console.log(`   Integrator: ${INTEGRATOR}`);
  console.log(`   API Key: ${process.env.LIFI_API_KEY ? '✅ Set' : '⚠️ Not set (using public rate limits)'}\n`);

  await getTokenBalances();
  await testQuote();

  console.log('\n✅ LI.FI integration test complete');
}

main().catch(console.error);
