import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import { env } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { setupRoutes } from './routes';
import { setupLocationTracking } from './realtime/locationTracking.socket';

const app = express();
const server = http.createServer(app);

// ── Socket.io ──────────────────────────────────────────────────────────────
export const io = new SocketServer(server, {
  cors: {
    origin: env.SOCKET_CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }));
app.use(rateLimiter);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    platform: 'Trishul API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ── Routes ─────────────────────────────────────────────────────────────────
setupRoutes(app);

// ── Socket handlers ────────────────────────────────────────────────────────
setupLocationTracking(io);

// ── Error handler (must be last) ───────────────────────────────────────────
app.use(errorHandler);

// ── Bootstrap ──────────────────────────────────────────────────────────────
async function bootstrap() {
  try {
    await connectDatabase();
    server.listen(env.PORT, () => {
      logger.info(`🚀 Trishul API running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`🔱 Platform: Travel Agency Intelligence System`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

export default app;
