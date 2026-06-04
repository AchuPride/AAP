require('dotenv').config();
const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

async function reset() {
  const client = await pool.connect();
  try {
    console.log('Wiping database tables and custom types...');
    await client.query('BEGIN');
    
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

    console.log('Running schema migrations...');
    const sql1 = fs.readFileSync(path.join(__dirname, '001_schema.sql'), 'utf8');
    const sql2 = fs.readFileSync(path.join(__dirname, '002_add_new_features.sql'), 'utf8');
    
    await client.query(sql1);
    await client.query(sql2);

    console.log('Seeding default users...');
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

    await client.query('COMMIT');
    console.log('✅ Database reset and default users seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Database reset failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

reset();
