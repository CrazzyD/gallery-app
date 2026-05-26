import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// routes
import authRoutes from './routes/auth.js';
import imageRoutes from './routes/images.js';
import likeRoutes from './routes/likes.js';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

/* =========================
   TRUST PROXY (RENDER)
========================= */
app.set('trust proxy', 1);

/* =========================
   SECURITY
========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* =========================
   CORS (PRODUCTION FIX)
========================= */

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌍 Origin:', origin);

    // allow server-to-server / postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error('❌ CORS BLOCKED:', origin);
    return callback(new Error('CORS not allowed'), false);
  },

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],
};

/* APPLY CORS */
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* =========================
   BODY PARSER
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================
   COMPRESSION
========================= */
app.use(compression());

/* =========================
   STATIC FILES
========================= */
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
      res.set('Cache-Control', 'public, max-age=31536000');
    },
  })
);

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/* =========================
   ROOT
========================= */
app.get('/', (req, res) => {
  res.json({ message: 'Gallery Backend Running 🚀' });
});

/* =========================
   404
========================= */
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err);

  if (err.message?.includes('CORS')) {
    return res.status(403).json({ error: err.message });
  }

  res.status(500).json({
    error: err.message || 'Internal server error',
  });
});

/* =========================
   START SERVER
========================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

/* =========================
   SHUTDOWN HANDLER
========================= */
const shutdown = (signal) => {
  console.log(`\n${signal} received. shutting down...`);

  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⚠️ Force shutdown');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('🔥 Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  shutdown('uncaughtException');
});