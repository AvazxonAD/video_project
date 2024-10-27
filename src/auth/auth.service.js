const ErrorResponse = require('../utils/errorResponse')
const pool = require('../config/db')


const getByLoginUserService = async (login) => {
    try {
        const user = await pool.query(` SELECT * FROM users WHERE login = $1`, [login]);
        if (!user.rows[0]) {
            throw new ErrorResponse('User not found', 404)
        }
        return user.rows[0]
    } catch (error) {
        throw new ErrorResponse(error, error.statusCode)
    }
}

module.exports = {
    getByLoginUserService
}