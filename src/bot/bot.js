import bot from '../config/bot.js';
import config from '../config/index.js';

export async function setupBot() {
  bot.command('start', async (ctx) => {
    await ctx.reply('Добро пожаловать в Money Tracker!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Открыть трекер',
              web_app: { url: config.webAppUrl },
            },
          ],
        ],
      },
    });
  });

  try {
    await bot.start({
      onStart: () => console.log('[bot] Telegram bot started'),
    });
  } catch (err) {
    console.warn('[bot] Failed to start bot:', err.message);
    console.warn('[bot] Make sure BOT_TOKEN is a valid token from @BotFather');
  }

  return bot;
}
