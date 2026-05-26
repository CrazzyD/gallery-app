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
   SECURITY
========================= */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/* =========================
   CORS FIX
========================= */
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://gallery-pied-six.vercel.app',
      'https://gallery-nequjxtzd-crazzyds-projects.vercel.app',
    ],
    credentials: true,
  })
);

/* =========================
   BODY PARSER
========================= */
app.use(express.json());
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
      res.set('Access-Control-Allow-Origin', '*');
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
   HEALTH
========================= */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

/* =========================
   ROOT
========================= */
app.get('/', (req, res) => {
  res.json({
    message: 'Gallery Backend Running 🚀',
  });
});

/* =========================
   404
========================= */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 SERVER ERROR:', err);

  res.status(500).json({
    error: err.message || 'Internal server error',
  });
});

/* =========================
   START
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});