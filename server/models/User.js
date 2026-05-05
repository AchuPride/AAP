const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const findByUsername = async (username) => {
  const result = await query(
    `SELECT u.id, u.username, u.password_hash, u.full_name, u.is_active, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     WHERE u.username = $1`,
    [username]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await query(
    `SELECT u.id, u.username, u.full_name, u.is_active, u.last_login, u.created_at, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     WHERE u.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const list = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT u.id, u.username, u.full_name, u.is_active, u.last_login, u.created_at, r.name AS role
     FROM users u JOIN roles r ON u.role_id = r.id
     ORDER BY u.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const count = await query('SELECT COUNT(*) FROM users');
  return { users: result.rows, total: parseInt(count.rows[0].count), page, limit };
};

const create = async ({ username, password, full_name, role }) => {
  const hash = await bcrypt.hash(password, 12);
  const result = await query(
    `INSERT INTO users (username, password_hash, full_name, role_id)
     VALUES ($1,$2,$3,(SELECT id FROM roles WHERE name=$4))
     RETURNING id, username, full_name, created_at`,
    [username, hash, full_name, role]
  );
  return result.rows[0];
};

const updateLastLogin = async (id) => {
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [id]);
};

const toggleActive = async (id) => {
  const result = await query(
    'UPDATE users SET is_active = NOT is_active WHERE id = $1 RETURNING id, username, is_active',
    [id]
  );
  return result.rows[0];
};

const verifyPassword = async (plain, hash) => bcrypt.compare(plain, hash);

const listOfficers = async () => {
  const result = await query(
    `SELECT u.id, u.full_name, u.username,
            COUNT(c.id) AS assigned_cases
     FROM users u
     LEFT JOIN cases c ON c.assigned_officer_id = u.id AND c.status NOT IN ('resolved','closed')
     JOIN roles r ON u.role_id = r.id
     WHERE r.name = 'officer' AND u.is_active = TRUE
     GROUP BY u.id
     ORDER BY assigned_cases ASC`
  );
  return result.rows;
};

module.exports = { findByUsername, findById, list, create, updateLastLogin, toggleActive, verifyPassword, listOfficers };
