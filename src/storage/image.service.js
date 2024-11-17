const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { tashkentTime } = require('../utils/date.functions')

const createimageService = async (image, user_id) => {
  try {
    const result = await pool.query(`INSERT INTO image(image, created_at, updated_at, user_id) VALUES($1, $2, $3, $4) RETURNING * 
    `, [image, tashkentTime(), tashkentTime(), user_id]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getimageService = async (user_id, offset, limit) => {
  try {
    const result = await pool.query(`
      WITH data AS (SELECT id, image FROM image WHERE isdeleted = false AND user_id = $1 ORDER BY created_at OFFSET $2 LIMIT $3)
      SELECT ARRAY_AGG(row_to_json(data)) AS data, (SELECT COALESCE((COUNT(id)), 0)::INTEGER FROM image WHERE isdeleted = false AND user_id = $1) AS total_count
      FROM data
    `, [user_id, offset, limit]);
    const data = result.rows[0]
    return { data: data?.data || [], total: data.total_count };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdimageService = async (user_id, id, ignoreDeleted = false) => {
  try {
    let query = ``;
    if (!ignoreDeleted) {
      query = `AND isdeleted = false`;
    }
    let result = await pool.query(`SELECT id, image FROM image WHERE id = $1 AND user_id = $2 ${query}`, [id, user_id]);
    if (!result.rows[0]) {
      throw new ErrorResponse('image not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateimageService = async (image, id) => {
  try {
    const result = await pool.query(`UPDATE image SET image = $1, updated_at = $3 WHERE id = $2 RETURNING *`, [image, id, tashkentTime()]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteimageService = async (id) => {
  try {
    await pool.query(`UPDATE image SET isdeleted = $1 WHERE id = $2`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  createimageService,
  getimageService,
  getByIdimageService,
  updateimageService,
  deleteimageService,
};
