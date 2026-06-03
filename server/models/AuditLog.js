const { query } = require('../config/database');

const list = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const result = await query(
    `SELECT a.id, a.action, a.resource, a.resource_id, a.metadata, a.ip_hash, a.created_at,
            u.username AS actor_username, u.full_name AS actor_full_name
     FROM audit_logs a
     LEFT JOIN users u ON a.actor_id = u.id
     ORDER BY a.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const count = await query('SELECT COUNT(*) FROM audit_logs');
  return { logs: result.rows, total: parseInt(count.rows[0].count), page, limit };
};

module.exports = { list };
