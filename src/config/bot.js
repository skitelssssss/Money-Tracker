import config from './index.js';
import { Bot } from 'grammy';

const bot = new Bot(config.botToken);

export default bot;
