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
let startupError = null;

app.get('/api/health', async (_req, res) => {
  const { pool } = require('./config/database');
  let dbStatus = 'disconnected';
  let tables = [];
  let userCount = 0;
  let error = null;

  try {
    const client = await pool.connect();
    dbStatus = 'connected';
    try {
      const tablesRes = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      tables = tablesRes.rows.map(r => r.table_name);
      
      if (tables.includes('users')) {
        const usersCountRes = await client.query('SELECT COUNT(*) FROM users');
        userCount = parseInt(usersCountRes.rows[0].count);
      }
    } catch (e) {
      error = e.message;
    } finally {
      client.release();
    }
  } catch (e) {
    error = e.message;
  }

  res.json({
    status: dbStatus === 'connected' && !startupError && !error ? 'ok' : 'error',
    timestamp: new Date(),
    database: dbStatus,
    tables,
    userCount,
    startupError: startupError || null,
    queryError: error || null,
    envResetDb: process.env.RESET_DB || 'not_set'
  });
});

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

// ── Database Migrations and Seeding on Startup ────────────────
const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function runMigrationsAndSeedOnStartup() {
  const client = await pool.connect();
  try {
    logger.info('Running database migrations on startup...');
    const sql1 = fs.readFileSync(path.join(__dirname, 'migrations', '001_schema.sql'), 'utf8');
    const sql2 = fs.readFileSync(path.join(__dirname, 'migrations', '002_add_new_features.sql'), 'utf8');
    
    await client.query('BEGIN');

    if (process.env.RESET_DB === 'true') {
      logger.warn('RESET_DB environment variable is set to true. Wiping database tables and custom types...');
      await client.query(`
        DROP TABLE IF EXISTS audit_logs CASCADE;
        DROP TABLE IF EXISTS case_updates CASCADE;
        DROP TABLE IF EXISTS case_evidence CASCADE;
        DROP TABLE IF EXISTS cases CASCADE;
        DROP TABLE IF EXISTS testimonials CASCADE;
        DROP TABLE IF EXISTS news CASCADE;
        DROP TABLE IF EXISTS partners CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TABLE IF EXISTS roles CASCADE;

        DROP TYPE IF EXISTS case_status CASCADE;
        DROP TYPE IF EXISTS violence_type CASCADE;
        DROP TYPE IF EXISTS update_type CASCADE;
      `);
      logger.info('Database wiped successfully.');
    }

    await client.query(sql1);
    await client.query(sql2);
    await client.query('COMMIT');
    logger.info('✅ Database migrations executed successfully');

    // Check if users table is empty and seed if necessary
    const userCountRes = await client.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(userCountRes.rows[0].count);
    if (userCount === 0) {
      logger.info('Database has no users. Seeding default admin and officer accounts...');
      
      const adminHash = await bcrypt.hash('Admin@2024!', 12);
      const officerHash = await bcrypt.hash('Officer@2024!', 12);

      await client.query(
        `INSERT INTO users (username, password_hash, full_name, role_id)
         VALUES ($1,$2,$3,(SELECT id FROM roles WHERE name='admin'))`,
        ['admin', adminHash, 'System Administrator']
      );

      await client.query(
        `INSERT INTO users (username, password_hash, full_name, role_id)
         VALUES ($1,$2,$3,(SELECT id FROM roles WHERE name='officer'))`,
        ['officer1', officerHash, 'Case Officer One']
      );
      logger.info('✅ Default seed completed successfully');
    }
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    startupError = err.message;
    logger.error('❌ Database migration/seed failed on startup:', err.message);
  } finally {
    client.release();
  }
}

// ── Start ──────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  runMigrationsAndSeedOnStartup().then(() => {
    app.listen(PORT, () => {
      logger.info(`GBV Platform server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  }).catch((err) => {
    logger.error('❌ Failed to run startup sequence:', err.message);
    // fallback start
    app.listen(PORT, () => {
      logger.info(`GBV Platform server running on port ${PORT} [${process.env.NODE_ENV}] (without startup sequence)`);
    });
  });
}

module.exports = app;
