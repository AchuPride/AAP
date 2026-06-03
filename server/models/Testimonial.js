const { query } = require('../config/database');

const listPublic = async () => {
  const result = await query(
    `SELECT * FROM testimonials WHERE is_approved = true ORDER BY created_at DESC`
  );
  return result.rows;
};

const listAll = async () => {
  const result = await query(
    `SELECT * FROM testimonials ORDER BY created_at DESC`
  );
  return result.rows;
};

const create = async ({ author_name, feedback, category }) => {
  const result = await query(
    `INSERT INTO testimonials (author_name, feedback, category, is_approved)
     VALUES ($1, $2, $3, false)
     RETURNING *`,
    [author_name || 'Anonymous Survivor', feedback, category]
  );
  return result.rows[0];
};

const approve = async (id) => {
  const result = await query(
    `UPDATE testimonials SET is_approved = true WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};

const remove = async (id) => {
  const result = await query(
    `DELETE FROM testimonials WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { listPublic, listAll, create, approve, remove };
