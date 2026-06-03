const { query, getClient } = require('../config/database');

const findByToken = async (token) => {
  const result = await query(
    `SELECT c.id, c.case_token, c.violence_type, c.status,
            c.location, c.incident_date, c.is_priority, c.created_at, c.updated_at,
            c.incident_category, c.platform_involved, c.anonymous_toggle,
            u.full_name AS officer_name
     FROM cases c
     LEFT JOIN users u ON c.assigned_officer_id = u.id
     WHERE c.case_token = $1`,
    [token]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await query(
    `SELECT c.*, u.full_name AS officer_name, u.username AS officer_username
     FROM cases c
     LEFT JOIN users u ON c.assigned_officer_id = u.id
     WHERE c.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const getPublicUpdates = async (caseId) => {
  const result = await query(
    `SELECT update_type, old_status, new_status, public_message, created_at
     FROM case_updates
     WHERE case_id = $1 AND public_message IS NOT NULL
     ORDER BY created_at ASC`,
    [caseId]
  );
  return result.rows;
};

const getAllUpdates = async (caseId) => {
  const result = await query(
    `SELECT cu.*, u.full_name AS updated_by_name
     FROM case_updates cu
     LEFT JOIN users u ON cu.updated_by = u.id
     WHERE cu.case_id = $1
     ORDER BY cu.created_at ASC`,
    [caseId]
  );
  return result.rows;
};

const createCase = async ({ case_token, violence_type, description, location, incident_date, incident_category, platform_involved, anonymous_toggle }) => {
  const result = await query(
    `INSERT INTO cases (case_token, violence_type, description, location, incident_date, incident_category, platform_involved, anonymous_toggle)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING id, case_token, status, created_at`,
    [case_token, violence_type, description, location || null, incident_date, incident_category || null, platform_involved || null, anonymous_toggle !== undefined ? anonymous_toggle : true]
  );
  return result.rows[0];
};

const list = async ({ status, page = 1, limit = 20, officer_id } = {}) => {
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = [];

  if (status) {
    params.push(status);
    conditions.push(`c.status = $${params.length}`);
  }
  if (officer_id) {
    params.push(officer_id);
    conditions.push(`c.assigned_officer_id = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit, offset);
  const result = await query(
    `SELECT c.id, c.case_token, c.violence_type, c.status,
            c.location, c.incident_date, c.is_priority, c.created_at,
            u.full_name AS officer_name
     FROM cases c
     LEFT JOIN users u ON c.assigned_officer_id = u.id
     ${where}
     ORDER BY c.is_priority DESC, c.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const countResult = await query(
    `SELECT COUNT(*) FROM cases c ${where}`,
    params.slice(0, params.length - 2)
  );

  return {
    cases: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
  };
};

const updateCase = async (id, { status, assigned_officer_id, is_priority }) => {
  const fields = [];
  const values = [];

  if (status !== undefined) { fields.push(`status = $${values.length + 1}`); values.push(status); }
  if (assigned_officer_id !== undefined) { fields.push(`assigned_officer_id = $${values.length + 1}`); values.push(assigned_officer_id); }
  if (is_priority !== undefined) { fields.push(`is_priority = $${values.length + 1}`); values.push(is_priority); }

  if (!fields.length) return null;
  values.push(id);

  const result = await query(
    `UPDATE cases SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0];
};

const addUpdate = async ({ case_id, updated_by, update_type, old_status, new_status, note, public_message }) => {
  const result = await query(
    `INSERT INTO case_updates (case_id, updated_by, update_type, old_status, new_status, note, public_message)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [case_id, updated_by || null, update_type, old_status || null, new_status || null, note || null, public_message || null]
  );
  return result.rows[0];
};

const addEvidence = async ({ case_id, filename, mime_type, size_bytes }) => {
  const result = await query(
    `INSERT INTO case_evidence (case_id, filename, mime_type, size_bytes)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [case_id, filename, mime_type, size_bytes]
  );
  return result.rows[0];
};

const getStats = async () => {
  const result = await query(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'submitted')    AS submitted,
      COUNT(*) FILTER (WHERE status = 'under_review') AS under_review,
      COUNT(*) FILTER (WHERE status = 'assigned')     AS assigned,
      COUNT(*) FILTER (WHERE status = 'investigating')AS investigating,
      COUNT(*) FILTER (WHERE status = 'resolved')     AS resolved,
      COUNT(*) FILTER (WHERE status = 'closed')       AS closed,
      COUNT(*)                                         AS total,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')  AS last_7_days,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS last_30_days
    FROM cases
  `);

  const byType = await query(`
    SELECT violence_type, COUNT(*) AS count
    FROM cases GROUP BY violence_type ORDER BY count DESC
  `);

  return { ...result.rows[0], by_type: byType.rows };
};

module.exports = { findByToken, findById, getPublicUpdates, getAllUpdates, createCase, list, updateCase, addUpdate, addEvidence, getStats };
