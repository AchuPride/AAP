const crypto = require('crypto');
const { query } = require('../config/database');
const logger = require('../config/logger');

const auditLog = async ({ actor_id, action, resource, resource_id, metadata, ip }) => {
  try {
    // One-way hash of IP — privacy-preserving
    const ip_hash = ip ? crypto.createHash('sha256').update(ip + process.env.JWT_SECRET).digest('hex') : null;
    await query(
      `INSERT INTO audit_logs (actor_id, action, resource, resource_id, metadata, ip_hash)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [actor_id || null, action, resource || null, resource_id?.toString() || null, JSON.stringify(metadata || {}), ip_hash]
    );
  } catch (err) {
    logger.error('Audit log write failed:', err.message);
  }
};

module.exports = { auditLog };
