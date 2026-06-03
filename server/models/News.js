const { query } = require('../config/database');

const list = async ({ category, search, page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  const params = [];
  const conditions = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(title ILIKE $${params.length} OR content ILIKE $${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  params.push(limit, offset);
  const result = await query(
    `SELECT n.*, u.full_name AS author_name
     FROM news n
     LEFT JOIN users u ON n.author_id = u.id
     ${where}
     ORDER BY n.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const countParams = category || search ? params.slice(0, params.length - 2) : [];
  const countResult = await query(
    `SELECT COUNT(*) FROM news n ${where}`,
    countParams
  );

  return {
    articles: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
  };
};

const create = async ({ title, content, category, image_url, author_id }) => {
  const result = await query(
    `INSERT INTO news (title, content, category, image_url, author_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, content, category, image_url || null, author_id || null]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await query(
    `DELETE FROM news WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { list, create, remove };
