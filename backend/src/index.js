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
   CORS FIX (PRODUCTION SAFE)
========================= */

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gallery-pied-six.vercel.app',
  'https://gallery-app-git-main-crazzyds-projects.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌍 Origin:', origin);

    // allow server-to-server / postman
    if (!origin) return callback(null, true);

    // strict match OR vercel preview support
    const allowed =
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin);

    if (allowed) {
      return callback(null, true);
    }

    console.error('❌ CORS BLOCKED:', origin);

    // ❗ ВАЖНО: НЕ БЛОКИРУЕМ ЖЁСТКО (иначе Render иногда даёт пустой ответ)
    return callback(null, false);
  },

  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

/* =========================
   APPLY CORS PROPERLY
========================= */
app.use(cors(corsOptions));

// IMPORTANT FOR PRELIGHT
app.options('*', cors(corsOptions));

/* =========================
   BODY
========================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(compression());

/* =========================
   ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

/* =========================
   HEALTH
========================= */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* =========================
   ROOT
========================= */
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

/* =========================
   ERROR HANDLER (IMPORTANT FIX)
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err);

  res.setHeader('Access-Control-Allow-Origin', '*');

  res.status(err.status || 500).json({
    error: err.message || 'Server error',
  });
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});