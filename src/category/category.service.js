const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { tashkentTime } = require('../utils/date.functions')

const getByNameCategoryService = async (name, user_id) => {
  try {
    const result = await pool.query(`SELECT id, name FROM category WHERE name = $1 AND isdeleted = false AND user_id = $2`, [name, user_id]);
    if (result.rows[0]) {
      throw new ErrorResponse('This data has already been entered', 409)
    }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createCategoryService = async (name, user_id) => {
  try {
    const result = await pool.query(`INSERT INTO category(name, created_at, updated_at, user_id) VALUES($1, $2, $3, $4) RETURNING * 
    `, [name, tashkentTime(), tashkentTime(), user_id]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getCategoryService = async (user_id, offset, limit) => {
  try {
    const result = await pool.query(`
      WITH data AS (SELECT id, name FROM category WHERE isdeleted = false AND user_id = $1 ORDER BY created_at OFFSET $2 LIMIT $3)
      SELECT ARRAY_AGG(row_to_json(data)) AS data, (SELECT COALESCE((COUNT(id)), 0)::INTEGER FROM category WHERE isdeleted = false AND user_id = $1) AS total_count
      FROM data
    `, [user_id, offset, limit]);
    const data = result.rows[0]
    return { data: data?.data || [], total: data.total_count };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdCategoryService = async (user_id, id, ignoreDeleted = false) => {
  try {
    let query = ``;
    if (!ignoreDeleted) {
      query = `AND isdeleted = false`;
    }
    let result = await pool.query(`SELECT id, name FROM category WHERE id = $1 AND user_id = $2 ${query}`, [id, user_id]);
    if (!result.rows[0]) {
      throw new ErrorResponse('Category not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updateCategoryService = async (name, id) => {
  try {
    const result = await pool.query(`UPDATE category SET name = $1, updated_at = $3 WHERE id = $2 RETURNING *`, [name, id, tashkentTime()]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deleteCategoryService = async (id) => {
  try {
    await pool.query(`UPDATE category SET isdeleted = $1 WHERE id = $2`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getByNameCategoryService,
  createCategoryService,
  getCategoryService,
  getByIdCategoryService,
  updateCategoryService,
  deleteCategoryService,
};
