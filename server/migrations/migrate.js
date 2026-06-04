require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function migrate() {
  const sql1 = fs.readFileSync(path.join(__dirname, '001_schema.sql'), 'utf8');
  const sql2 = fs.readFileSync(path.join(__dirname, '002_add_new_features.sql'), 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql1);
    await client.query(sql2);
    await client.query('COMMIT');
    console.log('✅  Migration completed successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
