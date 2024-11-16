const pool = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");
const { tashkentTime } = require('../utils/date.functions')

const getBytegtegService = async (teg, user_id) => {
  try {
    const result = await pool.query(`SELECT id, teg FROM teg WHERE teg = $1 AND isdeleted = false AND user_id = $2`, [teg, user_id]);
    if (result.rows[0]) {
      throw new ErrorResponse('This data has already been entered', 409)
    }
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const createtegService = async (teg, user_id) => {
  try {
    const result = await pool.query(`INSERT INTO teg(teg, created_at, updated_at, user_id) VALUES($1, $2, $3, $4) RETURNING * 
    `, [teg, tashkentTime(), tashkentTime(), user_id]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const gettegService = async (user_id, offset, limit) => {
  try {
    const result = await pool.query(`
      WITH data AS (SELECT id, teg FROM teg WHERE isdeleted = false AND user_id = $1 ORDER BY created_at OFFSET $2 LIMIT $3)
      SELECT ARRAY_AGG(row_to_json(data)) AS data, (SELECT COALESCE((COUNT(id)), 0)::INTEGER FROM teg WHERE isdeleted = false AND user_id = $1) AS total_count
      FROM data
    `, [user_id, offset, limit]);
    const data = result.rows[0]
    return { data: data?.data || [], total: data.total_count };
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const getByIdtegService = async (user_id, id, ignoreDeleted = false) => {
  try {
    let query = ``;
    if (!ignoreDeleted) {
      query = `AND isdeleted = false`;
    }
    let result = await pool.query(`SELECT id, teg FROM teg WHERE id = $1 AND user_id = $2 ${query}`, [id, user_id]);
    if (!result.rows[0]) {
      throw new ErrorResponse('teg not found', 404)
    }
    return result.rows[0];
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const updatetegService = async (teg, id) => {
  try {
    const result = await pool.query(`UPDATE teg SET teg = $1, updated_at = $3 WHERE id = $2 RETURNING *`, [teg, id, tashkentTime()]);
    return result.rows[0]
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

const deletetegService = async (id) => {
  try {
    await pool.query(`UPDATE teg SET isdeleted = $1 WHERE id = $2`, [true, id]);
  } catch (error) {
    throw new ErrorResponse(error, error.statusCode)
  }
}

module.exports = {
  getBytegtegService,
  createtegService,
  gettegService,
  getByIdtegService,
  updatetegService,
  deletetegService,
};
