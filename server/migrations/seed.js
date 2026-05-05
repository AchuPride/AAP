require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const adminHash = await bcrypt.hash('Admin@2024!', 12);
    const officerHash = await bcrypt.hash('Officer@2024!', 12);

    await client.query(
      `INSERT INTO users (username, password_hash, full_name, role_id)
       VALUES ($1,$2,$3,(SELECT id FROM roles WHERE name='admin'))
       ON CONFLICT (username) DO NOTHING`,
      ['admin', adminHash, 'System Administrator']
    );

    await client.query(
      `INSERT INTO users (username, password_hash, full_name, role_id)
       VALUES ($1,$2,$3,(SELECT id FROM roles WHERE name='officer'))
       ON CONFLICT (username) DO NOTHING`,
      ['officer1', officerHash, 'Case Officer One']
    );

    await client.query('COMMIT');
    console.log('✅  Seed completed');
    console.log('   Admin:    admin / Admin@2024!');
    console.log('   Officer:  officer1 / Officer@2024!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
