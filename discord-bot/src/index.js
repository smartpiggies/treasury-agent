import { Client, GatewayIntentBits, Partials } from 'discord.js';

// Configuration from environment
const config = {
  token: process.env.DISCORD_BOT_TOKEN,
  webhookUrl: process.env.N8N_WEBHOOK_URL || 'https://n8n.smartpiggies.cloud/webhook/discord-cmd',
  allowedChannels: process.env.ALLOWED_CHANNEL_IDS
    ? process.env.ALLOWED_CHANNEL_IDS.split(',').map(id => id.trim())
    : [], // Empty = allow all
};

// Validate required config
if (!config.token) {
  console.error('ERROR: DISCORD_BOT_TOKEN is required');
  process.exit(1);
}

console.log('Treasury Discord Bot starting...');
console.log(`Webhook URL: ${config.webhookUrl}`);
console.log(`Allowed channels: ${config.allowedChannels.length ? config.allowedChannels.join(', ') : 'ALL'}`);

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

// Track bot's own user ID
let botUserId = null;

// Ready event
client.once('ready', () => {
  botUserId = client.user.id;
  console.log(`Bot logged in as ${client.user.tag} (ID: ${botUserId})`);
  console.log(`Bot is in ${client.guilds.cache.size} server(s)`);

  // List servers for debugging
  client.guilds.cache.forEach(guild => {
    console.log(`  - ${guild.name} (${guild.id})`);
  });
});

// Message handler
client.on('messageCreate', async (message) => {
  // Ignore bot's own messages
  if (message.author.bot) return;

  // Check if bot was mentioned
  const botMentioned = message.mentions.has(botUserId);
  if (!botMentioned) return;

  // Check channel restrictions
  if (config.allowedChannels.length > 0 && !config.allowedChannels.includes(message.channel.id)) {
    console.log(`Ignored message in non-allowed channel: ${message.channel.id}`);
    return;
  }

  // Extract command (remove bot mention)
  const mentionRegex = new RegExp(`<@!?${botUserId}>`, 'g');
  const content = message.content.replace(mentionRegex, '').trim();

  console.log(`\n--- New Command ---`);
  console.log(`Channel: ${message.channel.name || 'DM'} (${message.channel.id})`);
  console.log(`Author: ${message.author.tag} (${message.author.id})`);
  console.log(`Content: "${content}"`);

  // Build payload for n8n
  const payload = {
    messageId: message.id,
    channelId: message.channel.id,
    channelName: message.channel.name || 'DM',
    guildId: message.guild?.id || null,
    guildName: message.guild?.name || null,
    author: {
      id: message.author.id,
      username: message.author.username,
      displayName: message.author.displayName || message.author.username,
      tag: message.author.tag,
    },
    content: content,
    rawContent: message.content,
    timestamp: message.createdAt.toISOString(),
  };

  // Send typing indicator
  try {
    await message.channel.sendTyping();
  } catch (e) {
    // Ignore typing errors
  }

  // Forward to n8n webhook
  try {
    console.log(`Forwarding to n8n: ${config.webhookUrl}`);

    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n webhook error: ${response.status} - ${errorText}`);

      // Reply with error
      await message.reply({
        content: `Sorry, I encountered an error processing your request. (Status: ${response.status})`,
        allowedMentions: { repliedUser: false },
      });
      return;
    }

    // Check if n8n sends a response
    const responseData = await response.json().catch(() => null);

    if (responseData?.reply) {
      // n8n sent a direct reply - send it
      await message.reply({
        content: responseData.reply,
        allowedMentions: { repliedUser: false },
      });
      console.log(`Sent reply from n8n response`);
    } else {
      // n8n will handle response via Discord webhook
      console.log(`Command forwarded successfully (n8n will respond via webhook)`);
    }

  } catch (error) {
    console.error(`Failed to forward to n8n:`, error.message);

    // Reply with error
    try {
      await message.reply({
        content: `Sorry, I couldn't reach the command processor. Please try again later.`,
        allowedMentions: { repliedUser: false },
      });
    } catch (replyError) {
      console.error(`Failed to send error reply:`, replyError.message);
    }
  }
});

// Error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  client.destroy();
  process.exit(0);
});

// Login to Discord
console.log('Connecting to Discord...');
client.login(config.token).catch((error) => {
  console.error('Failed to login:', error.message);
  process.exit(1);
});
