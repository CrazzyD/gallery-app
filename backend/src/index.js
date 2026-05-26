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
   TRUST PROXY (ВАЖНО ДЛЯ RENDER)
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
   CORS
========================= */
const allowedOrigins = [
  'http://localhost:3000',
  'https://gallery-pied-six.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Разрешаем server-to-server / curl / мобильные без origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Блокируем неизвестные origins (раньше пропускало всех — баг)
    return callback(new Error(`CORS: origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

/* =========================
   HANDLE PREFLIGHT
========================= */
// Передаём тот же конфиг, иначе preflight игнорирует ограничения
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
  // CORS-ошибки — 403, остальное — 500
  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({ error: err.message });
  }
  console.error('🔥 SERVER ERROR:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

/* =========================
   START + GRACEFUL SHUTDOWN
========================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown — важно для Render/Docker
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });

  // Если за 10 сек не закрылся — принудительно
  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Ловим необработанные ошибки — не даём процессу упасть молча
process.on('unhandledRejection', (reason) => {
  console.error('🔥 Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  shutdown('uncaughtException');
});