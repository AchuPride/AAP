require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const { defaultLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./config/logger');

// ── Route imports ──────────────────────────────────────────────
const reportRoutes = require('./routes/report');
const caseRoutes   = require('./routes/cases');
const authRoutes   = require('./routes/auth');
const adminRoutes  = require('./routes/admin');
const partnerRoutes = require('./routes/partners');
const newsRoutes    = require('./routes/news');
const testimonialRoutes = require('./routes/testimonials');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure logs directory exists
['logs', 'uploads'].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Security headers ───────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        scriptSrc: ["'self'"],
      },
    },
  })
);

// ── CORS ───────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Body parsing ───────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// ── Global rate limit ──────────────────────────────────────────
app.use(defaultLimiter);

// ── Trust proxy (for rate-limit behind Render/Railway reverse proxy) ──
app.set('trust proxy', 1);

// ── Health check ───────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── API routes ─────────────────────────────────────────────────
app.use('/api/report', reportRoutes);
app.use('/api/cases',  caseRoutes);
app.use('/api/auth',   authRoutes);
app.use('/api/admin',  adminRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/testimonials', testimonialRoutes);

// ── Static file serving for uploaded evidence (private — could add token auth) ──
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Serve React Frontend in Production ──
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.use(notFound);
}
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`GBV Platform server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
}

module.exports = app;
