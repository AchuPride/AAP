const { query } = require('../config/database');

const list = async () => {
  const result = await query(
    `SELECT * FROM partners ORDER BY name ASC`
  );
  return result.rows;
};

const create = async ({ name, logo_url, description, website_url, contact_info, category }) => {
  const result = await query(
    `INSERT INTO partners (name, logo_url, description, website_url, contact_info, category)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, logo_url || null, description, website_url || null, contact_info || null, category]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await query(
    `DELETE FROM partners WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0] || null;
};

module.exports = { list, create, remove };
