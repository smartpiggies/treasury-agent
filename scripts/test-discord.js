#!/usr/bin/env node
/**
 * Test Discord webhook connectivity
 * Usage: node scripts/test-discord.js
 *
 * Requires: DISCORD_WEBHOOK_REPORTS and DISCORD_WEBHOOK_ALERTS in .env.local
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const REPORTS_WEBHOOK = process.env.DISCORD_WEBHOOK_REPORTS;
const ALERTS_WEBHOOK = process.env.DISCORD_WEBHOOK_ALERTS;

async function sendTestMessage(webhookUrl, type) {
  if (!webhookUrl) {
    console.error(`❌ ${type} webhook URL not set`);
    return false;
  }

  const payload = {
    embeds: [{
      title: `🧪 PigAiBank Test - ${type}`,
      description: `This is a test message from PigAiBank.\n\nTimestamp: ${new Date().toISOString()}`,
      color: type === 'Reports' ? 0x00ff00 : 0xffaa00,
      fields: [
        { name: 'Environment', value: 'Development', inline: true },
        { name: 'Status', value: '✅ Connected', inline: true }
      ],
      footer: { text: 'PigAiBank - Test Script' }
    }]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`✅ ${type} webhook: Message sent successfully`);
      return true;
    } else {
      console.error(`❌ ${type} webhook: HTTP ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${type} webhook: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔗 Testing Discord webhooks...\n');

  const results = await Promise.all([
    sendTestMessage(REPORTS_WEBHOOK, 'Reports'),
    sendTestMessage(ALERTS_WEBHOOK, 'Alerts')
  ]);

  console.log('\n' + (results.every(r => r) ? '✅ All webhooks working!' : '⚠️ Some webhooks failed'));
}

main();
