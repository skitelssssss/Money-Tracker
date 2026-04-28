import http from 'node:http';
import app from './app.js';
import config from './config/index.js';
import prisma from './config/db.js';
import { setupBot } from './bot/bot.js';

const server = http.createServer(app);

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n[server] Received ${signal}, shutting down gracefully...`);
  server.close(async () => {
    console.log('[server] HTTP server closed');
    await prisma.$disconnect();
    console.log('[server] DB disconnected');
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    console.error('[server] Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start
server.listen(config.port, () => {
  console.log(`[${config.nodeEnv}] Server running on http://localhost:${config.port}`);
  console.log(`Healthcheck: http://localhost:${config.port}/health`);
  console.log(`WebApp:     http://localhost:${config.port}/app`);
});

// Bot
if (config.botToken) {
  setupBot().catch((err) => {
    console.warn('[bot] Init error:', err.message);
    console.warn('[bot] Make sure BOT_TOKEN is valid from @BotFather');
  });
} else {
  console.warn('[bot] BOT_TOKEN not set — bot will not start');
}
