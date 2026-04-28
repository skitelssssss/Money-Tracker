import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import config from './config/index.js';
import healthRouter from './routes/health.js';
import transactionRouter from './routes/transactions.js';
import appRouter from './routes/app.js';
import { errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Rate limiting
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Logging
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Security
app.use(helmet());
app.use(cors());

// Body parsing
app.use(express.json());

// Static
app.use(express.static(join(__dirname, '..', 'public')));
app.use(express.static(join(__dirname, '..', 'dist')));

// Routes
app.use(healthRouter);
app.use('/api/transactions', transactionRouter);
app.use(appRouter);

// Error handling (must be last)
app.use(errorHandler);

export default app;
